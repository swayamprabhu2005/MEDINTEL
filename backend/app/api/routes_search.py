from fastapi import APIRouter, Query
from backend.app.search.pubmed import search_pubmed

router = APIRouter(prefix="/search", tags=["Medical Search"])

@router.get("/pubmed")
async def get_pubmed_evidence(
    query: str = Query(..., description="Biomedical search topic, pathology, or question"),
    max_results: int = Query(5, ge=1, le=15)
):
    """
    Retrieves peer-reviewed medical literature, clinical trials, and practice guidelines from PubMed.
    """
    articles = search_pubmed(query, max_results=max_results)
    return {
        "query": query,
        "total_results": len(articles),
        "articles": articles
    }
