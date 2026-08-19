"use client"

import React, { useState } from "react"
import { HowItWorksPage } from "@/components/HowItWorksPage"
import { UserMenu } from "@/components/UserMenu"
import {
  ArrowRight,
  Search,
  CheckCircle2,
  Check,
  HelpCircle,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  ChevronRight
} from "lucide-react"

interface HomePageProps {
  onEnter: (tab: string) => void
}

// ── SAMPLE PRODUCTS FOR LIVE SPECIFICATION VIEWER ─────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    brand: "L&T Valves",
    name: "L&T Cast Steel Globe Valve 150#",
    category: "Valves · Globe & Control (UNSPSC 40141600)",
    docId: "DOC-004_LT_GlobeValve_Class150.md",
    price: "₹14,500 – ₹18,200",
    confidence: "98.4%",
    compliance: ["IBR 1950 (Boiler Steam)", "BS 1873 / API 598", "Make in India Tier-1"],
    specs: [
      { name: "Nominal Bore (DN)", value: "50 mm (2 Inch)", citation: "DOC-004 §1.2", conf: "99%" },
      { name: "Pressure Rating", value: "Class 150 (PN20 / 20 Bar)", citation: "DOC-004 §2.1", conf: "98%" },
      { name: "Body Material", value: "ASTM A216 Gr. WCB Cast Steel", citation: "DOC-004 §3.4", conf: "99%" },
      { name: "Trim Metallurgy", value: "13% Cr Steel (API Trim 8)", citation: "DOC-004 §3.7", conf: "96%" },
      { name: "End Connection", value: "ASME B16.5 RF Raised Face", citation: "DOC-004 §4.1", conf: "97%" },
    ],
  },
  {
    id: "demo-2",
    brand: "Voltas",
    name: "Voltas 1.5 Ton 5-Star Inverter Split AC",
    category: "Air Conditioners · Split (UNSPSC 40101701)",
    docId: "DOC-008_Voltas_SplitAC_185V.md",
    price: "₹38,990 – ₹44,500",
    confidence: "97.8%",
    compliance: ["BEE 5-Star (ISEER 5.05)", "BIS IS 1391 Part-2", "RoHS R32 Gas"],
    specs: [
      { name: "Cooling Capacity", value: "5100 Watts (1.5 TR)", citation: "DOC-008 §1.1", conf: "99%" },
      { name: "Energy Rating", value: "BEE 5-Star · ISEER 5.05", citation: "DOC-008 §2.3", conf: "98%" },
      { name: "Refrigerant", value: "R32 Eco-Friendly Zero ODP", citation: "DOC-008 §3.1", conf: "96%" },
      { name: "Condenser Metallurgy", value: "100% Grooved Inner Tube Copper", citation: "DOC-008 §4.2", conf: "97%" },
      { name: "Ambient Limit", value: "52°C Heavy Duty Tropicalized", citation: "DOC-008 §5.0", conf: "95%" },
    ],
  },
  {
    id: "demo-3",
    brand: "Adani Wilmar",
    name: "Fortune Kachi Ghani Mustard Oil 1L",
    category: "Edible Oils & Fats (UNSPSC 50151513)",
    docId: "DOC-019_Fortune_MustardOil.md",
    price: "₹145 – ₹175",
    confidence: "96.5%",
    compliance: ["FSSAI Lic. 10013021000853", "AGMARK Grade-1", "Legal Metrology 2009"],
    specs: [
      { name: "Net Quantity", value: "1000 mL (1 Litre Pouch)", citation: "DOC-019 §1.0", conf: "99%" },
      { name: "Extraction Method", value: "Cold Pressed Traditional Kolhu", citation: "DOC-019 §2.1", conf: "96%" },
      { name: "Smoke Point", value: "250°C High Thermal Stability", citation: "DOC-019 §3.2", conf: "94%" },
      { name: "Pungency Index", value: "High Allyl Isothiocyanate", citation: "DOC-019 §4.1", conf: "93%" },
      { name: "Fortification", value: "Vitamin A (25 IU) & D2 (4.5 IU)", citation: "DOC-019 §5.1", conf: "98%" },
    ],
  },
  {
    id: "demo-4",
    brand: "Havells",
    name: "Havells Fabio 16A 1-Way Modular Switch",
    category: "Wiring Devices (UNSPSC 39122200)",
    docId: "DOC-014_Havells_FabioSwitches.md",
    price: "₹125 – ₹160",
    confidence: "98.1%",
    compliance: ["BIS IS 3854:1997", "Glow Wire 850°C", "RoHS Heavy Metal Free"],
    specs: [
      { name: "Rating", value: "16A, 240V AC 50Hz Heavy Duty", citation: "DOC-014 §1.1", conf: "99%" },
      { name: "Contact Metallurgy", value: "Pure Silver Inlaid Brass Contacts", citation: "DOC-014 §2.4", conf: "96%" },
      { name: "Mechanism", value: "Silent Snap-Action Rocker", citation: "DOC-014 §3.1", conf: "97%" },
      { name: "Grid Size", value: "1 Module (Standard 1M)", citation: "DOC-014 §4.0", conf: "98%" },
      { name: "Endurance", value: "100,000+ Operational Cycles", citation: "DOC-014 §5.2", conf: "95%" },
    ],
  },
]

