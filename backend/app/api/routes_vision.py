from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from backend.app.cv.inference import run_vision_inference
from backend.app.cv.gradcam import generate_saliency_heatmap

router = APIRouter(prefix="/vision", tags=["Computer Vision"])

@router.post("/analyze")
async def analyze_chest_xray(
    file: UploadFile = File(...),
    target_pathology: Optional[str] = Form(None)
):
    """
    Analyzes an uploaded chest radiograph for 14 pathologies.
    Generates calibrated probabilities and Grad-CAM localization heatmaps.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
        
    image_bytes = await file.read()
    
    # 1. Pathology Classification
    vision_results = run_vision_inference(image_bytes)
    
    # 2. Grad-CAM Localization
    selected_pathology = target_pathology or (
        vision_results.get("top_finding", {}).get("pathology") or "Pneumonia"
    )
    saliency = generate_saliency_heatmap(image_bytes, target_class=selected_pathology)
    
    return {
        **vision_results,
        "saliency": saliency
    }
