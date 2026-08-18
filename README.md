# ProductKosh (Productकोश)

ProductKosh is an enterprise-grade product intelligence platform engineered specifically for the Indian commerce and manufacturing landscape. It automates the transformation of minimal, unstructured product inputs (such as a brand name and basic title) into deeply enriched, validated, and commerce-ready catalog records mapped to standard UNSPSC taxonomy, realistic Indian market (INR) pricing, and national compliance standards.

---

## Overview

In the Indian supply chain and retail ecosystem, product data is frequently fragmented, inconsistent, and unstructured. Suppliers often provide minimal descriptions without standardized attribute keys, accurate UNSPSC classifications, or explicit regulatory compliance details.

ProductKosh addresses this challenge by combining vector-based document retrieval with grounded language model enrichment and a deterministic, category-aware validation engine. Every generated specification includes an explicit lineage trail, confidence score, and direct citation back to source technical datasheets, eliminating ungrounded hallucinations.

---

## Key Capabilities

### Grounded Technical Extraction
- Expands basic product names into comprehensive technical specifications.
- Attaches confidence scores (0.0 to 1.0), source document references, and reasoning traces to every individual attribute.
- Utilizes Google Gemini API for structured generation with an automated deterministic heuristic fallback.

### Standardized Taxonomy and Classification
- Maps incoming products to precise 8-digit UNSPSC category codes and standardized naming conventions.
- Covers consumer goods (FMCG), consumer appliances, electricals, construction materials, and heavy industrial process equipment.

### Indian Market Context and Currency
- Generates realistic Indian retail and B2B market price ranges calibrated in Indian Rupees (INR).
- Validates price boundary logic to prevent logical contradictions.

### Regulatory Compliance Mapping
- Automatically extracts and maps relevant Indian regulatory standards including:
  - FSSAI and AGMARK for food, dairy, and edible oils.
  - Bureau of Indian Standards (BIS IS) specifications across all product categories.
  - Bureau of Energy Efficiency (BEE) star ratings for home appliances.
  - Indian Boiler Regulations (IBR 1950) for process valves and piping.
  - Petroleum and Explosives Safety Organisation (PESO/CCOE) and DGMS for industrial safety equipment.
  - Legal Metrology compliance and Make in India supplier classification.

### Category-Aware Validation Engine
- Replaces rigid, one-size-fits-all checks with dynamic, category-specific validation rules.
- Enforces mandatory attributes relevant to each product family (e.g., net volume and smoke point for edible oils; cooling capacity and star rating for air conditioners; flange rating and metallurgy for industrial valves).
- Performs physical bound sanity checks (e.g., pressure within 0 to 700 Bar, temperatures within operating limits).

### Human-in-the-Loop (HITL) Review Queue
- Automatically routes records failing confidence thresholds or mandatory field checks to an interactive review queue.
- Allows catalog managers to inspect source evidence, accept valid extractions, edit values inline, or reject faulty entries with audited feedback.

### Export and Interoperability
- Supports immediate export of enriched catalogs in structured JSON and flat CSV formats for direct ingestion into ERP, PIM, or marketplace databases.

---

## Pipeline Architecture

ProductKosh operates across a 6-stage sequential pipeline:

```
+-----------------------------------------------------------------------------+
|                            ProductKosh Pipeline                             |
+-----------------------------------------------------------------------------+

  INPUT                    RETRIEVAL                GENERATION
  +----------------+       +------------------+     +-----------------------+
  | Minimal Input  | ----> | Vector Search    | --> | Grounded Extraction   |
  | (Name + Brand) |       | (TF-IDF Index    |     | (Gemini / Heuristic)  |
  +----------------+       |  196 Chunks)     |     +-----------+-----------+
                           +------------------+                 |
                                                                v
  HITL REVIEW              VALIDATION               CANONICAL RECORD
  +----------------+       +------------------+     +-----------------------+
  | Human Review   | <---- | Category-Aware   | <-- | Enriched Product      |
  | (Accept / Edit |       | Rules Engine     |     | (Specs, Standards,    |
  |  / Reject)     |       | (Bounds & Checks)|     |  INR Price, Lineage)  |
  +-------+--------+       +------------------+     +-----------------------+
          |
          v
  +----------------+
  | Commerce-Ready |
  | Export (JSON)  |
  +----------------+
```

1. **Ingestion**: Raw product names and minimal seed attributes are loaded.
2. **Retrieval**: The system queries an indexed vector corpus of over 40 Indian technical datasheets, retrieving the top 4 most relevant context chunks.
3. **Enrichment**: The model extracts structured attributes, assigning confidence scores and source citations to each key.
4. **Validation**: The record is evaluated against domain-specific constraints, bounds, and required field registries.
5. **Auditing & HITL**: Flagged records enter the human review workflow for manual verification.
6. **Export**: Validated records are finalized with complete audit lineage logs.

