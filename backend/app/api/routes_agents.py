from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from backend.app.agents.orchestrator import orchestrator

router = APIRouter(prefix="/orchestrate", tags=["Multi-Agent Orchestration"])

@router.post("")
async def orchestrate_case(
    file: Optional[UploadFile] = File(None),
    symptoms: str = Form(""),
    case_domain: str = Form("chest_radiology"),
    modality: str = Form("chest_xray")
):
    """
    Executes an end-to-end multimodal clinical decision-support pipeline across any of the 8 modalities:
    1. Vision Analysis & Grad-CAM (if scan provided)
    2. Clinical Context Agent (integrating patient records & history)
    3. Evidence Researcher Agent (querying PubMed guidelines)
    4. Reasoning & Synthesis Agent (assembling integrated impression)
    5. Skeptic / Verifier Agent (auditing claims & detecting hallucinations)
    6. Trajectory Recording (persisting to SQLite for self-learning loop)
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
        
    result = orchestrator.orchestrate_multimodal_case(
        image_bytes=image_bytes,
        symptoms=symptoms,
        case_domain=case_domain,
        modality=modality
    )
    return result
