"use client"

import React, { useState } from "react"
import {
  ArrowLeft, Database, Cpu, ShieldCheck, Users, Package,
  FileText, Search, Zap, CheckCircle, AlertTriangle,
  ArrowRight, ChevronDown, ChevronUp, BookOpen, Code2,
  Globe, IndianRupee
} from "lucide-react"

interface HowItWorksProps {
  onBack: () => void
}

const steps = [
  {
    num: "01",
    icon: Package,
    color: "bg-orange-50 border-orange-100",
    iconColor: "text-orange-500",
    title: "Minimal Product Input",
    subtitle: "You provide almost nothing",
    body: "All you need is a product name and one or two known attributes — like brand or type. No full specification sheets, no manual data entry. Productकोश does the heavy lifting from there.",
    examples: [
      { label: "Input", value: '{ "name": "Voltas 1.5T Inverter AC", "brand": "Voltas" }' },
      { label: "Or", value: '{ "name": "Tata Tea Gold 500g", "brand": "Tata Consumer Products" }' },
    ],
    note: "Works for FMCG, electricals, hardware, industrial valves, pumps, instruments — any Indian product.",
  },
  {
    num: "02",
    icon: Search,
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-500",
    title: "Vector Retrieval Engine",
    subtitle: "Finds the right source documents",
    body: "The system uses TF-IDF vector search (semantic similarity) to scan across 40+ Indian technical specification datasheets, FMCG product manuals, and engineering documents. It retrieves the top 4 most relevant source chunks for each product.",
    examples: [
      { label: "Source Corpus", value: "20 Indian datasheets: L&T Valves, Kirloskar Pumps, Forbes Marshall, Dabur Honey, Amul Butter, Havells Fan, Asian Paints Royale, Polycab Wires..." },
      { label: "Method", value: "TF-IDF vectorisation + cosine similarity ranking across 196 indexed document chunks" },
    ],
    note: "Every retrieved chunk carries a chunk_id and doc_name — the proof source used to ground each specification.",
  },
  {
    num: "03",
    icon: Cpu,
    color: "bg-violet-50 border-violet-100",
    iconColor: "text-violet-500",
    title: "AI Enrichment Engine",
    subtitle: "Generates the full structured record",
    body: "A grounded extraction engine reads the retrieved source chunks and builds a complete, structured product record. Every field carries a confidence score (0–1), a source chunk ID, a direct source excerpt, and a reasoning trace explaining why that value was extracted.",
    examples: [
      { label: "Gemini API (if key present)", value: "Structured JSON mode → grounded against retrieved context. Never hallucinates beyond the source." },
      { label: "Heuristic Fallback", value: "Regex-based precision extraction from datasheet text when no API key is present — guaranteed 0 crashes." },
    ],
    note: "Fields include: name, SKU, UNSPSC category, brand, description, specifications, compliance, price range, overall confidence, lineage log.",
  },
  {
    num: "04",
    icon: ShieldCheck,
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-500",
    title: "Category-Aware Validation",
    subtitle: "Rules tailored to each product type",
    body: "After generation, every record goes through a multi-layer validation engine. Rules are 100% category-aware — Tata Tea is never asked for 'Wetted Material'. Voltas AC is never asked for 'Net Weight / Quantity'. Each category has its own specific required fields.",
    examples: [
      { label: "FMCG (Tea, Dairy, Oil)", value: "Required: Net Weight, Fat Content (dairy), Smoke Point (oils). Checks: FSSAI license present." },
      { label: "Appliances (AC, Fan, Geyser)", value: "Required: Cooling Capacity + BEE Star (AC), Sweep Size + Air Delivery (fan). Checks: BEE rating present." },
      { label: "Industrial Valves", value: "Required: Valve Size, Pressure Class, Body Material. Checks: IBR/PESO compliance, physical pressure bounds 0–700 Bar." },
    ],
    note: "Additional checks: price min > max contradiction, temperature bounds (-273°C to 1500°C), low confidence threshold flags, wrong currency (must be INR).",
  },
  {
    num: "05",
    icon: AlertTriangle,
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
    title: "Human-In-The-Loop Review (HITL)",
    subtitle: "Humans review flagged records",
    body: "Products that fail validation are not discarded — they are routed to the Review Queue where a human reviewer can Accept, Edit, or Reject each field individually. Accepted records become 'reviewed' status and are marked with reviewer metadata.",
    examples: [
      { label: "Accept", value: "Field is correct — mark as human-verified. Confidence boosted to 1.0." },
      { label: "Edit", value: "Correct the value inline — field is updated and re-validated before saving." },
      { label: "Reject", value: "Field is incorrect — flagged as rejected with a rejection reason note." },
    ],
    note: "Only records in 'needs_review' status appear in the queue. Clean records bypass HITL entirely.",
  },
  {
    num: "06",
    icon: Database,
    color: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-500",
    title: "Commerce-Ready Output",
    subtitle: "Export structured catalog records",
    body: "Once validated (automatically or by a human reviewer), records are ready to export. Every record includes full lineage — a timestamp log of every stage it passed through, what was extracted, and how confident the system was at each step.",
    examples: [
      { label: "Export JSON", value: "Full structured product records with specs, compliance, price, lineage, and confidence scores." },
      { label: "Export CSV", value: "Flat tabular format for direct import into ERP, PIM, or e-commerce platforms." },
    ],
    note: "Indian pricing is in INR (₹). Compliance standards include FSSAI, BIS IS, BEE Star, IBR 1950, PESO/CCOE, DGMS, Make in India.",
  },
]

