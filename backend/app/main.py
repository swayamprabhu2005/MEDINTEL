import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.memory_guard import get_process_memory_mb, check_memory_guard
from backend.app.api.routes_vision import router as vision_router
from backend.app.api.routes_rag import router as rag_router
from backend.app.api.routes_search import router as search_router
from backend.app.api.routes_agents import router as agents_router
from backend.app.api.routes_trajectories import router as trajectories_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Multimodal Medical Intelligence & Evidence Network — Research Decision Support Platform"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static folder for logo and media
app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")

# Include API Routers
app.include_router(vision_router, prefix=settings.API_V1_PREFIX)
app.include_router(rag_router, prefix=settings.API_V1_PREFIX)
app.include_router(search_router, prefix=settings.API_V1_PREFIX)
app.include_router(agents_router, prefix=settings.API_V1_PREFIX)
app.include_router(trajectories_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    mem_mb = get_process_memory_mb()
    has_onnx = settings.ONNX_WEIGHTS_PATH.exists()
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "status": "ONLINE",
        "memory_usage_mb": round(mem_mb, 1),
        "onnx_model_installed": has_onnx,
        "active_models": {
            "orchestrator": settings.ORCHESTRATOR_MODEL,
            "vision_analyst": settings.VISION_ANALYST_MODEL,
            "researcher": settings.RESEARCHER_MODEL,
            "verifier": settings.VERIFIER_MODEL,
            "fallback": settings.FALLBACK_MODEL
        },
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    mem_mb = check_memory_guard()
    return {
        "status": "healthy",
        "process_ram_mb": round(mem_mb, 1),
        "ram_limit_mb": settings.MAX_MEMORY_MB
    }
