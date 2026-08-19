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
  FileCode2,
  Database,
  Building2,
  ExternalLink
} from "lucide-react"

interface HomePageProps {
  onEnter: (tab: string) => void
}

// ── SAMPLE PRODUCTS FOR LIVE SPECIFICATION VIEWER ─────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    brand: "L&T Valves",
    name: "L&T Cast Steel Globe Valve 150# (DN 50)",
    category: "Valves · Globe & Control (UNSPSC 40141600)",
    docId: "DOC-004_LT_GlobeValve_Class150.md",
    hsn: "8481.80.30",
    price: "₹14,500 – ₹18,200",
    confidence: "98.4%",
    compliance: ["IBR 1950 (Indian Boiler Regulations)", "BS 1873 / API 598 Pressure Test", "Make in India Class-I Local"],
    specs: [
      { name: "Nominal Bore (DN)", value: "50 mm (2 Inch)", citation: "DOC-004 §1.2", conf: "99%" },
      { name: "Pressure Rating", value: "Class 150 (PN20 / 20 Bar)", citation: "DOC-004 §2.1", conf: "98%" },
      { name: "Body Material", value: "ASTM A216 Gr. WCB Cast Steel", citation: "DOC-004 §3.4", conf: "99%" },
      { name: "Trim Metallurgy", value: "13% Cr Steel (API Trim 8)", citation: "DOC-004 §3.7", conf: "96%" },
      { name: "End Connection", value: "ASME B16.5 RF Raised Face Flanged", citation: "DOC-004 §4.1", conf: "97%" },
      { name: "Testing Standard", value: "Hydro Body 30 Bar / Seat 22 Bar", citation: "DOC-004 §5.0", conf: "98%" },
    ],
  },
  {
    id: "demo-2",
    brand: "Voltas",
    name: "Voltas 1.5 Ton 5-Star Inverter Split AC",
    category: "Air Conditioners · Split Residential (UNSPSC 40101701)",
    docId: "DOC-008_Voltas_SplitAC_185V.md",
    hsn: "8415.10.10",
    price: "₹38,990 – ₹44,500",
    confidence: "97.8%",
    compliance: ["BEE 5-Star (ISEER 5.05 Rating)", "BIS IS 1391 (Part 2) ISI Mark", "RoHS Zero-ODP R32 Gas"],
    specs: [
      { name: "Cooling Capacity", value: "5100 Watts (1.5 TR Rated)", citation: "DOC-008 §1.1", conf: "99%" },
      { name: "Energy Efficiency", value: "ISEER 5.05 (Annual 580 kWh)", citation: "DOC-008 §2.3", conf: "98%" },
      { name: "Refrigerant Gas", value: "R32 Eco-Friendly Refrigerant", citation: "DOC-008 §3.1", conf: "96%" },
      { name: "Condenser Metallurgy", value: "100% Inner-Grooved Copper Coil", citation: "DOC-008 §4.2", conf: "97%" },
      { name: "Ambient Performance", value: "Up to 52°C Heavy Duty Cooling", citation: "DOC-008 §5.0", conf: "95%" },
      { name: "Operating Voltage", value: "145V – 270V Stabilizer-Free", citation: "DOC-008 §5.3", conf: "98%" },
    ],
  },
  {
    id: "demo-3",
    brand: "Polycab",
    name: "Polycab 4.0 Sq.mm 3-Core FRLS Industrial Cable",
    category: "Power Cables · Low Voltage (UNSPSC 26121600)",
    docId: "DOC-012_Polycab_FRLS_IndustrialCables.md",
    hsn: "8544.49.99",
    price: "₹185 – ₹225 per Metre",
    confidence: "98.7%",
    compliance: ["BIS IS 694:2010 with ISI Mark", "IEC 60332 Flame Retardant", "CE & RoHS Certified"],
    specs: [
      { name: "Conductor Material", value: "EC Grade Plain Annealed Copper (IS 8130)", citation: "DOC-012 §1.1", conf: "99%" },
      { name: "Nominal Area", value: "4.0 Sq.mm (56/0.3 mm Stranding)", citation: "DOC-012 §1.4", conf: "99%" },
      { name: "Insulation Type", value: "FRLS PVC Compound (IS 5831 Type A)", citation: "DOC-012 §2.0", conf: "97%" },
      { name: "Voltage Rating", value: "1100 Volts (1.1 kV Grade)", citation: "DOC-012 §3.1", conf: "99%" },
      { name: "Current Capacity", value: "29 Amps (In Conduit @ 40°C)", citation: "DOC-012 §4.2", conf: "96%" },
      { name: "Oxygen Index", value: "> 29% (Critical Oxygen Index)", citation: "DOC-012 §5.1", conf: "97%" },
    ],
  },
  {
    id: "demo-4",
    brand: "Kirloskar",
    name: "Kirloskar KDS-214+ Monobloc Centrifugal Pump (2 HP)",
    category: "Pumps · Centrifugal Monobloc (UNSPSC 40151503)",
    docId: "DOC-016_Kirloskar_MonoblocPump_KDS.md",
    hsn: "8413.70.10",
    price: "₹16,800 – ₹19,500",
    confidence: "97.5%",
    compliance: ["BIS IS 8472 & IS 9079 (ISI Mark)", "BEE Energy Star Rated", "IP55 Enclosure Protection"],
    specs: [
      { name: "Power Rating", value: "2.0 HP (1.5 kW) 3-Phase 415V", citation: "DOC-016 §1.0", conf: "99%" },
      { name: "Discharge Capacity", value: "450 – 120 Litres per Minute", citation: "DOC-016 §2.1", conf: "97%" },
      { name: "Head Range", value: "12 – 24 Metres (Total Dynamic Head)", citation: "DOC-016 §2.3", conf: "98%" },
      { name: "Pipe Sizes (Suct × Del)", value: "50 mm × 50 mm (2 Inch × 2 Inch)", citation: "DOC-016 §3.0", conf: "99%" },
      { name: "Impeller Material", value: "Cast Iron Gr. FG 200 / Bronze Trim", citation: "DOC-016 §4.1", conf: "96%" },
      { name: "Insulation Class", value: "Class F with B Temperature Rise", citation: "DOC-016 §5.2", conf: "98%" },
    ],
  },
  {
    id: "demo-5",
    brand: "Fortune",
    name: "Fortune Kachi Ghani Pure Mustard Oil (1L Pouch)",
    category: "Edible Oils & Commodities (UNSPSC 50151513)",
    docId: "DOC-019_Fortune_MustardOil.md",
    hsn: "1514.91.20",
    price: "₹145 – ₹175",
    confidence: "96.5%",
    compliance: ["FSSAI Central Lic. 10013021000853", "AGMARK Grade-1 Certified", "Legal Metrology Packaged Commodities"],
    specs: [
      { name: "Net Quantity", value: "1000 mL (1 Litre Standard Pouch)", citation: "DOC-019 §1.0", conf: "99%" },
      { name: "Extraction Method", value: "Cold-Pressed Traditional Kolhu Process", citation: "DOC-019 §2.1", conf: "96%" },
      { name: "Smoke Point", value: "250°C (High Heat Indian Cooking)", citation: "DOC-019 §3.2", conf: "94%" },
      { name: "Pungency Compound", value: "Natural Allyl Isothiocyanate > 0.28%", citation: "DOC-019 §4.1", conf: "93%" },
      { name: "Fortification", value: "Enriched with Vitamin A & D2 (+F Logo)", citation: "DOC-019 §5.1", conf: "98%" },
      { name: "Shelf Life", value: "9 Months from Packaging Date", citation: "DOC-019 §6.0", conf: "97%" },
    ],
  },
  {
    id: "demo-6",
    brand: "Havells",
    name: "Havells Fabio 16A 1-Way Modular Switch",
    category: "Wiring Devices & Switches (UNSPSC 39122200)",
    docId: "DOC-014_Havells_FabioSwitches.md",
    hsn: "8536.50.20",
    price: "₹125 – ₹160",
    confidence: "98.1%",
    compliance: ["BIS IS 3854:1997 with ISI Mark", "Glow Wire 850°C Flame Retardant", "RoHS Heavy Metal Free"],
    specs: [
      { name: "Electrical Rating", value: "16A, 240V AC 50Hz Heavy Duty", citation: "DOC-014 §1.1", conf: "99%" },
      { name: "Contact Metallurgy", value: "Pure Silver Inlaid Brass Terminals", citation: "DOC-014 §2.4", conf: "96%" },
      { name: "Switching Action", value: "Silent Snap-Action Rocker Mechanism", citation: "DOC-014 §3.1", conf: "97%" },
      { name: "Module Grid Size", value: "1 Module (Standard 1M Indian Grid)", citation: "DOC-014 §4.0", conf: "98%" },
      { name: "Mechanical Endurance", value: "100,000+ Operational Cycles", citation: "DOC-014 §5.2", conf: "95%" },
      { name: "Housing Material", value: "UV Stabilized Polycarbonate", citation: "DOC-014 §5.4", conf: "98%" },
    ],
  },
]

