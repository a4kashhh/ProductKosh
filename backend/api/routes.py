import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Response
from backend.models.product import ProductInput, EnrichedProduct, BatchJobStatus, ReviewAction
from backend.services.retrieval import retrieval_service
from backend.services.batch_engine import batch_engine
from backend.config import settings

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "CatalogIQ Product Intelligence Engine",
        "indexed_chunks": len(retrieval_service.chunks),
        "total_products_in_db": len(batch_engine.products_db)
    }

@router.post("/documents/ingest")
def ingest_documents():
    chunk_count = retrieval_service.ingest_corpus()
    return {
        "status": "success",
        "message": f"Successfully ingested and indexed {chunk_count} document chunks from source corpus.",
        "chunk_count": chunk_count
    }

@router.post("/enrich/single", response_model=EnrichedProduct)
def enrich_single_product(input_prod: ProductInput):
    try:
        enriched = batch_engine.process_single_product(input_prod)
        return enriched
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enriching product: {str(e)}")

@router.post("/enrich/batch", response_model=BatchJobStatus)
def start_batch_enrichment(products: Optional[List[ProductInput]] = None):
    try:
        if not products:
            # Load default 75 mock products from file
            with open(settings.INPUT_PRODUCTS_FILE, "r", encoding="utf-8") as f:
                raw = json.load(f)
                products = [ProductInput(**item) for item in raw]
                
        # Ensure corpus is indexed
        if not retrieval_service.is_indexed:
            retrieval_service.ingest_corpus()

        job = batch_engine.start_batch_job(products)
        return job
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to launch batch job: {str(e)}")

@router.get("/enrich/batch/status/{job_id}", response_model=BatchJobStatus)
def get_batch_job_status(job_id: str):
    job = batch_engine.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch job ID not found.")
    return job

@router.get("/products", response_model=List[EnrichedProduct])
def get_products(category: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    return batch_engine.get_all_products(category=category, status=status)

@router.get("/products/{product_id}", response_model=EnrichedProduct)
def get_product_by_id(product_id: str):
    product = batch_engine.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found.")
    return product

@router.post("/products/{product_id}/review", response_model=EnrichedProduct)
def submit_product_review(product_id: str, action: ReviewAction):
    updated = batch_engine.submit_review(product_id, action)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found.")
    return updated

@router.get("/metrics")
def get_metrics():
    return batch_engine.get_dashboard_metrics()

@router.get("/export")
def export_catalog(format: str = Query("json")):
    products = batch_engine.get_all_products()
    
    if format.lower() == "csv":
        import io
        import csv
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "SKU", "Name", "Category", "Brand", "Validation Status", "Overall Confidence", "Specs Count", "Flagged Fields"])
        
        for p in products:
            writer.writerow([
                p.id, p.sku, p.name, p.category, p.brand,
                p.validation_status, p.overall_confidence,
                len(p.specifications), ";".join(p.flagged_fields)
            ])
            
        return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=catalogiq_validated_products.csv"})
    else:
        content = json.dumps([p.dict() for p in products], indent=2)
        return Response(content=content, media_type="application/json", headers={"Content-Disposition": "attachment; filename=catalogiq_validated_products.json"})
