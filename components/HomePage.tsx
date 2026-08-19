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
  Play
} from "lucide-react"

interface HomePageProps {
  onEnter: (tab: string) => void
}

// ── SAMPLE EXTRACTION DEMOS FOR INTERACTIVE WIDGET ────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    inputName: "L&T Cast Steel Globe Valve 150#",
    brand: "Larsen & Toubro",
    category: "Valves - Globe / Control (UNSPSC 40141600)",
    retrievedDoc: "DOC-004_LT_CastSteel_GlobeValve_Class150.md",
    specs: [
      { name: "Pressure Class", value: "Class 150 (PN20)", conf: "0.98", doc: "DOC-004 §2.1" },
      { name: "Body Material", value: "ASTM A216 Gr. WCB", conf: "0.99", doc: "DOC-004 §3.4" },
      { name: "Nominal Bore (DN)", value: "50 mm (2 Inch)", conf: "0.95", doc: "DOC-004 §1.2" },
      { name: "End Connection", value: "Flanged ASME B16.5 RF", conf: "0.97", doc: "DOC-004 §4.1" },
      { name: "Compliance Standard", value: "IBR 1950 / BS 1873 / API 598", conf: "0.99", doc: "DOC-004 §5.0" },
    ],
    price: "₹14,500 – ₹18,200",
    confidence: "98.4%",
    status: "Clean · Auto-Validated",
  },
  {
    id: "demo-2",
    inputName: "Voltas 1.5 Ton 5-Star Inverter Split AC",
    brand: "Voltas (A TATA Enterprise)",
    category: "Air Conditioners - Split (UNSPSC 40101701)",
    retrievedDoc: "DOC-008_Voltas_Inverter_SplitAC_185V.md",
    specs: [
      { name: "Cooling Capacity", value: "5100 Watts (1.5 Ton)", conf: "0.99", doc: "DOC-008 §1.1" },
      { name: "Energy Rating", value: "BEE 5-Star (ISEER 5.05)", conf: "0.98", doc: "DOC-008 §2.3" },
      { name: "Refrigerant", value: "R32 (Eco-friendly, Zero ODP)", conf: "0.96", doc: "DOC-008 §3.1" },
      { name: "Condenser Coil", value: "100% Copper with Anti-Corrosive Blue Fins", conf: "0.97", doc: "DOC-008 §4.2" },
      { name: "BIS Specification", value: "IS 1391 (Part 2) Room Air Conditioners", conf: "0.99", doc: "DOC-008 §6.0" },
    ],
    price: "₹38,990 – ₹44,500",
    confidence: "97.8%",
    status: "Clean · Auto-Validated",
  },
  {
    id: "demo-3",
    inputName: "Fortune Kachi Ghani Mustard Oil 1L Pouch",
    brand: "Adani Wilmar",
    category: "Edible Oils & Fats (UNSPSC 50151513)",
    retrievedDoc: "DOC-019_Fortune_MustardOil_KachiGhani.md",
    specs: [
      { name: "Net Volume", value: "1000 mL (1 Litre)", conf: "0.99", doc: "DOC-019 §1.0" },
      { name: "Extraction Method", value: "Cold Pressed Traditional Kolhu", conf: "0.96", doc: "DOC-019 §2.1" },
      { name: "Smoke Point", value: "250°C", conf: "0.94", doc: "DOC-019 §3.2" },
      { name: "Pungency Index", value: "High Allyl Isothiocyanate > 0.28%", conf: "0.93", doc: "DOC-019 §4.1" },
      { name: "Statutory License", value: "FSSAI Lic No. 10013021000853 / AGMARK Grade I", conf: "0.99", doc: "DOC-019 §5.0" },
    ],
    price: "₹145 – ₹175",
    confidence: "96.5%",
    status: "Clean · Auto-Validated",
  },
  {
    id: "demo-4",
    inputName: "Havells Fabio 16A 1-Way Modular Switch",
    brand: "Havells India Ltd.",
    category: "Wiring Devices & Switches (UNSPSC 39122200)",
    retrievedDoc: "DOC-014_Havells_Fabio_ModularSwitches.md",
    specs: [
      { name: "Rated Current & Voltage", value: "16A, 240V AC 50Hz", conf: "0.99", doc: "DOC-014 §1.1" },
      { name: "Contact Metallurgy", value: "Silver Inlaid Copper Contacts", conf: "0.96", doc: "DOC-014 §2.4" },
      { name: "Module Size", value: "1 Module (1M Grid)", conf: "0.98", doc: "DOC-014 §3.0" },
      { name: "Flammability Rating", value: "FR Polycarbonate Glow Wire 850°C", conf: "0.95", doc: "DOC-014 §4.2" },
      { name: "Indian Standard", value: "BIS IS 3854:1997 with ISI Mark", conf: "0.99", doc: "DOC-014 §5.1" },
    ],
    price: "₹125 – ₹160",
    confidence: "98.1%",
    status: "Clean · Auto-Validated",
  },
]

