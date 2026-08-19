"use client"

import React, { useState, useEffect } from "react"
import { HowItWorksPage } from "@/components/HowItWorksPage"
import { UserMenu } from "@/components/UserMenu"
import {
  ArrowRight,
  Layers,
  Search,
  ShieldCheck,
  BarChart3,
  GitBranch,
  ClipboardList,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Cpu,
  Database,
  FileSpreadsheet,
  Zap,
  Activity,
  Check,
  Sliders,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  FileCheck,
  Lock,
  ExternalLink,
  Award,
  Terminal,
  Play,
  Copy,
  CheckCheck,
  SlidersHorizontal,
  FileCode2,
  Box,
  Fingerprint,
  ChevronDown,
  Info,
  Scale,
  Gauge
} from "lucide-react"

interface HomePageProps {
  onEnter: (tab: string) => void
}

// ── SAMPLE PRODUCTS FOR INTERACTIVE TERMINAL ──────────────────────────────────
const INTERACTIVE_CORPUS = [
  {
    id: "prod-1",
    title: "L&T Cast Steel Globe Valve 150#",
    brand: "Larsen & Toubro",
    unspsc: "40141600",
    unspscName: "Valves · Globe & Control Family",
    docId: "DOC-004_LT_CastSteel_GlobeValve_Class150.md",
    chunkId: "CHK-04-12",
    similarity: "0.984",
    priceRange: "₹14,500 – ₹18,200",
    priceJustification: "Calibrated to Class 150 2-Inch DN50 Flanged B2B list price index in Pune/Mumbai industrial hub.",
    confidence: "98.4%",
    compliance: [
      { standard: "IBR 1950", note: "Indian Boiler Regulations certified steam design", status: "Verified" },
      { standard: "BS 1873 / API 598", note: "Pressure test: Body 30 Bar / Seat 22 Bar", status: "Verified" },
      { standard: "Make in India", note: "Class-I Local Supplier (94% Domestic Metallurgy)", status: "Tier-1" },
    ],
    specs: [
      { label: "Nominal Bore (DN)", val: "50 mm (2 Inch)", tag: "Dimensions", conf: 0.99, citation: "DOC-004 §1.2" },
      { label: "Pressure Rating", val: "Class 150 (PN20 / 20 Bar)", tag: "Mechanical", conf: 0.98, citation: "DOC-004 §2.1" },
      { label: "Body Material", val: "ASTM A216 Gr. WCB", tag: "Metallurgy", conf: 0.99, citation: "DOC-004 §3.4" },
      { label: "Trim Metallurgy", val: "13% Cr Steel (API Trim 8)", tag: "Trim", conf: 0.96, citation: "DOC-004 §3.7" },
      { label: "End Flanges", val: "ASME B16.5 RF Serrated", tag: "Connection", conf: 0.97, citation: "DOC-004 §4.1" },
    ],
    rawJson: {
      sku: "VAL-LT-GV150-50",
      unspsc: "40141600",
      confidence: 0.984,
      origin: "IN",
      gst_hsn: "84818030",
    }
  },
  {
    id: "prod-2",
    title: "Voltas 1.5 Ton 5-Star Inverter Split AC",
    brand: "Voltas (TATA Enterprise)",
    unspsc: "40101701",
    unspscName: "Air Conditioners · Split Residential",
    docId: "DOC-008_Voltas_Inverter_SplitAC_185V.md",
    chunkId: "CHK-08-04",
    similarity: "0.978",
    priceRange: "₹38,990 – ₹44,500",
    priceJustification: "Indian retail consumer marketplace price calibrated across Delhi-NCR / Maharashtra retail chains.",
    confidence: "97.8%",
    compliance: [
      { standard: "BEE 5-Star", note: "ISEER 5.05 rating with 580 kWh annual power", status: "Certified" },
      { standard: "BIS IS 1391", note: "Part 2 Room Air Conditioners safety compliance", status: "Verified" },
      { standard: "RoHS Compliant", note: "Eco-friendly R32 zero-ODP refrigerant", status: "Verified" },
    ],
    specs: [
      { label: "Cooling Capacity", val: "5100 Watts (1.5 TR)", tag: "Thermal", conf: 0.99, citation: "DOC-008 §1.1" },
      { label: "ISEER Rating", val: "5.05 (High Efficiency)", tag: "Energy", conf: 0.98, citation: "DOC-008 §2.3" },
      { label: "Refrigerant Gas", val: "R32 (Eco-Friendly)", tag: "Chemical", conf: 0.96, citation: "DOC-008 §3.1" },
      { label: "Condenser Metallurgy", val: "100% Grooved Copper", tag: "Material", conf: 0.97, citation: "DOC-008 §4.2" },
      { label: "Operating Ambient", val: "Up to 52°C Heavy Duty", tag: "Limits", conf: 0.95, citation: "DOC-008 §5.0" },
    ],
    rawJson: {
      sku: "APP-VOL-15T5S-INV",
      unspsc: "40101701",
      confidence: 0.978,
      origin: "IN",
      gst_hsn: "84151010",
    }
  },
  {
    id: "prod-3",
    title: "Fortune Kachi Ghani Mustard Oil 1L",
    brand: "Adani Wilmar",
    unspsc: "50151513",
    unspscName: "Edible Oils · Cold Pressed Mustard",
    docId: "DOC-019_Fortune_MustardOil_KachiGhani.md",
    chunkId: "CHK-19-02",
    similarity: "0.965",
    priceRange: "₹145 – ₹175",
    priceJustification: "Regulated FMCG maximum retail price (MRP) band for 1L pouch across Indian general trade.",
    confidence: "96.5%",
    compliance: [
      { standard: "FSSAI Lic. 10013021000853", note: "FSS (Food Products Standards) 2011 compliant", status: "Certified" },
      { standard: "AGMARK Grade-1", note: "Directorate of Marketing & Inspection accredited", status: "Verified" },
      { standard: "Legal Metrology 2009", note: "Standardized 1000 mL net volume packaging", status: "Verified" },
    ],
    specs: [
      { label: "Net Volume", val: "1000 mL (1 Litre)", tag: "Quantity", conf: 0.99, citation: "DOC-019 §1.0" },
      { label: "Cold Press Extraction", val: "Traditional Wooden Kolhu", tag: "Process", conf: 0.96, citation: "DOC-019 §2.1" },
      { label: "Smoke Point", val: "250°C (High Heat Frying)", tag: "Physical", conf: 0.94, citation: "DOC-019 §3.2" },
      { label: "Pungency Bio-active", val: "Natural Allyl Isothiocyanate", tag: "Chemical", conf: 0.93, citation: "DOC-019 §4.1" },
      { label: "Fortification", val: "Enriched with Vitamin A & D2", tag: "Nutrition", conf: 0.98, citation: "DOC-019 §5.1" },
    ],
    rawJson: {
      sku: "FMCG-ADW-MUS1L-KG",
      unspsc: "50151513",
      confidence: 0.965,
      origin: "IN",
      gst_hsn: "15149120",
    }
  },
  {
    id: "prod-4",
    title: "Havells Fabio 16A 1-Way Modular Switch",
    brand: "Havells India Ltd.",
    unspsc: "39122200",
    unspscName: "Wiring Devices · Modular Switches",
    docId: "DOC-014_Havells_Fabio_ModularSwitches.md",
    chunkId: "CHK-14-06",
    similarity: "0.981",
    priceRange: "₹125 – ₹160",
    priceJustification: "Standard distributor trade price list for 16A heavy appliance switches in India.",
    confidence: "98.1%",
    compliance: [
      { standard: "BIS IS 3854:1997", note: "Standard ISI Mark for domestic switches", status: "Verified" },
      { standard: "RoHS Compliant", note: "Cadmium and Lead free contacts", status: "Verified" },
      { standard: "Glow Wire 850°C", note: "Self-extinguishing engineering polymer", status: "Certified" },
    ],
    specs: [
      { label: "Current & Voltage", val: "16A, 240V AC 50Hz", tag: "Electrical", conf: 0.99, citation: "DOC-014 §1.1" },
      { label: "Contact Metallurgy", val: "Pure Silver Inlaid Brass", tag: "Contacts", conf: 0.96, citation: "DOC-014 §2.4" },
      { label: "Switch Mechanism", val: "Silent Snap-Action Rocker", tag: "Mechanical", conf: 0.97, citation: "DOC-014 §3.1" },
      { label: "Module Grid Size", val: "1 Module (1M Space)", tag: "Fitment", conf: 0.98, citation: "DOC-014 §4.0" },
      { label: "Endurance Cycles", val: "100,000+ Operations", tag: "Reliability", conf: 0.95, citation: "DOC-014 §5.2" },
    ],
    rawJson: {
      sku: "ELE-HAV-FAB16A-1M",
      unspsc: "39122200",
      confidence: 0.981,
      origin: "IN",
      gst_hsn: "85365020",
    }
  },
]

