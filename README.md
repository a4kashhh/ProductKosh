# ProductKosh (Productकोश)

> **Grounded Product Catalog Intelligence for Indian Industry & Commerce**

[![Live Demo](https://img.shields.io/badge/Website-productkosh.vercel.app-black?style=flat-square&logo=vercel)](https://productkosh.vercel.app/)
[![API Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Railway-000000?style=flat-square&logo=railway)](https://railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

ProductKosh is an enterprise-grade product intelligence platform engineered specifically for the Indian commerce and industrial manufacturing landscape. It automates the transformation of minimal, unstructured product inputs (such as a brand name and basic title) into deeply enriched, validated, and commerce-ready catalog records mapped to standard **UNSPSC taxonomy**, realistic Indian market **(INR) pricing**, **GST HSN codes**, and national compliance standards (**BIS IS, FSSAI, BEE Star, IBR 1950**).

---

## Live Links

- **Frontend Website**: [https://productkosh.vercel.app/](https://productkosh.vercel.app/)
- **Backend API Docs (Swagger UI)**: `https://<your-railway-app>.up.railway.app/docs` (or `http://localhost:8000/docs` locally)
- **GitHub Repository**: [https://github.com/a4kashhh/ProductKosh](https://github.com/a4kashhh/ProductKosh)

---

## Key Capabilities

### 1. Grounded Technical Extraction (Zero Hallucinations)
- Expands basic product titles into verified technical specifications.
- Attaches confidence scores (0.0 to 1.0), source document citations (e.g. `DOC-004 §2.1`), and reasoning traces to every individual attribute.
- Built-in TF-IDF vector retrieval matched against an indexed corpus of authentic Indian OEM technical datasheets (L&T, Kirloskar, Havells, Polycab, Voltas, Fortune, etc.).

### 2. Standardized Taxonomy (UNSPSC v24.0)
- Maps incoming products to precise 8-digit UNSPSC category codes and standardized segment hierarchies.
- Covers Process Equipment, Electrical & Switchgear, HVAC & Thermal Comfort, Packaged Commodities / FMCG, and Infrastructure Steel.

### 3. Indian Market Context, INR Pricing & GST HSN
- Generates realistic Indian B2B trade list prices, wholesale discount bands, and retail MRP guidelines calibrated in Indian Rupees (₹).
- Classifies 8-digit GST HSN codes aligned with CBIC tariff schedules.

### 4. Regulatory Compliance Mapping
- Automatically extracts and audits relevant Indian statutory standards:
  - **BIS (Bureau of Indian Standards)**: ISI marks across IS 1391, IS 3854, IS 694, IS 2062, IS 1239.
  - **FSSAI & AGMARK**: 14-digit FSSAI licensing, allergen warnings, and Legal Metrology net weight rules.
  - **BEE (Bureau of Energy Efficiency)**: Star ratings and ISEER energy efficiency calculations.
  - **IBR 1950 (Indian Boiler Regulations)**: High-pressure steam certificates and metallurgy compliance.

### 5. Category-Aware Deterministic Rules Engine
- Enforces physical bound sanity checks (e.g. valve pressure within 0–700 Bar, temperature bounds).
- Enforces mandatory category-specific parameters before records can be marked clean.

### 6. Audited Human-in-the-Loop (HITL) Review Queue
- Automatically routes records with lower extraction confidence or missing parameters to catalog managers.
- Allows inline editing, single-click acceptance, rejection, and full timestamped audit lineage logs.

### 7. Export & Interoperability
- Export enriched catalogs in structured canonical JSON or flattened tabular CSV for direct ingestion into SAP, Oracle NetSuite, Akeneo, Shopify, or GeM tender templates.

---

## Pipeline Architecture

```
  RAW INPUT               VECTOR RETRIEVAL           GROUNDED GENERATION
  +----------------+      +-------------------+      +-----------------------+
  | Minimal Input  | ---> | TF-IDF Index      | ---> | Structured Extraction |
  | (Brand + Name) |      | (Indian Datasheet |      | (Exact Citations &    |
  +----------------+      |  Corpus Chunks)   |      |  Confidence Scores)   |
                          +-------------------+      +-----------+-----------+
                                                                 |
                                                                 v
  COMMERCE EXPORT         HITL REVIEW QUEUE          DETERMINISTIC VALIDATION
  +----------------+      +-------------------+      +-----------------------+
  | Clean Catalog  | <--- | Human Reviewer    | <--- | 40+ Category Rules    |
  | (JSON / CSV)   |      | (Accept/Edit/Log) | Flag | (Physical Bounds,     |
  +----------------+      +-------------------+      |  Mandatory Schemas)   |
                                                     +-----------------------+
```

---

## Production Deployment Guide

### A. Deploying Python Backend on Railway (1-Click)

1. **Sign in to [railway.app](https://railway.app)** with your GitHub account.
2. Click **New Project** &rarr; **Deploy from GitHub repo** &rarr; select **`a4kashhh/ProductKosh`**.
3. Railway automatically detects the root `Dockerfile` / `main.py` and builds the Python FastAPI container.
4. **Generate your Public HTTPS Domain**:
   - In your Railway project, click on the deployed service &rarr; go to **Settings** &rarr; **Networking**.
   - Under **"Generate Service Domain"**, enter port **`8000`** and click **Generate Domain**.
   - Copy your public domain (e.g. `https://productkosh-production.up.railway.app`).

---

### B. Deploying Frontend on Vercel

1. **Sign in to [vercel.com](https://vercel.com)** and import the **`ProductKosh`** repository.
2. Configure **Environment Variables** in Vercel (*Settings > Environment Variables*):
   ```env
   NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCIPTkkuXRL0-gj1b9YoacnQR8XD2uiEV0
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=productkosh-271d1.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=productkosh-271d1
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=productkosh-271d1.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=829432124084
   NEXT_PUBLIC_FIREBASE_APP_ID=1:829432124084:web:30192c5a1f6befadf7fde1
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9CNMGB8LC0
   ```
3. Click **Deploy** (or **Redeploy** if already created).

---

### C. Authorizing Domain in Firebase

1. Open [Firebase Console](https://console.firebase.google.com/) for project **`productkosh-271d1`**.
2. Navigate to **Authentication** &rarr; **Settings** &rarr; **Authorized domains**.
3. Add `productkosh.vercel.app` (and any custom domain).

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/a4kashhh/ProductKosh.git
cd ProductKosh
```

### 2. Run Backend (FastAPI + Python)
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start backend server
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*Interactive Swagger UI:* [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Run Frontend (Next.js 16 + React 19)
```bash
# In a separate terminal tab:
npm install
npm run dev
```
*Open:* [http://localhost:3000](http://localhost:3000)

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/metrics` | Returns aggregated quality, confidence, and validation statistics. |
| `GET` | `/api/products` | Retrieves all enriched products with optional status/category filtering. |
| `GET` | `/api/products/{id}` | Retrieves a single product with full specification map and lineage. |
| `POST` | `/api/enrich/single` | Enriches a single raw product input payload. |
| `POST` | `/api/enrich/batch` | Initiates asynchronous batch enrichment across the seed catalog. |
| `GET` | `/api/enrich/batch/status/{job_id}` | Polls progress and throughput metrics for a running batch job. |
| `POST` | `/api/products/{id}/review` | Submits human review actions (`accept`, `edit`, `reject`) with audit notes. |
| `GET` | `/api/export?format=json` | Exports all records in canonical JSON format with full lineage. |
| `GET` | `/api/export?format=csv` | Exports all records in flattened CSV tabular format. |

---

## Technology Stack

- **Frontend**: Next.js 16 (React 19, App Router, TypeScript)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons, Paper Design Shaders
- **Backend**: FastAPI, Uvicorn, Pydantic v2, Python 3.11
- **Machine Learning & RAG**: Scikit-Learn (TF-IDF vectorizer + Cosine Similarity)
- **Authentication**: Firebase Authentication (Google OAuth, Apple, Email/Password, Phone OTP)
- **Cloud Hosting**: Vercel (Frontend) + Railway / Render (Backend Docker Container)

---

## Author & Copyright

**© a4kashhh**
ProductKosh — Indian Product Intelligence & Governance Platform