// ── CORE FEATURES ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Layers,
    tab: "processor",
    label: "Batch Processor",
    headline: "Enrich 200 products at once",
    desc: "Feed minimal inputs — brand + product name. Get fully structured, grounded catalog records automatically.",
    cta: "Run Batch Engine",
    color: "bg-orange-50/70 border-orange-200/70 hover:border-orange-300",
    iconBg: "bg-orange-100/80 text-orange-600",
    badge: "200 Items / Batch",
  },
  {
    icon: Search,
    tab: "catalog",
    label: "Product Catalog",
    headline: "Browse & inspect every record",
    desc: "Search across 200 Indian products. Click any row to inspect grounded specs, confidence scores, and source proof.",
    cta: "Open Catalog",
    color: "bg-blue-50/70 border-blue-200/70 hover:border-blue-300",
    iconBg: "bg-blue-100/80 text-blue-600",
    badge: "15+ UNSPSC Classes",
  },
  {
    icon: ClipboardList,
    tab: "review",
    label: "Review Queue",
    headline: "Human-in-the-loop validation",
    desc: "Accept, edit, or reject AI-generated fields. Every flagged product waits here for your audited decision.",
    cta: "Go to Queue",
    color: "bg-amber-50/70 border-amber-200/70 hover:border-amber-300",
    iconBg: "bg-amber-100/80 text-amber-600",
    badge: "Audited Lineage",
  },
  {
    icon: BarChart3,
    tab: "metrics",
    label: "Quality Metrics",
    headline: "Live accuracy dashboard",
    desc: "Track confidence scores, validation rates, flagged fields, and category breakdowns in real time.",
    cta: "View Metrics",
    color: "bg-emerald-50/70 border-emerald-200/70 hover:border-emerald-300",
    iconBg: "bg-emerald-100/80 text-emerald-600",
    badge: "96.8% Accuracy",
  },
  {
    icon: GitBranch,
    tab: "processor",
    label: "Pipeline Architecture",
    headline: "Full Vector + LLM Lineage",
    desc: "TF-IDF cosine similarity across 196 technical chunks paired with grounded structured generation.",
    cta: "Explore Pipeline",
    color: "bg-purple-50/70 border-purple-200/70 hover:border-purple-300",
    iconBg: "bg-purple-100/80 text-purple-600",
    badge: "Deterministic Bounds",
  },
  {
    icon: ShieldCheck,
    tab: "catalog",
    label: "Indian Standards",
    headline: "FSSAI · BIS · BEE · IBR · PESO",
    desc: "Every product is cross-checked against Indian regulatory bodies and priced realistically in INR (₹).",
    cta: "Explore Standards",
    color: "bg-rose-50/70 border-rose-200/70 hover:border-rose-300",
    iconBg: "bg-rose-100/80 text-rose-600",
    badge: "National Compliance",
  },
]