const dataModel = [
  { field: "id / sku", type: "string", desc: "Unique product ID and Indian SKU code (e.g. SKU-IND-40101701-PROD-010)" },
  { field: "name", type: "string", desc: "Full product name as provided in the input" },
  { field: "category", type: "string", desc: "UNSPSC taxonomy label (e.g. UNSPSC 40101701: Split / Window Air Conditioners)" },
  { field: "category_id", type: "string", desc: "6-digit UNSPSC code" },
  { field: "brand", type: "string", desc: "Manufacturer brand (grounded from source datasheet or input)" },
  { field: "description", type: "string", desc: "Auto-generated product description referencing source document" },
  { field: "specifications", type: "Map<string, AttributeValue>", desc: "Key-value map of spec fields. Each field has: value, unit, confidence_score (0–1), source_chunk_id, source_excerpt, reasoning" },
  { field: "compliance", type: "ComplianceItem[]", desc: "Indian standards list: FSSAI, BIS IS, BEE, IBR, PESO, DGMS, Make in India. Each with confidence_score and reasoning." },
  { field: "price_range", type: "PriceRange", desc: "min_price, max_price in INR (₹), currency='INR', confidence_score, reasoning" },
  { field: "overall_confidence", type: "float (0–1)", desc: "Aggregate confidence score across all extracted fields. Penalised for each flagged issue." },
  { field: "validation_status", type: "enum", desc: "'clean' | 'needs_review' | 'reviewed'" },
  { field: "flagged_fields", type: "string[]", desc: "List of field names that failed validation rules" },
  { field: "validation_issues", type: "ValidationIssue[]", desc: "Detailed issue list: field_name, issue_type, severity, message, suggested_action" },
  { field: "lineage", type: "LineageLog[]", desc: "Full pipeline audit trail: retrieval → generation → validation timestamps, actions, metadata" },
]

const indianStandards = [
  { std: "FSSAI", full: "Food Safety & Standards Authority of India", applies: "All food, beverage, dairy, honey, edible oil products" },
  { std: "AGMARK", full: "Agricultural Marketing Standard", applies: "Butter, honey, edible oils — Grade 1 / Grade Special" },
  { std: "BEE Star", full: "Bureau of Energy Efficiency India", applies: "Air conditioners, geysers, ceiling fans, voltage stabilizers" },
  { std: "BIS IS", full: "Bureau of Indian Standards (multiple IS codes)", applies: "All product categories — IS 374, IS 694, IS 778, IS 1391, IS 2082, IS 4835, IS 5120, IS 8472, IS 9815, IS 12701, IS 13592, IS 15489..." },
  { std: "IBR 1950", full: "Indian Boiler Regulations", applies: "Industrial boiler feed pumps, high-pressure valves, steam service equipment" },
  { std: "PESO / CCOE", full: "Petroleum & Explosives Safety Organisation", applies: "Hazardous area solenoid valves, flameproof transmitters, Zone 1/2 equipment" },
  { std: "DGMS", full: "Directorate General of Mines Safety", applies: "Mining pumps, slurry pumps, underground explosion-proof equipment" },
  { std: "Legal Metrology India", full: "Legal Metrology Act 2009", applies: "Custody transfer flowmeters, weighing instruments" },
  { std: "Make in India", full: "Government of India Local Content Policy", applies: "All Indian-manufactured products — Class 1 Supplier status" },
]