// ── CORE CAPABILITIES ────────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    num: "01",
    title: "196-Chunk Vector Grounding",
    tag: "Vector RAG",
    description: "Every generated specification anchors to an exact paragraph in genuine Indian datasheets — completely eliminating hallucinations.",
  },
  {
    num: "02",
    title: "Deterministic Rule Engine",
    tag: "Category-Aware",
    description: "Automated sanity checks enforce physical constraints (e.g. pressure 0-700 Bar, temperature bounds) and required attributes for each family.",
  },
  {
    num: "03",
    title: "Audited Review Queue",
    tag: "Human-in-the-Loop",
    description: "Flagged products route to catalog managers for audited inline edits, acceptances, or rejections with timestamped lineage.",
  },
  {
    num: "04",
    title: "INR Pricing & UNSPSC Taxonomy",
    tag: "Market Calibrated",
    description: "Automatic classification into standard 8-digit UNSPSC category codes paired with realistic market price bands in Indian Rupees (₹).",
  },
]

// ── REGULATORY MATRIX ────────────────────────────────────────────────────────
const STANDARDS = [
  { code: "BIS IS", name: "Bureau of Indian Standards", desc: "IS 1391 (ACs), IS 3854 (Switches), IS 2062 (Steel), IS 1239 (Piping)" },
  { code: "FSSAI", name: "Food Safety & Standards", desc: "Statutory labeling, AGMARK grading, and Legal Metrology net quantities" },
  { code: "BEE Star", name: "Bureau of Energy Efficiency", desc: "ISEER star rating, power consumption (kWh), and cooling benchmarks" },
  { code: "IBR 1950", name: "Indian Boiler Regulations", desc: "High-pressure vessel certification, steam rating, and metallurgy test proof" },
]

