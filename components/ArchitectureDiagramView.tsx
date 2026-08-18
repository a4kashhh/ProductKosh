"use client"

import React from "react"
import { Layers, Database, Cpu, ShieldCheck, AlertTriangle, FileSpreadsheet, CheckCircle, Code } from "lucide-react"

export function ArchitectureDiagramView() {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
            <Layers className="w-4 h-4" /> System Architecture & Data Flow
          </div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Productकोश End-to-End Pipeline Architecture
          </h2>
          <p className="text-xs text-neutral-500">
            A transparent, explainable pipeline designed for industrial product intelligence and batch catalog scalability.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            01
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Minimal Input
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            CSV / JSON input with sparse data (e.g. Product Name + 1 attribute).
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            02
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <Database className="w-3.5 h-3.5" /> Vector Retrieval
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            ChromaDB / TF-IDF semantic search pulls top candidate context chunks from 20 datasheets.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            03
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Gemini LLM
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Gemini API structured output fills canonical schema grounded strictly in context with reasoning.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            04
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AI Validation
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Rule-based engine checks unit consistency, physical bounds (-273°C to 1500°C), & contradictions.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            05
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> HITL Queue
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Low-confidence or flagged fields go to human reviewer triage to accept, edit, or reject.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-2 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
            06
          </div>
          <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Clean Catalog
          </h3>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Validated structured records exported to JSON/CSV for enterprise ERP/PIM catalog integration.
          </p>
        </div>

      </div>

      {/* Technical Highlights */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-neutral-700" /> Technical Guarantees & Implementation Highlights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <h4 className="font-bold text-neutral-900 text-xs">1. Zero-Black-Box Grounding & Explainability</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Every single extracted specification field is linked to its exact source chunk ID, grounded quote excerpt, and a 1-line reasoning string explaining why it was inferred.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <h4 className="font-bold text-neutral-900 text-xs">2. Graceful Degradation & Resilience</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              The engine will never crash. If Gemini API key is missing or quota/network fails, high-precision grounded heuristic parsing fallbacks ensure 100% execution continuity.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <h4 className="font-bold text-neutral-900 text-xs">3. Multi-Pass AI Validation</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Validation pass enforces strict domain rules: unit normalization (PSI/Bar, °C/°F), physical bound checks, mandatory attribute completeness, and min/max contradiction detection.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <h4 className="font-bold text-neutral-900 text-xs">4. Scalable Batch Processing</h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Threaded background batch runner enriches 50–100 items asynchronously while streaming live progress, throughput, and execution logs to the frontend via REST polling.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
