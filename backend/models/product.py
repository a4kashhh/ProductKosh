from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime

class AttributeValue(BaseModel):
    value: Union[str, float, int, List[str], Dict[str, Any]]
    unit: Optional[str] = None
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    source_chunk_id: Optional[str] = None
    source_doc_name: Optional[str] = None
    source_excerpt: Optional[str] = None
    reasoning: str = Field(..., description="One-line explainability rationale for this extracted field")
    status: str = Field(default="auto_validated", description="Status: auto_validated, needs_review, reviewer_accepted, reviewer_edited, reviewer_rejected")
    review_comment: Optional[str] = None

class ComplianceItem(BaseModel):
    standard: str
    status: str = "certified" # certified, compliant, self_declared
    confidence_score: float = 0.9
    source_chunk_id: Optional[str] = None
    source_doc_name: Optional[str] = None
    reasoning: str = ""

class PriceRange(BaseModel):
    min_price: float = 0.0
    max_price: float = 0.0
    currency: str = "USD"
    confidence_score: float = 0.8
    source_chunk_id: Optional[str] = None
    reasoning: str = ""

class ProductInput(BaseModel):
    id: str
    name: str
    category_hint: Optional[str] = None
    known_attributes: Dict[str, Any] = Field(default_factory=dict)

class ValidationIssue(BaseModel):
    field_name: str
    issue_type: str # unit_mismatch, out_of_range, contradiction, missing_required, low_confidence
    severity: str # error, warning
    message: str
    suggested_action: str

class LineageLog(BaseModel):
    timestamp: str
    stage: str # retrieval, generation, validation, review
    action: str
    detail: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EnrichedProduct(BaseModel):
    id: str
    sku: str
    name: str
    category: str # Standard UNSPSC Taxonomy string e.g. "UNSPSC 40141600: Industrial Valves"
    category_id: str = "40141600"
    category_name: str = "Industrial Valves"
    brand: str
    description: str
    specifications: Dict[str, AttributeValue] = Field(default_factory=dict)
    compliance: List[ComplianceItem] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    price_range: PriceRange
    overall_confidence: float = Field(..., ge=0.0, le=1.0)
    validation_status: str = "clean" # clean, needs_review, reviewed
    flagged_fields: List[str] = Field(default_factory=list)
    validation_issues: List[ValidationIssue] = Field(default_factory=list)
    lineage: List[LineageLog] = Field(default_factory=list)
    input_data: Optional[Dict[str, Any]] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class BatchJobStatus(BaseModel):
    job_id: str
    total_items: int
    processed_items: int = 0
    validated_clean_items: int = 0
    flagged_items: int = 0
    avg_confidence: float = 0.0
    status: str = "idle" # idle, running, completed, failed
    current_product: Optional[str] = None
    logs: List[str] = Field(default_factory=list)
    start_time: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    completion_time: Optional[str] = None

class ReviewAction(BaseModel):
    field_name: str
    action: str # accept, edit, reject
    edited_value: Optional[Any] = None
    edited_unit: Optional[str] = None
    comment: Optional[str] = None
