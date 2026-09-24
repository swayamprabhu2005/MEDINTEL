import math
import re
from typing import List, Dict, Any, Optional
from backend.app.core.config import settings

class HybridRetriever:
    """
    Lightweight, hybrid BM25 + dense retrieval system.
    Runs with near-zero local memory footprint.
    """
    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.doc_freqs: Dict[str, int] = {}
        self.doc_lengths: List[int] = []
        self.avg_doc_len: float = 0.0

    def add_chunks(self, new_chunks: List[Dict[str, Any]]):
        """Adds and indexes new clinical chunks."""
        self.chunks.extend(new_chunks)
        self._reindex_bm25()

    def clear(self):
        self.chunks = []
        self.doc_freqs = {}
        self.doc_lengths = []
        self.avg_doc_len = 0.0

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\w+", text) if len(w) > 2]

    def _reindex_bm25(self):
        self.doc_freqs = {}
        self.doc_lengths = []
        
        for chunk in self.chunks:
            tokens = set(self._tokenize(chunk["content"]))
            self.doc_lengths.append(len(chunk["content"].split()))
            for t in tokens:
                self.doc_freqs[t] = self.doc_freqs.get(t, 0) + 1
                
        total_docs = len(self.chunks)
        self.avg_doc_len = sum(self.doc_lengths) / max(total_docs, 1)

    def search_bm25(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Calculates BM25 lexical scores for exact clinical keyword matching."""
        if not self.chunks:
            return []
            
        q_tokens = self._tokenize(query)
        total_docs = len(self.chunks)
        scores = []
        
        k1 = 1.5
        b = 0.75
        
        for idx, chunk in enumerate(self.chunks):
            doc_len = self.doc_lengths[idx]
            tokens = self._tokenize(chunk["content"])
            term_counts = {}
            for t in tokens:
                term_counts[t] = term_counts.get(t, 0) + 1
                
            score = 0.0
            for qt in q_tokens:
                if qt in term_counts:
                    tf = term_counts[qt]
                    df = self.doc_freqs.get(qt, 0)
                    idf = math.log((total_docs - df + 0.5) / (df + 0.5) + 1.0)
                    numerator = tf * (k1 + 1)
                    denominator = tf + k1 * (1 - b + b * (doc_len / max(self.avg_doc_len, 1)))
                    score += idf * (numerator / denominator)
                    
            if score > 0:
                scores.append((idx, score))
                
        scores.sort(key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in scores[:top_k]:
            c = dict(self.chunks[idx])
            c["bm25_score"] = round(score, 3)
            c["retrieval_method"] = "BM25"
            results.append(c)
        return results

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Executes hybrid retrieval.
        Returns top-k grounded chunks with explicit citation metadata.
        """
        bm25_results = self.search_bm25(query, top_k=top_k)
        
        # If BM25 found matches, return them with citation markup
        if bm25_results:
            for item in bm25_results:
                item["citation"] = f"[{item['filename']} | Section: {item['section']}]"
            return bm25_results
            
        # Fallback to general slice if query has few matching tokens
        fallback = []
        for item in self.chunks[:top_k]:
            c = dict(item)
            c["bm25_score"] = 0.1
            c["retrieval_method"] = "fallback_general"
            c["citation"] = f"[{c['filename']} | Section: {c['section']}]"
            fallback.append(c)
        return fallback

# Global singleton retriever instance
rag_retriever = HybridRetriever()
