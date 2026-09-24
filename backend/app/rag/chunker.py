import re
from typing import List, Dict, Any

CLINICAL_HEADERS = [
    r"CLINICAL HISTORY",
    r"HISTORY OF PRESENT ILLNESS",
    r"INDICATION",
    r"TECHNIQUE",
    r"COMPARISON",
    r"FINDINGS",
    r"IMPRESSION",
    r"ASSESSMENT",
    r"PLAN",
    r"MEDICATIONS",
    r"PAST MEDICAL HISTORY",
    r"PHYSICAL EXAMINATION",
    r"DISCHARGE SUMMARY",
    r"CHEST PA AND LATERAL"
]

HEADER_PATTERN = re.compile(
    r"(?i)(?:^|\n)(" + "|".join(CLINICAL_HEADERS) + r")\s*[:\-\n]"
)

def chunk_clinical_document(
    document_id: str,
    filename: str,
    text: str,
    chunk_size: int = 400,
    overlap: int = 50
) -> List[Dict[str, Any]]:
    """
    Chunks a clinical document into section-aware chunks.
    Identifies clinical sections (Findings, Impression, History) and preserves headers in metadata.
    """
    # Normalize line endings
    clean_text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Split text into paragraphs
    paragraphs = [p.strip() for p in clean_text.split("\n\n") if p.strip()]
    
    chunks: List[Dict[str, Any]] = []
    current_section = "GENERAL"
    chunk_idx = 0
    
    current_buffer = []
    current_length = 0
    
    for para in paragraphs:
        # Check if this paragraph starts with a clinical section header
        match = HEADER_PATTERN.search(para)
        if match:
            current_section = match.group(1).upper()
            
        words = para.split()
        if current_length + len(words) > chunk_size and current_buffer:
            chunk_content = " ".join(current_buffer)
            chunks.append({
                "chunk_id": f"{document_id}_chunk_{chunk_idx}",
                "document_id": document_id,
                "filename": filename,
                "section": current_section,
                "chunk_index": chunk_idx,
                "content": chunk_content,
                "token_count": current_length
            })
            chunk_idx += 1
            # Keep overlap words
            overlap_words = current_buffer[-overlap:] if len(current_buffer) >= overlap else current_buffer
            current_buffer = list(overlap_words)
            current_length = len(current_buffer)
            
        current_buffer.extend(words)
        current_length += len(words)
        
    if current_buffer:
        chunk_content = " ".join(current_buffer)
        chunks.append({
            "chunk_id": f"{document_id}_chunk_{chunk_idx}",
            "document_id": document_id,
            "filename": filename,
            "section": current_section,
            "chunk_index": chunk_idx,
            "content": chunk_content,
            "token_count": current_length
        })
        
    return chunks
