from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from backend.app.cv.inference import run_vision_inference
from backend.app.cv.gradcam import generate_saliency_heatmap
from backend.app.cv.labels import MODALITIES

router = APIRouter(prefix="/vision", tags=["Computer Vision"])

@router.get("/modalities")
async def list_modalities():
    """Returns the list of all 8 supported clinical imaging modalities."""
    return MODALITIES

@router.post("/analyze")
async def analyze_medical_image(
    file: UploadFile = File(...),
    modality: str = Form("chest_xray"),
    target_pathology: Optional[str] = Form(None)
):
    """
    Analyzes an uploaded medical scan across any of the 8 clinical imaging modalities:
    (chest_xray, brain_mri, dermatology, ophthalmology, mammography, histopathology, kidney_ct, lung_ct).
    Generates calibrated probabilities and Grad-CAM localization heatmaps.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
        
    image_bytes = await file.read()
    
    # 1. Pathology Classification
    vision_results = run_vision_inference(image_bytes, modality=modality)
    
    # 2. Grad-CAM Localization
    selected_pathology = target_pathology or (
        vision_results.get("top_finding", {}).get("pathology") or 
        MODALITIES.get(modality, MODALITIES["chest_xray"])["classes"][0]
    )
    saliency = generate_saliency_heatmap(image_bytes, target_class=selected_pathology, modality=modality)
    
    return {
        **vision_results,
        "saliency": saliency
    }
