import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.app.rag.parser import parse_document_text
from backend.app.rag.chunker import chunk_clinical_document
from backend.app.rag.retriever import rag_retriever
from backend.app.agents.llm_client import llm_client

router = APIRouter(prefix="/rag", tags=["Document RAG"])

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Uploads and indexes a clinical document into the hybrid RAG store."""
    content_bytes = await file.read()
    raw_text = parse_document_text(file.filename, content_bytes)
    
    if len(raw_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Document contains no readable text.")
        
    doc_id = f"DOC-{uuid.uuid4().hex[:6].upper()}"
    chunks = chunk_clinical_document(doc_id, file.filename, raw_text)
    rag_retriever.add_chunks(chunks)
    
    return {
        "document_id": doc_id,
        "filename": file.filename,
        "chunks_indexed": len(chunks),
        "total_documents_in_retriever": len(rag_retriever.chunks),
        "sample_chunk": chunks[0] if chunks else None
    }

@router.post("/query")
async def query_rag(req: QueryRequest):
    """Answers clinical questions grounded strictly in uploaded documents."""
    retrieved = rag_retriever.retrieve(req.query, top_k=req.top_k or 4)
    
    if not retrieved:
        return {
            "query": req.query,
            "answer": "No relevant medical documents have been uploaded yet. Please upload reports or discharge summaries first.",
            "citations": [],
            "retrieved_chunks": []
        }
        
    context_blocks = "\n\n".join([f"Source: {c['citation']}\nContent: {c['content']}" for c in retrieved])
    
    prompt = (
        f"USER QUESTION: {req.query}\n\n"
        f"GROUNDED CONTEXT FROM UPLOADED PATIENT DOCUMENTS:\n{context_blocks}\n\n"
        "Provide a clear, clinical answer to the question based ONLY on the provided context. "
        "Cite the specific document and section in brackets [filename | Section] for every factual statement."
    )
    
    system_instruction = "You are a Medical Document RAG Assistant. Ground every answer in the provided documents and cite sources."
    answer = llm_client.generate(prompt, system_instruction=system_instruction)
    
    citations = list(set([c["citation"] for c in retrieved]))
    
    return {
        "query": req.query,
        "answer": answer,
        "citations": citations,
        "retrieved_chunks": retrieved
    }

@router.delete("/clear")
async def clear_documents():
    """Clears the RAG store."""
    rag_retriever.clear()
    return {"message": "RAG document store cleared successfully."}