export function HomePage({ onEnter }: HomePageProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<"specs" | "compliance">("specs")

  const current = DEMO_PRODUCTS[selectedIdx]

  if (showHelp) {
    return <HowItWorksPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-black selection:text-white">

      {/* ── TOP HEADER ───────────────────────────────────────────────────── */}
      <header className="border-b border-neutral-100 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ProductKOSH"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="font-bold text-base tracking-tight text-neutral-900 flex items-center gap-1.5">
              Product<span className="text-amber-500">कोश</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelp(true)}
              className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
            >
              How it works
            </button>

            <button
              onClick={() => onEnter("processor")}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
        
        {/* Brand Unit: Logo + Wordmark */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="rounded-2xl object-contain drop-shadow-lg"
            style={{ width: 110, height: 110 }}
          />
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="block mx-auto object-contain"
            style={{ height: "65px", filter: "brightness(0)" }}
          />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15] mb-4">
          Turn minimal product titles into verified, commerce-ready records.
        </h1>

        <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-xl mx-auto mb-8">
          Grounded in real Indian technical datasheets, mapped to standard UNSPSC taxonomy, and validated against BIS, FSSAI, BEE, and IBR standards.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onEnter("processor")}
            className="px-7 py-3 rounded-full bg-black text-white font-semibold text-xs sm:text-sm hover:bg-neutral-800 transition-all shadow-md flex items-center gap-2"
          >
            <span>Open Batch Processor</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnter("catalog")}
            className="px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs sm:text-sm transition-colors"
          >
            Browse 200 Products
          </button>
        </div>

        {/* Stats Strip with Clean Dividers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 mt-12 border-t border-neutral-100 text-left">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-950 font-mono">200</div>
            <div className="text-xs text-neutral-500 mt-1">Indian Seed Products</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-950 font-mono">196</div>
            <div className="text-xs text-neutral-500 mt-1">Datasheet Chunks</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono">96.8%</div>
            <div className="text-xs text-neutral-500 mt-1">Extraction Confidence</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">₹ INR</div>
            <div className="text-xs text-neutral-500 mt-1">Market Pricing</div>
          </div>
        </div>

      </section>

      {/* ── INTERACTIVE PRODUCT TRANSFORMATION ENGINE (FLUID & BORDERLESS) ─── */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-neutral-100">
        
        {/* Header & Product Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1 font-mono">
              Live Interactive Grounding
            </div>
            <h2 className="text-2xl font-bold text-neutral-950">
              Product Transformation Engine
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {DEMO_PRODUCTS.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => setSelectedIdx(idx)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
                  selectedIdx === idx
                    ? "bg-black text-white font-semibold shadow-2xs"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100 font-medium"
                }`}
              >
                {prod.brand}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Open Two-Column Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Product Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase">
                {current.category}
              </span>
              <h3 className="text-xl font-bold text-neutral-950 mt-1 leading-snug">
                {current.name}
              </h3>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">Estimated Indian Market Price</span>
                <span className="text-2xl font-bold font-mono text-neutral-950">{current.price}</span>
              </div>

              <div>
                <span className="text-neutral-400 block mb-0.5">Matched Technical Document</span>
                <span className="font-mono text-neutral-700 text-[11px]">{current.docId}</span>
              </div>

              <div>
                <span className="text-neutral-400 block mb-0.5">Overall Extraction Confidence</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  {current.confidence}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onEnter("catalog")}
                className="w-full py-3 px-5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Inspect in Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Clean Spec Rows */}
          <div className="lg:col-span-7">
            
            {/* View Switcher */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100">
              <div className="flex gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-1 transition-colors ${
                    activeTab === "specs"
                      ? "text-black border-b-2 border-black"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className={`pb-1 transition-colors ${
                    activeTab === "compliance"
                      ? "text-black border-b-2 border-black"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  Compliance & Standards
                </button>
              </div>

              <span className="text-[11px] text-neutral-400 font-mono">Grounded Attributes</span>
            </div>

            {/* TAB 1: Specs Table */}
            {activeTab === "specs" && (
              <div className="divide-y divide-neutral-100">
                {current.specs.map((s, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-neutral-400 text-[11px] block">{s.name}</span>
                      <span className="font-semibold text-neutral-900 text-sm mt-0.5 block">{s.value}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10px] text-neutral-400 block">{s.citation}</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-600">{s.conf}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Compliance */}
            {activeTab === "compliance" && (
              <div className="divide-y divide-neutral-100">
                {current.compliance.map((c, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-950 font-mono text-sm">{c}</span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ── CAPABILITIES SECTION (CLEAN NUMBERED EDITORIAL LIST) ───────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-neutral-100">
        
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Pipeline Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
            Engineered for Grounded Accuracy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {CAPABILITIES.map((cap) => (
            <div key={cap.num} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neutral-400">{cap.num}</span>
                <span className="h-px w-6 bg-neutral-200" />
                <span className="text-[11px] font-mono uppercase text-neutral-500">{cap.tag}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {cap.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── NATIONAL COMPLIANCE SUMMARY ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-neutral-100">
        
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Regulatory Framework
          </span>
          <h2 className="text-2xl font-bold text-neutral-950 mt-1">
            Mapped National Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARDS.map((std, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-bold text-sm text-neutral-950 font-mono">{std.code}</div>
              <div className="text-xs font-semibold text-neutral-700">{std.name}</div>
              <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">{std.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-neutral-100 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Ready to enrich your Indian product catalog?
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Feed minimal inputs or run batch extraction across 200 pre-configured Indian industrial items.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => onEnter("processor")}
              className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all shadow-md flex items-center gap-2"
            >
              <span>Enter Batch Processor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEnter("catalog")}
              className="px-6 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
            >
              Search Catalog
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 py-8 text-center text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-neutral-700">
            <img src="/logo.png" alt="ProductKOSH" className="w-4 h-4 rounded object-contain" />
            <span>Productकोश — AI Product Intelligence Platform</span>
          </div>

          <div className="font-mono text-[11px] text-neutral-400">
            UNSPSC · BIS · FSSAI · BEE · IBR
          </div>
        </div>
      </footer>

    </div>
  )
}
