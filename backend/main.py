import os
import json
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router
from backend.services.retrieval import retrieval_service
from backend.services.batch_engine import batch_engine
from backend.models.product import ProductInput
from backend.config import settings

app = FastAPI(
    title="CatalogIQ — Product Intelligence Platform",
    description="AI-powered product data enrichment, validation, explainability, and catalog engine.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def startup_event():
    print("[CatalogIQ Backend] Startup initialized...")
    try:
        # Ingest document corpus
        chunk_count = retrieval_service.ingest_corpus()
        print(f"[CatalogIQ Backend] Ingested {chunk_count} document chunks.")
        
        # Pre-seed initial 75 products into batch engine synchronously for instant demo readiness
        if os.path.exists(settings.INPUT_PRODUCTS_FILE):
            with open(settings.INPUT_PRODUCTS_FILE, "r", encoding="utf-8") as f:
                raw = json.load(f)
                products = [ProductInput(**item) for item in raw[:75]]
                
            print(f"[CatalogIQ Backend] Pre-loading initial batch of {len(products)} products...")
            for p in products:
                batch_engine.process_single_product(p)
            print(f"[CatalogIQ Backend] Pre-loaded {len(batch_engine.products_db)} products into memory DB.")
    except Exception as e:
        print(f"[CatalogIQ Backend] Error during startup pre-load: {e}")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