export function HowItWorksPage({ onBack }: HowItWorksProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white font-sans antialiased selection:bg-black selection:text-white">

      {/* ── Sticky Top Bar ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-100 px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>
        <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">How it works</span>
        <div className="w-24" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center pt-16 pb-12 px-6 gap-6 border-b border-neutral-100">
        <img
          src="/logo.png"
          alt="ProductKOSH Logo"
          className="rounded-2xl object-contain drop-shadow-lg"
          style={{ width: 100, height: 100 }}
        />
        <div className="max-w-2xl space-y-3">
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="h-10 w-auto object-contain mx-auto"
            style={{ filter: "brightness(0)" }}
          />
          <p className="text-sm text-neutral-500 leading-relaxed">
            A full walkthrough of the AI pipeline — from a product name with one attribute, 
            all the way to a validated, commerce-ready catalog record with Indian standards, 
            INR pricing, and complete explainability.
          </p>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: Package, label: "200 Indian Products" },
            { icon: FileText, label: "40+ Spec Datasheets" },
            { icon: ShieldCheck, label: "Category-Aware Validation" },
            { icon: IndianRupee, label: "INR Pricing Only" },
            { icon: Globe, label: "9 Indian Standards" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
              <Icon className="w-3 h-3" /> {label}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-16">

        {/* ── Pipeline Steps ─────────────────────────────────────────── */}
        <section>
          <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase mb-8 text-center">
            The 6-Stage Pipeline
          </p>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isOpen = expandedStep === idx
              return (
                <div key={idx} className={`rounded-2xl border transition-all duration-200 ${step.color} ${isOpen ? "shadow-md" : "shadow-xs"}`}>
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-neutral-200 leading-none w-8">{step.num}</span>
                      <div className="p-2.5 bg-white rounded-xl shadow-xs border border-white/80">
                        <Icon className={`w-5 h-5 ${step.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{step.title}</p>
                        <p className="text-xs text-neutral-500">{step.subtitle}</p>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 space-y-4 border-t border-black/5">
                      <p className="text-sm text-neutral-700 leading-relaxed pt-4">{step.body}</p>

                      <div className="space-y-2">
                        {step.examples.map((ex, eidx) => (
                          <div key={eidx} className="bg-white rounded-xl border border-neutral-200 p-3 space-y-1">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">{ex.label}</span>
                            <p className="font-mono text-[11px] text-neutral-800 leading-relaxed">{ex.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-white/70 rounded-xl border border-neutral-200">
                        <BookOpen className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-neutral-600 leading-relaxed">{step.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Architecture Diagram (text) ─────────────────────────────── */}
        <section className="space-y-6">
          <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase text-center">
            System Architecture
          </p>
          <div className="bg-neutral-950 rounded-2xl p-6 font-mono text-xs leading-loose text-neutral-300 overflow-x-auto">
            <pre>{`
┌─────────────────────────────────────────────────────────────────┐
│                    Productकोश  Pipeline                          │
└─────────────────────────────────────────────────────────────────┘

  INPUT                    RETRIEVAL               GENERATION
  ┌──────────────┐         ┌───────────────┐       ┌─────────────────┐
  │ Product Name │ ──────► │ TF-IDF Vector │ ────► │ Gemini API /    │
  │ + 1-2 attrs  │         │ Search Engine │       │ Heuristic Extractor│
  └──────────────┘         │               │       │                 │
                           │ 196 chunks    │       │ Grounded JSON   │
                           │ from 20 docs  │       │ with confidence │
                           └───────────────┘       └────────┬────────┘
                                                            │
                           VALIDATION               OUTPUT  │
  ┌──────────────┐         ┌───────────────┐       ┌───────▼─────────┐
  │ Review Queue │ ◄────── │ Category-Aware│ ◄──── │ EnrichedProduct │
  │ (HITL)       │         │ Rules Engine  │       │ Schema          │
  │              │         │               │       │                 │
  │ Accept       │         │ Per-category  │       │ - Specs         │
  │ Edit         │         │ required field│       │ - Compliance    │
  │ Reject       │         │ checks        │       │ - INR Price     │
  └──────┬───────┘         │ + bounds      │       │ - Lineage       │
         │                 └───────────────┘       └─────────────────┘
         ▼
  ┌──────────────┐
  │ Commerce     │
  │ Ready Output │
  │ JSON / CSV   │
  └──────────────┘

  Backend:  FastAPI + Python (port 8000)
  Frontend: Next.js 16 + Tailwind (port 3000)
  DB:       In-memory store (no external DB required)
  AI:       Gemini API (optional) + precision heuristic fallback
`}</pre>
          </div>
        </section>

        {/* ── Data Model ─────────────────────────────────────────────── */}
        <section className="space-y-6">
          <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase text-center">
            Product Data Model
          </p>
          <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-bold text-neutral-500 uppercase tracking-wider w-44">Field</th>
                  <th className="py-3 px-4 font-bold text-neutral-500 uppercase tracking-wider w-40">Type</th>
                  <th className="py-3 px-4 font-bold text-neutral-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {dataModel.map((row) => (
                  <tr key={row.field} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{row.field}</td>
                    <td className="py-3 px-4 font-mono text-violet-600">{row.type}</td>
                    <td className="py-3 px-4 text-neutral-600 leading-relaxed">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Indian Standards Table ──────────────────────────────────── */}
        <section className="space-y-6">
          <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase text-center">
            Indian Regulatory Standards Covered
          </p>
          <div className="space-y-3">
            {indianStandards.map((s) => (
              <div key={s.std} className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors">
                <span className="font-mono text-[11px] font-black text-neutral-900 bg-white border border-neutral-200 px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xs">
                  {s.std}
                </span>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{s.full}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{s.applies}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 ml-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="text-center space-y-4 pt-4 pb-8">
          <p className="text-sm text-neutral-500">Ready to try it?</p>
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2.5 bg-black text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Back to Home
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </section>

      </div>
    </div>
  )
}
