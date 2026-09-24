import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "static"
WEIGHTS_DIR = BASE_DIR / "weights"
DB_PATH = BASE_DIR / "medintel.db"

# Ensure directories exist
STATIC_DIR.mkdir(parents=True, exist_ok=True)
WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "MEDINTEL"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # API Keys (defaults to environment variables)
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    NCBI_API_KEY: str = os.getenv("NCBI_API_KEY", "")
    
    # Model Configurations
    ORCHESTRATOR_MODEL: str = os.getenv("ORCHESTRATOR_MODEL", "meta/llama-3.1-70b-instruct")
    VISION_ANALYST_MODEL: str = os.getenv("VISION_ANALYST_MODEL", "microsoft/phi-3-vision-128k-instruct")
    RESEARCHER_MODEL: str = os.getenv("RESEARCHER_MODEL", "mistralai/mixtral-8x22b-instruct")
    VERIFIER_MODEL: str = os.getenv("VERIFIER_MODEL", "meta/llama-3.1-70b-instruct")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "gemini-1.5-flash")
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    STATIC_DIR: Path = STATIC_DIR
    WEIGHTS_DIR: Path = WEIGHTS_DIR
    DB_PATH: Path = DB_PATH
    
    # Hardware & Performance Watchdog
    MAX_MEMORY_MB: int = int(os.getenv("MAX_MEMORY_MB", "450"))
    ONNX_WEIGHTS_PATH: Path = WEIGHTS_DIR / "medintel_cxr.onnx"
    PT_WEIGHTS_PATH: Path = WEIGHTS_DIR / "medintel_cxr_densenet121.pt"
    
settings = Settings()