// ── INDIAN REGULATORY COMPLIANCE STANDARDS ───────────────────────────────────
const STANDARDS_GRID = [
  {
    code: "BIS (IS)",
    name: "Bureau of Indian Standards",
    scope: "Mandatory ISI mark compliance across electricals, steel, cement, pipes, and appliances.",
    examples: ["IS 1391 (ACs)", "IS 3854 (Switches)", "IS 2062 (Steel)", "IS 1239 (Pipes)"],
    color: "border-blue-200 bg-blue-50/40",
  },
  {
    code: "FSSAI",
    name: "Food Safety & Standards Authority",
    scope: "Mandatory statutory labeling, allergen declarations, and packaging limits for FMCG goods.",
    examples: ["FSS (Packaging) Reg 2018", "AGMARK Grade-1", "Fortification Standards (+F)"],
    color: "border-emerald-200 bg-emerald-50/40",
  },
  {
    code: "BEE Star",
    name: "Bureau of Energy Efficiency",
    scope: "Energy consumption benchmarks and ISEER star ratings for HVAC and domestic appliances.",
    examples: ["1 to 5 Star Labels", "Annual Energy (kWh)", "ISEER Cooling Metrics"],
    color: "border-amber-200 bg-amber-50/40",
  },
  {
    code: "IBR 1950",
    name: "Indian Boiler Regulations",
    scope: "High-pressure certification for steam pipelines, boiler mountings, and industrial valves.",
    examples: ["Form III-C Certification", "Hydraulic Test Pressure", "Heat Treatment Trace"],
    color: "border-orange-200 bg-orange-50/40",
  },
  {
    code: "PESO / DGMS",
    name: "Petroleum & Explosives Safety",
    scope: "Flameproof & explosion-proof certification for motors, hazardous area electricals & mining.",
    examples: ["Ex d IIC T6 Rating", "Zone 1 & 2 Enclosures", "IS/IEC 60079 Compliance"],
    color: "border-rose-200 bg-rose-50/40",
  },
  {
    code: "Legal Metrology",
    name: "Weights & Measures Act 2009",
    scope: "Standardized net quantity declarations, maximum retail price rules, and manufacturer details.",
    examples: ["Packaged Commodities Rules", "Standard Units (g/mL/kg)", "Make in India Tag"],
    color: "border-purple-200 bg-purple-50/40",
  },
]