// ── BENTO HIGHLIGHTS ─────────────────────────────────────────────────────────
const BENTO_FEATURES = [
  {
    id: "bento-1",
    icon: Database,
    title: "196-Chunk Vector Grounding",
    tag: "Retrieval Augmented (RAG)",
    description: "Every generated attribute links back to an exact paragraph in genuine Indian engineering datasheets — completely eliminating hallucinations.",
    code: "TF-IDF + Cosine Distance >= 0.85",
  },
  {
    id: "bento-2",
    icon: ShieldCheck,
    title: "Deterministic Rule Engine",
    tag: "Category-Aware Bounds",
    description: "Automated sanity checks enforce physical bounds (e.g. pressure 0-700 Bar, temperature limits, voltage compliance) and required category fields.",
    code: "40+ Pydantic Domain Constraints",
  },
  {
    id: "bento-3",
    icon: ClipboardList,
    title: "Audited HITL Review Queue",
    tag: "Human-in-the-Loop",
    description: "Records failing confidence thresholds or mandatory compliance checks are seamlessly routed for verified inline edit, accept, or rejection.",
    code: "Cryptographic Lineage Logging",
  },
  {
    id: "bento-4",
    icon: Scale,
    title: "INR Pricing & UNSPSC Taxonomy",
    tag: "Indian Market Calibration",
    description: "Automatic classification into standard 8-digit UNSPSC category codes paired with realistic B2B & consumer pricing calibrated in Indian Rupees (₹).",
    code: "15+ Industrial Categories",
  },
]

