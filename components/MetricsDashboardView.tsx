"use client"

import React from "react"
import { BarChart3, CheckCircle, AlertTriangle, Sparkles, Cpu, Layers } from "lucide-react"

interface MetricsDashboardProps {
  metrics: any
}

export function MetricsDashboardView({ metrics }: MetricsDashboardProps) {
  const totalProds = metrics?.total_products || 75
  const cleanCount = metrics?.clean_count || 0
  const flaggedCount = metrics?.flagged_count || 75
  const reviewedCount = metrics?.reviewed_count || 0
  const pctValidated = metrics?.pct_validated || 0.0
  const pctFlagged = metrics?.pct_flagged || 100.0
  const avgConf = metrics ? (metrics.avg_confidence * 100).toFixed(1) : "79.5"

  const catBreakdown = metrics?.category_breakdown || {
    "Industrial Valves": 22,
    "Industrial Pumps": 20,
    "Sensors & Instrumentation": 20,
    "Flowmeters & Meters": 10,
    "Pneumatic Actuators": 3
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
            <BarChart3 className="w-4 h-4" /> Measurable Catalog Data Quality
          </div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Precision & Catalog Quality Dashboard
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time validation metrics, grounded confidence scores, and UNSPSC category distribution.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-mono text-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
          Cross-Checked Against 20 Spec Sheets
        </div>
      </div>

      {/* KPI Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Auto-Validated Clean</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{pctValidated}%</span>
            <span className="text-xs text-neutral-400">({cleanCount + reviewedCount}/{totalProds})</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pctValidated}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400">Passed unit & range bound checks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Flagged for HITL Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{pctFlagged}%</span>
            <span className="text-xs text-neutral-400">({flaggedCount}/{totalProds})</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pctFlagged}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400">Routed to human triage queue</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Avg Grounded Confidence</span>
            <Sparkles className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">{avgConf}%</span>
            <span className="text-xs text-neutral-400">score</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-black h-1.5 rounded-full" style={{ width: `${avgConf}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400">Strict grounding instruction in Gemini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Total Specs Grounded</span>
            <Cpu className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">
              {metrics?.total_fields || 375}
            </span>
            <span className="text-xs text-neutral-400">fields</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-neutral-800 h-1.5 rounded-full" style={{ width: "100%" }} />
          </div>
          <p className="text-[10px] text-neutral-400">Extracted across size, pressure, temp, material</p>
        </div>

      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" /> UNSPSC Taxonomy Category Distribution
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">5 Major Industrial Verticals</span>
        </div>

        <div className="space-y-3">
          {Object.entries(catBreakdown).map(([cat, count]: [string, any]) => {
            const pct = Math.round((count / totalProds) * 100)
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">{cat}</span>
                  <span className="font-mono text-neutral-600">{count} products ({pct}%)</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/50">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