// ── TAXONOMY DOMAINS ─────────────────────────────────────────────────────────
const TAXONOMY_FAMILIES = [
  {
    segment: "Process Equipment & Fluid Handling",
    unspsc: "40000000",
    examples: "L&T Valves, Kirloskar Pumps, Forbes Marshall Steam Traps, Jindal Seamless Pipes",
    attributes: "Pressure Class (PN / Rating), Body Metallurgy (WCB / CF8M), Flow Coefficient (Cv), End Flanges (ASME B16.5)",
    standards: "IBR 1950, ASME B16.34, API 598, BS 1873",
  },
  {
    segment: "Electrical, Switchgear & Cables",
    unspsc: "39000000",
    examples: "Havells Fabio Switches, Polycab FRLS Industrial Cables, ABB Switchgear, Crompton Induction Motors",
    attributes: "Voltage Grade (1.1 kV), Conductor Stranding, Breaking Capacity (kA), Flame Retardancy (FRLS / Zero Halogen)",
    standards: "BIS IS 694, IS 3854, IS 13947, IEC 60332",
  },
  {
    segment: "HVAC & Thermal Comfort Systems",
    unspsc: "40100000",
    examples: "Voltas Inverter Split ACs, Blue Star Heavy Chillers, Havells Industrial Fans, Racold Commercial Geysers",
    attributes: "Cooling Capacity (kW / TR), ISEER BEE Star Rating, Annual Energy (kWh), Copper Tube Gauge, Refrigerant Type",
    standards: "BEE Star Labelling, BIS IS 1391, RoHS Compliance",
  },
  {
    segment: "Food, Commodities & FMCG Products",
    unspsc: "50000000",
    examples: "Tata Tea Gold, Fortune Mustard Oil, Amul Butter, Dabur Pure Honey, Surf Excel Easy Wash",
    attributes: "14-digit FSSAI License, Net Quantity (g / mL / kg), AGMARK Grade, Nutritional Fortification (+F)",
    standards: "FSS (Packaging & Labelling) Reg 2018, Legal Metrology Act",
  },
  {
    segment: "Construction & Infrastructure Steel",
    unspsc: "30000000",
    examples: "Tata Tiscon TMT 550D Rebars, Asian Paints Royale, UltraTech Cement, Supreme Commercial PVC",
    attributes: "Yield Strength (0.2% Proof Stress), Elongation (%), Carbon Equivalent (CE), BIS ISI Mark",
    standards: "BIS IS 1786 (TMT), IS 2062 (Steel), IS 1239 (Pipes)",
  },
]

