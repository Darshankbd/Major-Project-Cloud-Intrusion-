import os
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api.endpoints import router as api_router
from backend.app.api.websocket import ws_router
from backend.app.ml.predictor import predictor_service
from backend.app.services.traffic_simulator import traffic_simulator
from ml_engine.train_models import train_and_evaluate

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Cloud Intrusion Detection & Employee Security Governance Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.on_event("startup")
async def startup_event():
    print("Initializing CloudGuard ML-IDS Enterprise Backend Service...")
    meta_path = os.path.join(settings.MODEL_DIR, "metadata.json")
    if not os.path.exists(meta_path):
        print("ML Models missing. Running dataset generation & model training...")
        train_and_evaluate()

    predictor_service.load_models()
    traffic_simulator.start()
    
    asyncio.create_task(traffic_simulator.broadcast_loop())
    print("Backend ready and traffic broadcast loop activated.")

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