export function HomePage({ onEnter }: HomePageProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [selectedDemoIdx, setSelectedDemoIdx] = useState(0)
  const [animatingStep, setAnimatingStep] = useState(0)

  const activeDemo = DEMO_PRODUCTS[selectedDemoIdx]

  // Pipeline simulation step cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatingStep((prev) => (prev + 1) % 4)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  if (showHelp) {
    return <HowItWorksPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased selection:bg-black selection:text-white">

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-neutral-100 bg-white/95 backdrop-blur-xs sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="w-7 h-7 rounded-lg object-contain"
          />
          <span className="font-semibold text-sm tracking-tight text-neutral-900 flex items-center gap-1">
            Product<span className="text-amber-500">कोश</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-[9px] font-semibold text-neutral-600 border border-neutral-200">
              v1.0 Indian Commerce
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className="text-xs font-medium text-neutral-600 hover:text-black px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>

          <button
            onClick={() => onEnter("processor")}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center gap-1 shadow-xs"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <UserMenu />
        </div>
      </header>

      {/* ── Hero Section with Animated Badge ─────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-12 px-6 gap-6 max-w-4xl mx-auto w-full">

        {/* Live Engine Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-medium animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Indian Technical Intelligence Engine Online</span>
          <span className="text-neutral-400">·</span>
          <span className="font-semibold text-black">196 Vector Chunks</span>
        </div>

        {/* Logo + Wordmark Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-25 blur-sm group-hover:opacity-40 transition duration-500"></div>
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="relative rounded-2xl object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-300"
              style={{ width: 120, height: 120 }}
            />
          </div>
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="block mx-auto object-contain mt-1"
            style={{ height: "76px", filter: "brightness(0)" }}
          />
        </div>

        {/* Headline & Description */}
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl text-center">
          Turn minimal supplier strings into <strong className="text-neutral-900 font-semibold">deeply enriched, audit-ready catalog records</strong> — grounded in real Indian technical datasheets, mapped to standard UNSPSC taxonomy, and validated against national compliance bodies.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onEnter("processor")}
            className="group inline-flex items-center gap-2.5 bg-black text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Enter Product Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors px-6 py-3.5 rounded-full hover:bg-neutral-100 border border-neutral-200 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Architecture & Data Model</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-6 w-full max-w-3xl border-t border-neutral-100 text-center">
          <div className="p-3 rounded-2xl bg-neutral-50/60 border border-neutral-100">
            <div className="text-2xl font-bold text-neutral-900">200</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Indian Seed Products</div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50/60 border border-neutral-100">
            <div className="text-2xl font-bold text-neutral-900">196</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Indexed Datasheet Chunks</div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50/60 border border-neutral-100">
            <div className="text-2xl font-bold text-emerald-600">96.8%</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Average Confidence</div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50/60 border border-neutral-100">
            <div className="text-2xl font-bold text-amber-600">₹ INR</div>
            <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Calibrated Market Pricing</div>
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE EXTRACTION SIMULATOR ──────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800 relative overflow-hidden">
          
          {/* Subtle background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-800 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-semibold text-amber-400 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Interactive Live Engine Demo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Experience Grounded Technical Extraction
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Select a sample Indian product to preview the vector retrieval &rarr; specification grounding pipeline.
              </p>
            </div>

            {/* Product Selector Pills */}
            <div className="flex flex-wrap gap-1.5 bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-800">
              {DEMO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedDemoIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    selectedDemoIdx === idx
                      ? "bg-white text-black shadow-xs"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {prod.brand.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Live Pipeline Flow Animation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-6 border-b border-neutral-800 text-xs">
            <div className={`p-3.5 rounded-2xl border transition-all ${
              animatingStep === 0 ? "border-amber-400 bg-neutral-800/90 shadow-md scale-[1.02]" : "border-neutral-800 bg-neutral-950/40 text-neutral-400"
            }`}>
              <div className="flex items-center justify-between font-semibold mb-1 text-neutral-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">1</span>
                  Minimal Input
                </span>
                {animatingStep === 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <div className="font-mono text-[11px] text-amber-200/90 truncate">{activeDemo.inputName}</div>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              animatingStep === 1 ? "border-blue-400 bg-neutral-800/90 shadow-md scale-[1.02]" : "border-neutral-800 bg-neutral-950/40 text-neutral-400"
            }`}>
              <div className="flex items-center justify-between font-semibold mb-1 text-neutral-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">2</span>
                  Vector Retrieval
                </span>
                {animatingStep === 1 && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
              </div>
              <div className="font-mono text-[11px] text-blue-200/90 truncate">{activeDemo.retrievedDoc}</div>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              animatingStep === 2 ? "border-purple-400 bg-neutral-800/90 shadow-md scale-[1.02]" : "border-neutral-800 bg-neutral-950/40 text-neutral-400"
            }`}>
              <div className="flex items-center justify-between font-semibold mb-1 text-neutral-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] flex items-center justify-center font-bold">3</span>
                  UNSPSC & Specs
                </span>
                {animatingStep === 2 && <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />}
              </div>
              <div className="text-[11px] text-purple-200/90 truncate">5 Grounded Attributes</div>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              animatingStep === 3 ? "border-emerald-400 bg-neutral-800/90 shadow-md scale-[1.02]" : "border-neutral-800 bg-neutral-950/40 text-neutral-400"
            }`}>
              <div className="flex items-center justify-between font-semibold mb-1 text-neutral-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">4</span>
                  Standards & Bounds
                </span>
                {animatingStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="text-[11px] text-emerald-200/90 font-medium">Confidence: {activeDemo.confidence}</div>
            </div>
          </div>

          {/* Enriched Spec Result Card */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Product Meta */}
            <div className="space-y-4 bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80">
              <div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Enriched Record
                </div>
                <h3 className="text-base font-bold text-white">
                  {activeDemo.inputName}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeDemo.category}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-neutral-500">Brand / OEM:</span>
                  <span className="font-semibold text-white">{activeDemo.brand}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-neutral-500">Indian Market Price:</span>
                  <span className="font-semibold text-amber-300">{activeDemo.price}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-neutral-500">Validation Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {activeDemo.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onEnter("catalog")}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 mt-3"
              >
                <span>Inspect in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Technical Attributes Map */}
            <div className="lg:col-span-2 space-y-2 bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-3 pb-2 border-b border-neutral-800">
                <span>Extracted Technical Attributes</span>
                <span>Confidence & Evidence Citation</span>
              </div>

              <div className="space-y-2.5">
                {activeDemo.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] font-medium text-neutral-400">{spec.name}</div>
                      <div className="text-xs font-bold text-white mt-0.5">{spec.value}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-mono border border-neutral-700">
                        {spec.doc}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                        {(parseFloat(spec.conf) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── FEATURE EXPLORATION GRID ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">
            Complete Product Intelligence Suite
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            What would you like to explore?
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Access enterprise tools designed for catalog managers, compliance auditors, and supply chain leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon
            return (
              <button
                key={idx}
                onClick={() => onEnter(f.tab)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`
                  group text-left p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between
                  ${f.color}
                  ${hoveredIdx === idx
                    ? "shadow-xl -translate-y-1.5 scale-[1.01]"
                    : "shadow-xs hover:shadow-md"}
                `}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${f.iconBg} shadow-xs transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-neutral-600 border border-neutral-200 shadow-2xs">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-1.5 leading-snug">
                    {f.headline}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                    {f.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:gap-2.5 transition-all pt-2 border-t border-neutral-200/50">
                  <span>{f.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── INDIAN REGULATORY COMPLIANCE DIRECTORY ────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="bg-neutral-50/80 rounded-3xl p-8 border border-neutral-200">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-semibold text-rose-700 mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Statutory Compliance Integration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Indian Regulatory Standards Matrix
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Every enriched product is audited against corresponding Indian government and statutory bodies.
              </p>
            </div>

            <button
              onClick={() => onEnter("catalog")}
              className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>Explore Verified Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STANDARDS_GRID.map((std, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${std.color} transition-all hover:shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900">{std.code}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[11px] font-semibold text-neutral-700 mb-1">{std.name}</div>
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">{std.scope}</p>
                <div className="flex flex-wrap gap-1">
                  {std.examples.map((ex, exIdx) => (
                    <span
                      key={exIdx}
                      className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-neutral-600 border border-neutral-200"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto w-full px-6 py-12 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-black text-white shadow-xl relative overflow-hidden">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Ready to enrich your Indian product catalog?
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto mb-6 leading-relaxed">
            Upload minimal spreadsheets or launch the interactive batch processor with 200 pre-configured Indian industrial items.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnter("processor")}
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-100 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Launch Batch Processor</span>
            </button>
            <button
              onClick={() => onEnter("catalog")}
              className="px-6 py-3.5 rounded-full bg-neutral-800 text-white font-semibold text-xs hover:bg-neutral-700 transition-colors border border-neutral-700 cursor-pointer"
            >
              <span>Browse Catalog Database</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 bg-white py-6 text-center text-xs text-neutral-400 font-sans">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/logo.png" alt="ProductKOSH" className="w-4 h-4 rounded object-contain" />
          <span className="font-semibold text-neutral-700">Productकोश</span>
          <span>— Indian Product Intelligence Platform</span>
        </div>
        <p className="text-[11px] text-neutral-400">
          Grounded Technical Extraction · UNSPSC Taxonomy · INR Market Pricing · FSSAI / BIS / BEE / IBR Compliance
        </p>
      </footer>

    </div>
  )
}