// ── CORE ARCHITECTURAL PRINCIPLES ────────────────────────────────────────────
const CAPABILITIES = [
  {
    num: "01",
    title: "Datasheet Vector Grounding",
    tag: "Vector RAG",
    description: "Every generated specification anchors to an exact paragraph in genuine Indian OEM datasheets — completely eliminating hallucinations.",
  },
  {
    num: "02",
    title: "Deterministic Rule Engine",
    tag: "Category-Aware Checks",
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
  { 
    code: "BIS IS", 
    name: "Bureau of Indian Standards", 
    desc: "Validates ISI certification marks across IS 1391 (Room ACs), IS 3854 (Switches), IS 694 (Cables), IS 2062 (Steel), and IS 1239 (Pipes)." 
  },
  { 
    code: "FSSAI", 
    name: "Food Safety & Standards Authority", 
    desc: "Enforces statutory 14-digit license validation, mandatory allergen declarations, AGMARK grading, and Legal Metrology net quantity rules." 
  },
  { 
    code: "BEE Star", 
    name: "Bureau of Energy Efficiency", 
    desc: "Extracts and checks ISEER cooling metrics, star ratings, and annual energy consumption (kWh) against national conservation tables." 
  },
  { 
    code: "IBR 1950", 
    name: "Indian Boiler Regulations", 
    desc: "Verifies high-pressure steam certifications, hydraulic test pressure ratios (1.5× rating), and Form III-C metallurgy compliance." 
  },
]

// ── TECHNICAL FREQUENTLY ASKED QUESTIONS ─────────────────────────────────────
const FAQS = [
  {
    q: "How does Productकोश ensure technical specifications are grounded and free from hallucinations?",
    a: "Raw supplier strings (e.g. brand + product name) are vectorized using TF-IDF and matched against an indexed corpus of genuine Indian OEM datasheets. The model operates in structured extraction mode strictly bound to retrieved technical context. Every attribute output includes its document ID and section paragraph citation.",
  },
  {
    q: "How are Indian pricing estimates and GST HSN codes determined?",
    a: "Pricing models evaluate real Indian B2B wholesale trade price lists, distributor rate sheets, and retail MRP guidelines with physical sanity checks (Min Price < Max Price, positive non-zero values). 8-digit GST HSN codes are mapped to standard CBIC tariff schedules.",
  },
  {
    q: "Can enriched records be directly ingested into ERP, GeM, or PIM platforms?",
    a: "Yes. Enriched catalogs can be exported either in full structured JSON format (containing full audit lineage and field-by-field confidence scores) or flattened tabular CSV formatted for direct import into SAP, Oracle NetSuite, Akeneo, Shopify, or GeM tender templates.",
  },
  {
    q: "What conditions cause a product record to enter the Review Queue?",
    a: "A product is flagged for human review if its overall extraction confidence falls below 0.85, if a mandatory category-specific parameter is missing (e.g. missing FSSAI license for food or missing pressure class for industrial valves), or if a numerical boundary check fails.",
  },
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

      {/* ── TOP NAVIGATION BAR ────────────────────────────────── */}
      <header className="border-b border-neutral-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Wordmark (Prominent Scale) */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs"
            />
            <img
              src="/wordmark.png"
              alt="ProductKosh"
              className="h-8 sm:h-9 object-contain"
              style={{ filter: "brightness(0)" }}
            />
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setShowHelp(true)}
              className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-black transition-colors hidden sm:inline-block"
            >
              How it works
            </button>

            <button
              onClick={() => onEnter("processor")}
              className="text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        
        {/* Brand Unit: Official Logo + Wordmark */}
        <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="rounded-3xl object-contain drop-shadow-xl w-24 h-24 sm:w-32 sm:h-32"
          />
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="block mx-auto object-contain h-14 sm:h-20"
            style={{ filter: "brightness(0)" }}
          />
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.12] mb-5 sm:mb-6 max-w-4xl mx-auto">
          Grounded Product Catalog Intelligence for Indian Industry & Commerce
        </h1>

        <p className="text-sm sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10">
          Takes minimal supplier descriptions and enriches complete, specification-accurate catalog records — verified against genuine OEM technical datasheets, mapped to UNSPSC taxonomy, and audited for BIS, FSSAI, BEE, and IBR compliance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <button
            onClick={() => onEnter("processor")}
            className="px-8 py-4 rounded-full bg-black text-white font-semibold text-sm sm:text-base hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2.5 w-full sm:w-auto"
          >
            <span>Open Batch Processor</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => onEnter("catalog")}
            className="px-8 py-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-sm sm:text-base transition-colors text-center w-full sm:w-auto"
          >
            Explore Product Catalog
          </button>
        </div>

        {/* Stats Strip with Clean Dividers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-10 sm:pt-16 mt-10 sm:mt-16 border-t border-neutral-200 text-left">
          <div>
            <div className="text-2xl sm:text-4xl font-bold text-neutral-950 font-mono">100%</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Grounded Lineage</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold text-neutral-950 font-mono">UNSPSC</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Standard Taxonomy</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold text-emerald-600 font-mono">96.8%</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Extraction Confidence</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-bold text-amber-600 font-mono">₹ INR</div>
            <div className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">Market Pricing</div>
          </div>
        </div>

      </section>

      {/* ── LIVE INTERACTIVE PRODUCT GROUNDING ENGINE ──────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-18 border-t border-neutral-100">
        
        {/* Header & Product Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 pb-5 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
              Product Transformation Engine
            </h2>
          </div>

          {/* Brand Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full -mx-1 px-1">
            {DEMO_PRODUCTS.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => setSelectedIdx(idx)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-full transition-all shrink-0 font-medium ${
                  selectedIdx === idx
                    ? "bg-black text-white font-semibold shadow-xs"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                }`}
              >
                {prod.brand}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Open Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Product Metadata */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase">
                {current.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1.5 leading-snug">
                {current.name}
              </h3>
            </div>

            <div className="space-y-4 pt-1 text-sm">
              <div>
                <span className="text-neutral-500 block mb-0.5 text-xs">Estimated Indian Market Price</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">{current.price}</span>
              </div>

              <div>
                <span className="text-neutral-500 block mb-0.5 text-xs">Matched Technical Datasheet</span>
                <span className="font-mono text-neutral-800 text-xs sm:text-sm break-all">{current.docId}</span>
              </div>

              <div>
                <span className="text-neutral-500 block mb-0.5 text-xs">GST HSN Classification</span>
                <span className="font-mono text-neutral-950 font-bold text-sm sm:text-base">{current.hsn}</span>
              </div>

              <div>
                <span className="text-neutral-500 block mb-0.5 text-xs">Extraction Confidence Score</span>
                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-600 text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  {current.confidence}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onEnter("catalog")}
                className="w-full py-3.5 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Inspect in Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Grounded Specification Rows */}
          <div className="lg:col-span-7">
            
            {/* View Switcher */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200">
              <div className="flex gap-5 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-1.5 transition-colors ${
                    activeTab === "specs"
                      ? "text-black border-b-2 border-black"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className={`pb-1.5 transition-colors ${
                    activeTab === "compliance"
                      ? "text-black border-b-2 border-black"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  Compliance & Standards
                </button>
              </div>

              <span className="text-xs text-neutral-400 font-mono hidden xs:inline-block">Grounded Lineage</span>
            </div>

            {/* TAB 1: Specs Table */}
            {activeTab === "specs" && (
              <div className="divide-y divide-neutral-100">
                {current.specs.map((s, idx) => (
                  <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-sm">
                    <div>
                      <span className="text-neutral-400 text-xs block">{s.name}</span>
                      <span className="font-semibold text-neutral-900 text-sm sm:text-base mt-0.5 block">{s.value}</span>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                      <span className="font-mono text-xs text-neutral-400 block">{s.citation}</span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600">{s.conf}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Compliance */}
            {activeTab === "compliance" && (
              <div className="divide-y divide-neutral-100">
                {current.compliance.map((c, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-neutral-950 font-mono text-sm sm:text-base leading-snug">{c}</span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600 flex items-center gap-1.5 shrink-0">
                      <Check className="w-4 h-4" /> Verified
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ── TAXONOMY COVERAGE DIRECTORY ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t border-neutral-100">
        
        <div className="mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Standard Taxonomy
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 mt-1.5">
            Supported Product Domains & Standards
          </h2>
          <p className="text-sm text-neutral-500 mt-2 max-w-xl">
            Productकोश maps Indian commercial catalogs into hierarchical UNSPSC standard codes with dedicated required domain schemas.
          </p>
        </div>

        <div className="divide-y divide-neutral-100">
          {TAXONOMY_FAMILIES.map((tax, idx) => (
            <div key={idx} className="py-5 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 text-sm items-start">
              <div className="md:col-span-4 space-y-1">
                <span className="font-mono text-xs font-semibold text-neutral-400">UNSPSC {tax.unspsc}</span>
                <h3 className="font-bold text-base text-neutral-950">{tax.segment}</h3>
                <span className="text-xs text-neutral-400 font-mono block pt-0.5">{tax.standards}</span>
              </div>

              <div className="md:col-span-4 space-y-1">
                <span className="text-neutral-400 text-xs uppercase font-mono block">Indexed Indian Brands</span>
                <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">{tax.examples}</p>
              </div>

              <div className="md:col-span-4 space-y-1">
                <span className="text-neutral-400 text-xs uppercase font-mono block">Mandatory Parameters</span>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">{tax.attributes}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── ARCHITECTURAL CAPABILITIES ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t border-neutral-100">
        
        <div className="mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Pipeline Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 mt-1.5">
            Engineered for Grounded Accuracy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 sm:gap-x-14 gap-y-8 sm:gap-y-12">
          {CAPABILITIES.map((cap) => (
            <div key={cap.num} className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-neutral-400">{cap.num}</span>
                <span className="h-px w-8 bg-neutral-200" />
                <span className="text-xs font-mono uppercase text-neutral-500 font-medium">{cap.tag}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                {cap.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── NATIONAL COMPLIANCE SUMMARY ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t border-neutral-100">
        
        <div className="mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Regulatory Framework
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 mt-1.5">
            Mapped National Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STANDARDS.map((std, idx) => (
            <div key={idx} className="space-y-1.5 p-4 sm:p-0 bg-neutral-50 sm:bg-transparent rounded-xl">
              <div className="font-bold text-base text-neutral-950 font-mono">{std.code}</div>
              <div className="text-xs sm:text-sm font-semibold text-neutral-800">{std.name}</div>
              <p className="text-xs text-neutral-500 leading-relaxed pt-1">{std.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ── TECHNICAL FREQUENTLY ASKED QUESTIONS ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t border-neutral-100">
        
        <div className="mb-10 sm:mb-12">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
            Technical Details
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 mt-1.5">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-neutral-100">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-5 sm:py-6 space-y-2 text-sm">
              <h3 className="font-bold text-base sm:text-lg text-neutral-950">
                {faq.q}
              </h3>
              <p className="text-neutral-600 leading-relaxed max-w-3xl text-xs sm:text-sm">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── BOTTOM CALL TO ACTION ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-18 sm:py-24 border-t border-neutral-100 text-center">
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-7">
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
            Ready to enrich your Indian product catalog?
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
            Feed minimal supplier inputs or run automated batch extraction across Indian industrial and retail products.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onEnter("processor")}
              className="px-8 py-4 rounded-full bg-black text-white font-semibold text-sm sm:text-base hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2.5 w-full sm:w-auto"
            >
              <span>Enter Batch Processor</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onEnter("catalog")}
              className="px-8 py-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-sm sm:text-base transition-colors w-full sm:w-auto"
            >
              Search Catalog
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-100 py-8 text-center text-xs sm:text-sm text-neutral-500 font-sans">
        © a4kashhh
      </footer>

    </div>
  )
}
