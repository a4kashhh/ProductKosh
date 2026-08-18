import json
import time
import uuid
import threading
from typing import Dict, List, Any, Optional
from backend.models.product import ProductInput, EnrichedProduct, BatchJobStatus, ReviewAction, LineageLog, AttributeValue
from backend.services.retrieval import retrieval_service
from backend.services.generation import generation_service
from backend.services.validation import validation_engine
from datetime import datetime

class BatchEngine:
    def __init__(self):
        self.products_db: Dict[str, EnrichedProduct] = {}
        self.jobs_db: Dict[str, BatchJobStatus] = {}
        self.lock = threading.Lock()

    def process_single_product(self, input_prod: ProductInput) -> EnrichedProduct:
        # Step 1: Retrieval
        chunks = retrieval_service.retrieve_candidate_chunks(
            product_name=input_prod.name,
            known_attributes=input_prod.known_attributes,
            top_k=4
        )

        # Step 2: Generation
        enriched = generation_service.enrich_product(input_prod, chunks)

        # Step 3: Validation
        validated = validation_engine.validate_product(enriched)

        # Lineage audit log entry
        validated.lineage.insert(0, LineageLog(
            timestamp=datetime.utcnow().isoformat(),
            stage="retrieval",
            action="candidate_chunk_retrieval",
            detail=f"Retrieved {len(chunks)} candidate source document chunks via vector search.",
            metadata={"top_chunk": chunks[0]["chunk_id"] if chunks else "N/A"}
        ))
        validated.lineage.insert(1, LineageLog(
            timestamp=datetime.utcnow().isoformat(),
            stage="generation",
            action="grounded_extraction",
            detail=f"Extracted {len(validated.specifications)} specifications with grounded reasoning.",
            metadata={"brand": validated.brand, "category": validated.category}
        ))

        # Save into memory DB
        with self.lock:
            self.products_db[validated.id] = validated

        return validated

    def start_batch_job(self, products: List[ProductInput], job_id: Optional[str] = None) -> BatchJobStatus:
        if not job_id:
            job_id = f"JOB-{uuid.uuid4().hex[:8].upper()}"

        job = BatchJobStatus(
            job_id=job_id,
            total_items=len(products),
            processed_items=0,
            validated_clean_items=0,
            flagged_items=0,
            avg_confidence=0.0,
            status="running",
            logs=[f"[{datetime.utcnow().strftime('%H:%M:%S')}] Started batch job {job_id} with {len(products)} products."]
        )

        with self.lock:
            self.jobs_db[job_id] = job

        # Run batch worker in background thread
        thread = threading.Thread(target=self._run_batch_worker, args=(job_id, products), daemon=True)
        thread.start()

        return job

    def _run_batch_worker(self, job_id: str, products: List[ProductInput]):
        total_conf = 0.0

        for idx, prod in enumerate(products):
            with self.lock:
                if job_id in self.jobs_db:
                    self.jobs_db[job_id].current_product = prod.name
                    self.jobs_db[job_id].logs.append(
                        f"[{datetime.utcnow().strftime('%H:%M:%S')}] Processing item {idx+1}/{len(products)}: {prod.name}"
                    )

            # Process single product
            enriched = self.process_single_product(prod)
            total_conf += enriched.overall_confidence

            with self.lock:
                if job_id in self.jobs_db:
                    job = self.jobs_db[job_id]
                    job.processed_items += 1
                    if enriched.validation_status == "clean":
                        job.validated_clean_items += 1
                    else:
                        job.flagged_items += 1
                    
                    job.avg_confidence = round(total_conf / job.processed_items, 3)

            # Brief pacing delay for batch progress visualization
            time.sleep(0.08)

        with self.lock:
            if job_id in self.jobs_db:
                job = self.jobs_db[job_id]
                job.status = "completed"
                job.completion_time = datetime.utcnow().isoformat()
                job.current_product = None
                job.logs.append(
                    f"[{datetime.utcnow().strftime('%H:%M:%S')}] Batch job {job_id} completed! Processed: {job.processed_items}, Clean: {job.validated_clean_items}, Flagged: {job.flagged_items}."
                )

    def get_job_status(self, job_id: str) -> Optional[BatchJobStatus]:
        with self.lock:
            return self.jobs_db.get(job_id)

    def get_all_products(self, category: Optional[str] = None, status: Optional[str] = None) -> List[EnrichedProduct]:
        with self.lock:
            prods = list(self.products_db.values())

        if category:
            prods = [p for p in prods if category.lower() in p.category_name.lower()]
        if status:
            prods = [p for p in prods if p.validation_status.lower() == status.lower()]

        return prods

    def get_product(self, product_id: str) -> Optional[EnrichedProduct]:
        with self.lock:
            return self.products_db.get(product_id)

    def submit_review(self, product_id: str, action: ReviewAction) -> Optional[EnrichedProduct]:
        with self.lock:
            product = self.products_db.get(product_id)
            if not product:
                return None

            field_name = action.field_name
            if action.action == "accept":
                if field_name in product.specifications:
                    product.specifications[field_name].status = "reviewer_accepted"
                    product.specifications[field_name].confidence_score = 1.0
                    product.specifications[field_name].review_comment = action.comment or "Accepted by reviewer."

            elif action.action == "edit":
                if field_name in product.specifications:
                    attr = product.specifications[field_name]
                    attr.value = action.edited_value if action.edited_value is not None else attr.value
                    attr.unit = action.edited_unit if action.edited_unit is not None else attr.unit
                    attr.status = "reviewer_edited"
                    attr.confidence_score = 1.0
                    attr.review_comment = action.comment or "Manually corrected by reviewer."
                else:
                    # Add new edited spec
                    product.specifications[field_name] = AttributeValue(
                        value=action.edited_value or "Specified",
                        unit=action.edited_unit,
                        confidence_score=1.0,
                        source_chunk_id="HITL_REVIEW",
                        source_doc_name="Human Reviewer Input",
                        reasoning=action.comment or "Added during human-in-the-loop review.",
                        status="reviewer_edited"
                    )

            elif action.action == "reject":
                if field_name in product.specifications:
                    product.specifications[field_name].status = "reviewer_rejected"
                    product.specifications[field_name].confidence_score = 0.0
                    product.specifications[field_name].review_comment = action.comment or "Rejected by reviewer."

            # Remove from flagged list
            if field_name in product.flagged_fields:
                product.flagged_fields.remove(field_name)

            # Re-evaluate product status
            if not product.flagged_fields:
                product.validation_status = "reviewed"
                product.overall_confidence = 0.98

            # Add lineage log
            product.lineage.append(LineageLog(
                timestamp=datetime.utcnow().isoformat(),
                stage="review",
                action=f"field_{action.action}",
                detail=f"Reviewer performed '{action.action}' on field '{field_name}'. Comment: {action.comment or 'None'}",
                metadata={"field": field_name, "action": action.action}
            ))

            return product

    def get_dashboard_metrics(self) -> Dict[str, Any]:
        with self.lock:
            prods = list(self.products_db.values())

        if not prods:
            return {
                "total_products": 0,
                "clean_count": 0,
                "flagged_count": 0,
                "reviewed_count": 0,
                "pct_validated": 0.0,
                "pct_flagged": 0.0,
                "avg_confidence": 0.0,
                "total_fields": 0,
                "validated_fields": 0,
                "category_breakdown": {},
                "status_breakdown": {}
            }

        total_prods = len(prods)
        clean_count = sum(1 for p in prods if p.validation_status == "clean")
        flagged_count = sum(1 for p in prods if p.validation_status == "needs_review")
        reviewed_count = sum(1 for p in prods if p.validation_status == "reviewed")
        avg_conf = round(sum(p.overall_confidence for p in prods) / total_prods, 3)

        total_fields = sum(len(p.specifications) for p in prods)
        flagged_fields_total = sum(len(p.flagged_fields) for p in prods)
        validated_fields = max(0, total_fields - flagged_fields_total)

        cat_breakdown = {}
        for p in prods:
            c_name = p.category_name
            cat_breakdown[c_name] = cat_breakdown.get(c_name, 0) + 1

        return {
            "total_products": total_prods,
            "clean_count": clean_count,
            "flagged_count": flagged_count,
            "reviewed_count": reviewed_count,
            "pct_validated": round((clean_count + reviewed_count) / total_prods * 100, 1),
            "pct_flagged": round(flagged_count / total_prods * 100, 1),
            "avg_confidence": avg_conf,
            "total_fields": total_fields,
            "validated_fields": validated_fields,
            "category_breakdown": cat_breakdown,
            "status_breakdown": {
                "clean": clean_count,
                "needs_review": flagged_count,
                "reviewed": reviewed_count
            }
        }

batch_engine = BatchEngine()