// ── NATIONAL COMPLIANCE GRID ─────────────────────────────────────────────────
const COMPLIANCE_STANDARDS = [
  {
    code: "BIS IS",
    name: "Bureau of Indian Standards",
    sub: "Mandatory ISI Marking",
    desc: "Cross-checks against IS 1391 (ACs), IS 3854 (Switches), IS 2062 (Structural Steel), and IS 1239 (Pipes).",
    badge: "Government of India",
  },
  {
    code: "FSSAI",
    name: "Food Safety Standards",
    sub: "FMCG Statutory Packaging",
    desc: "Validates license formats, allergen warnings, AGMARK grading, and Legal Metrology net quantities.",
    badge: "Ministry of Health",
  },
  {
    code: "BEE Star",
    name: "Bureau of Energy Efficiency",
    sub: "ISEER / Energy Rating",
    desc: "Extracts and checks star ratings, annual energy consumption (kWh), and cooling efficiency standards.",
    badge: "Ministry of Power",
  },
  {
    code: "IBR 1950",
    name: "Indian Boiler Regulations",
    sub: "High-Pressure Vessels",
    desc: "Ensures certified metallurgy, hydraulic test pressure limits, and steam temperature compliance.",
    badge: "Central Boilers Board",
  },
]

export function HomePage({ onEnter }: HomePageProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [activeProductIdx, setActiveProductIdx] = useState(0)
  const [activeDeckTab, setActiveDeckTab] = useState<"specs" | "compliance" | "pricing" | "json">("specs")
  const [copied, setCopied] = useState(false)

  // Interactive review queue mockup state
  const [mockReviewStatus, setMockReviewStatus] = useState<"pending" | "accepted" | "edited" | "rejected">("pending")

  const currentProduct = INTERACTIVE_CORPUS[activeProductIdx]

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentProduct.rawJson, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (showHelp) {
    return <HowItWorksPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white relative">
      
      {/* ── SUBTLE TECHNICAL GRID BACKGROUND ────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      {/* ── TOP NAV BAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-7 h-7 rounded-lg object-contain shadow-2xs"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-neutral-950 font-sans">
                Product<span className="text-amber-500 font-black">कोश</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                v1.0 · Indian Catalog Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelp(true)}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-full hover:bg-neutral-100/80 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Architecture</span>
            </button>

            <button
              onClick={() => onEnter("processor")}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <UserMenu />
          </div>

        </div>
      </header>

      {/* ── HERO SECTION: EDITORIAL SWISS STYLE ──────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12 text-center">
        
        {/* Monospace System Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/90 text-[11px] font-mono text-neutral-600 shadow-2xs mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          <span className="tracking-wide">CORPUS RETRIEVAL ENGINE</span>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-900 font-semibold">196 Technical Chunks</span>
        </div>

        {/* Hero Title with Wordmark */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
            Automated Product Intelligence for{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Indian Commerce
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto pt-1">
            Transforms minimal supplier strings into verified, commerce-ready records grounded in technical datasheets, mapped to standard UNSPSC taxonomy, and validated against BIS, FSSAI, BEE, and IBR standards.
          </p>
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-8">
          <button
            onClick={() => onEnter("processor")}
            className="group relative px-7 py-3.5 rounded-full bg-neutral-950 text-white font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Open Batch Intelligence Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onEnter("catalog")}
            className="px-6 py-3.5 rounded-full bg-white border border-neutral-200/90 text-neutral-800 font-semibold text-xs sm:text-sm hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-neutral-500" />
            <span>Search 200 Catalog Records</span>
          </button>
        </div>

        {/* Precision Key Metric Tickers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-12 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs">
            <div className="text-2xl font-bold font-mono tracking-tight text-neutral-950">200</div>
            <div className="text-[11px] font-medium text-neutral-500 mt-0.5">Seed Products</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs">
            <div className="text-2xl font-bold font-mono tracking-tight text-neutral-950">196</div>
            <div className="text-[11px] font-medium text-neutral-500 mt-0.5">Indexed Chunks</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600">96.8%</div>
            <div className="text-[11px] font-medium text-neutral-500 mt-0.5">Avg. Confidence</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600">₹ INR</div>
            <div className="text-[11px] font-medium text-neutral-500 mt-0.5">Calibrated Pricing</div>
          </div>
        </div>

      </section>

      {/* ── INTERACTIVE EXTRACTION ENGINE DECK ───────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
          
          {/* Deck Top Bar */}
          <div className="p-5 sm:p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-950" />
                <h2 className="text-sm font-bold tracking-tight text-neutral-950 uppercase font-mono">
                  Live Grounding & Extraction Sandbox
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Inspect how raw supplier inputs are vector-retrieved and transformed into structured records.
              </p>
            </div>

            {/* Product Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-full border border-neutral-200/80 shadow-2xs">
              {INTERACTIVE_CORPUS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveProductIdx(idx)
                    setMockReviewStatus("pending")
                  }}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                    activeProductIdx === idx
                      ? "bg-neutral-950 text-white shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                  }`}
                >
                  {item.brand.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Deck Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">
            
            {/* Left Column: Input & Vector Retrieval Radar (5 cols) */}
            <div className="lg:col-span-5 p-6 space-y-5 bg-neutral-50/20">
              
              <div>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  1. Minimal Supplier Input
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                  <div className="text-xs font-semibold text-neutral-900">
                    &ldquo;{currentProduct.title}&rdquo;
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1 font-mono">
                    Brand: {currentProduct.brand}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  2. Vector Search Match (TF-IDF Cosine)
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-neutral-700 truncate max-w-[200px]">
                      {currentProduct.docId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-100">
                      Score: {currentProduct.similarity}
                    </span>
                  </div>

                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${parseFloat(currentProduct.similarity) * 100}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span>Target Chunk: <strong className="font-mono text-neutral-800">{currentProduct.chunkId}</strong></span>
                    <span className="text-emerald-600 font-medium">Grounded Proof</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  3. Standard UNSPSC Taxonomy
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
                  <div className="font-mono text-xs font-bold text-neutral-900 flex items-center justify-between">
                    <span>UNSPSC {currentProduct.unspsc}</span>
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      Level 4
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {currentProduct.unspscName}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onEnter("processor")}
                  className="w-full py-2.5 px-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Run Batch Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right Column: Grounded Specification Tabs (7 cols) */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between">
              
              <div>
                {/* View Tabs */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full border border-neutral-200/60">
                    <button
                      onClick={() => setActiveDeckTab("specs")}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                        activeDeckTab === "specs"
                          ? "bg-white text-neutral-950 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveDeckTab("compliance")}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                        activeDeckTab === "compliance"
                          ? "bg-white text-neutral-950 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      Compliance
                    </button>
                    <button
                      onClick={() => setActiveDeckTab("pricing")}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                        activeDeckTab === "pricing"
                          ? "bg-white text-neutral-950 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      INR Pricing
                    </button>
                    <button
                      onClick={() => setActiveDeckTab("json")}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all ${
                        activeDeckTab === "json"
                          ? "bg-white text-neutral-950 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      Schema JSON
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80">
                    {currentProduct.confidence} Confidence
                  </div>
                </div>

                {/* TAB 1: Specifications */}
                {activeDeckTab === "specs" && (
                  <div className="py-4 space-y-2">
                    {currentProduct.specs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 hover:border-neutral-300 transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="text-[11px] text-neutral-500 font-medium">{spec.label}</div>
                          <div className="font-semibold text-neutral-900 mt-0.5">{spec.val}</div>
                        </div>

                        <div className="flex items-center gap-2 text-right shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 font-mono text-[10px] text-neutral-600">
                            {spec.citation}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
                            {(spec.conf * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 2: Compliance */}
                {activeDeckTab === "compliance" && (
                  <div className="py-4 space-y-2.5">
                    {currentProduct.compliance.map((comp, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-950 font-mono">{comp.standard}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            {comp.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{comp.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: INR Pricing */}
                {activeDeckTab === "pricing" && (
                  <div className="py-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                      <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider font-mono">
                        Estimated Indian Market Range
                      </div>
                      <div className="text-2xl font-bold font-mono text-neutral-950">
                        {currentProduct.priceRange}
                      </div>
                      <p className="text-xs text-neutral-600 pt-1 leading-relaxed">
                        {currentProduct.priceJustification}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs space-y-1 text-neutral-600">
                      <div className="font-semibold text-neutral-900">Boundary Sanity Check:</div>
                      <p className="text-[11px]">Pricing rules verify Min Price &lt; Max Price, non-zero values, and alignment with Indian regional trade distributors.</p>
                    </div>
                  </div>
                )}

                {/* TAB 4: JSON */}
                {activeDeckTab === "json" && (
                  <div className="py-4 space-y-2">
                    <div className="flex justify-end">
                      <button
                        onClick={handleCopyJson}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] font-medium text-neutral-700 flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? "Copied" : "Copy JSON"}</span>
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                      {JSON.stringify(currentProduct.rawJson, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Interactive HITL Action Bar in Deck */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-neutral-500 font-medium">
                  {mockReviewStatus === "pending" && "Simulate Human Review Action:"}
                  {mockReviewStatus === "accepted" && <span className="text-emerald-600 font-semibold">✓ Record Accepted by Reviewer</span>}
                  {mockReviewStatus === "edited" && <span className="text-blue-600 font-semibold">✎ Value Modified with Audit Log</span>}
                  {mockReviewStatus === "rejected" && <span className="text-red-600 font-semibold">✗ Record Rejected with Feedback</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMockReviewStatus("accepted")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setMockReviewStatus("edited")}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setMockReviewStatus("rejected")}
                    className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── BENTO GRID: ENTERPRISE CAPABILITIES ──────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-14">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
          <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-neutral-400">
            Engine Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            Engineered for Industrial Accuracy
          </h2>
          <p className="text-xs text-neutral-500">
            Deterministic validation combined with semantic retrieval eliminates ungrounded catalog hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BENTO_FEATURES.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-2xl bg-neutral-100 text-neutral-900">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-600">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-950 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>{item.code}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            )
          })}
        </div>

      </section>

      {/* ── NATIONAL COMPLIANCE STANDARDS SECTION ───────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-[10px] font-mono font-semibold text-amber-400 border border-neutral-700">
              <ShieldCheck className="w-3 h-3" />
              <span>National Regulatory Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Grounded Against Indian Standards
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every specification is cross-referenced with relevant statutory specifications to ensure full commercial and regulatory compliance across Indian supply chains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPLIANCE_STANDARDS.map((std, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-base font-bold font-mono text-amber-400 mb-1">
                    {std.code}
                  </div>
                  <div className="text-xs font-semibold text-neutral-200 mb-2">
                    {std.name}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {std.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
                  {std.badge}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── MINIMALIST ACTION CALLOUT ────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Ready to enrich your product catalog?
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Launch the batch processor across 200 Indian industrial items or search the verified technical database.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnter("processor")}
              className="px-7 py-3 rounded-full bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-all shadow-2xs flex items-center gap-2"
            >
              <span>Enter Batch Processor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEnter("catalog")}
              className="px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
            >
              <span>Inspect Catalog Records</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMAL EDITORIAL FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-neutral-200/80 bg-white py-8 text-center text-xs text-neutral-500 font-sans relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ProductKOSH" className="w-4 h-4 rounded object-contain" />
            <span className="font-bold text-neutral-900">Productकोश</span>
            <span>· Indian Industrial Product Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[10px]">
            <span>UNSPSC v24.0</span>
            <span>·</span>
            <span>BIS IS Compliant</span>
            <span>·</span>
            <span>FSSAI / IBR 1950</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
