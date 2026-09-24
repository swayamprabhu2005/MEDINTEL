from fastapi import APIRouter
from backend.app.memory.database import get_recent_trajectories
from backend.app.memory.learning_policy import calculate_learning_metrics
from backend.app.memory.taxonomy import FAILURE_TAXONOMY

router = APIRouter(prefix="/trajectories", tags=["Self-Learning & Trajectories"])

@router.get("")
async def list_trajectories(limit: int = 50):
    """Returns recent case execution trajectories."""
    return get_recent_trajectories(limit=limit)

@router.get("/metrics")
async def get_learning_metrics():
    """Returns aggregated self-learning and experience metrics."""
    return calculate_learning_metrics()

@router.get("/taxonomy")
async def get_failure_taxonomy():
    """Returns the 14 failure category definitions."""
    return FAILURE_TAXONOMY