---

## Data Model

Each enriched record conforms to the canonical `EnrichedProduct` schema:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique record identifier. |
| `sku` | string | Generated SKU matching Indian category conventions. |
| `name` | string | Normalized product title. |
| `category` | string | Standard UNSPSC taxonomy descriptor. |
| `category_id` | string | Standard 8-digit UNSPSC code. |
| `brand` | string | Manufacturer or brand entity. |
| `description` | string | Detailed technical description grounded in source literature. |
| `specifications` | Map<string, AttributeValue> | Key-value specification map containing value, unit, confidence score, source chunk ID, excerpt, and reasoning. |
| `compliance` | ComplianceItem[] | Applicable Indian standards with individual confidence scores and citations. |
| `price_range` | PriceRange | Estimated min/max values in INR with justification. |
| `overall_confidence` | float | Composite reliability score across all extracted fields. |
| `validation_status` | string | Status flag: `clean`, `needs_review`, or `reviewed`. |
| `flagged_fields` | string[] | List of fields that triggered validation warnings or errors. |
| `validation_issues` | ValidationIssue[] | Detailed diagnostics with recommended remediation actions. |
| `lineage` | LineageLog[] | Complete chronological audit log of all transformations. |

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19, App Router)
- **Styling**: Tailwind CSS, Vanilla CSS custom design system
- **Typography**: Montserrat, Noto Sans Devanagari, Yatra One
- **Icons**: Lucide React
- **Shaders / Visuals**: WebGL shader integration

### Backend
- **Runtime**: Python 3.10+
- **API Framework**: FastAPI with Uvicorn ASGI server
- **Data Validation**: Pydantic v2
- **Information Retrieval**: Scikit-Learn (TF-IDF vectorizer and cosine similarity)
- **AI Integration**: Google Gemini API (`google-genai` SDK)

---

## Repository Structure

```
.
|-- app/                         # Next.js App Router root
|   |-- layout.tsx               # Root layout, fonts, and metadata
|   |-- page.tsx                 # View controller (Homepage & Dashboard tabs)
|   +-- globals.css              # Global styling tokens
|-- components/                  # React UI components
|   |-- HomePage.tsx             # Interactive landing page and feature navigation
|   |-- HowItWorksPage.tsx       # System walkthrough, data model, and architecture
|   |-- BatchProcessorView.tsx   # Batch execution interface with status polling
|   |-- ProductCatalogView.tsx   # Searchable catalog table and inspection drawer
|   |-- ReviewQueueView.tsx      # Human-in-the-loop audit and remediation interface
|   |-- MetricsDashboardView.tsx # Aggregated accuracy and throughput analytics
|   +-- ai-orb-header.tsx        # Application navigation bar
|-- backend/                     # FastAPI application
|   |-- main.py                  # API endpoints and route definitions
|   |-- config.py                # Configuration and environment variables
|   |-- models/
|   |   +-- product.py           # Pydantic domain models and schemas
|   +-- services/
|       |-- corpus.py            # Technical datasheet loader and indexer
|       |-- retrieval.py         # TF-IDF vector search and retrieval engine
|       |-- generation.py        # Grounded generation logic and fallback rules
|       +-- validation.py        # Category-aware validation rules engine
|-- mock_corpus/                 # Raw text datasheets and sample input corpus
|   |-- input_products.json      # 200 Indian seed products across 15+ categories
|   +-- *.txt                    # Technical specification documents
+-- public/                      # Static assets, branding, and icons
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- Python 3.10 or higher
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/a4kashhh/ProductKosh.git
cd ProductKosh
```

### 2. Backend Setup
```bash
# Navigate to project root and create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic scikit-learn numpy google-genai

# Optional: Set Gemini API key for live model generation
export GEMINI_API_KEY="your-api-key-here"

# Start the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend documentation will be accessible at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
# In a separate terminal, install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check. |
| `POST` | `/api/documents/ingest` | Ingests and indexes technical specification documents. |
| `POST` | `/api/enrich/single` | Enriches a single raw product input payload. |
| `POST` | `/api/enrich/batch` | Initiates asynchronous batch enrichment for the seed corpus. |
| `GET` | `/api/enrich/batch/status/{job_id}` | Polls progress and metrics for a running batch job. |
| `GET` | `/api/products` | Retrieves all enriched products with optional status filtering. |
| `GET` | `/api/products/{product_id}` | Retrieves a single product with full specification map and lineage. |
| `PATCH` | `/api/products/{product_id}/review` | Submits human review actions (accept, edit, reject). |
| `GET` | `/api/metrics` | Returns aggregated quality, confidence, and validation statistics. |
| `GET` | `/api/export?format=json` | Exports all records in canonical JSON format. |
| `GET` | `/api/export?format=csv` | Exports all records in flattened CSV format. |

---
