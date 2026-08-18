"use client"

import React, { useState, useEffect } from "react"
import { Warp } from "@paper-design/shaders-react"
import { Play, CheckCircle, AlertTriangle, FileText, Loader2, ArrowRight, Sparkles } from "lucide-react"

interface BatchProcessorProps {
  onBatchComplete: () => void
  onNavigateToQueue: () => void
}

type Theme = "default" | "angsty" | "tibor" | "minty"

const themes: Record<Theme, { color1: string; color2: string; color3: string }> = {
  default: { color1: "#ade7ff", color2: "#ebf4ff", color3: "#00bbff" },
  angsty: { color1: "#ffffff", color2: "#bfbfbf", color3: "#ffffff" },
  tibor: { color1: "#ff6f00", color2: "#fec398", color3: "#ffffff" },
  minty: { color1: "#00c853", color2: "#98fec3", color3: "#ffffff" },
}

const themeLabels: Record<Theme, string> = {
  default: "default",
  angsty: "angsty teen",
  tibor: "hello tibor",
  minty: "minty fresh",
}

export function BatchProcessorView({ onBatchComplete, onNavigateToQueue }: BatchProcessorProps) {
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<any>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [theme, setTheme] = useState<Theme>("tibor")
  const [userTheme, setUserTheme] = useState<Theme>("tibor") // tracks user's manual choice

  // Auto-switch orb theme based on batch state
  useEffect(() => {
    if (jobStatus?.status === "running") {
      setTheme("minty")
    } else {
      setTheme(userTheme)
    }
  }, [jobStatus?.status, userTheme])

  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/enrich/batch/status/${jobId}`)
        if (res.ok) {
          const data = await res.json()
          setJobStatus(data)
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(interval)
            onBatchComplete()
          }
        }
      } catch (err) {
        console.error("Error polling batch status:", err)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [jobId, onBatchComplete])

  const handleStartMockBatch = async () => {
    setIsStarting(true)
    try {
      const res = await fetch("http://localhost:8000/api/enrich/batch", { method: "POST" })
      if (res.ok) {
        const job = await res.json()
        setJobId(job.job_id)
        setJobStatus(job)
      }
    } catch (err) {
      console.error("Failed to launch batch job:", err)
    } finally {
      setIsStarting(false)
    }
  }

  const progressPct = jobStatus?.total_items
    ? Math.min(100, Math.round((jobStatus.processed_items / jobStatus.total_items) * 100))
    : 0

  const activeColors = themes[theme]

  return (
    <div className="space-y-8">
      
      {/* OpenAI Orb Hero Card */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
        


        {/* 240x240 Interactive OpenAI WebGL Orb Canvas */}
        <div
          className="rounded-full overflow-hidden shadow-lg border border-neutral-200"
          style={{
            width: 240,
            height: 240,
            transform: jobStatus?.status === "running" ? "scale(1.05)" : "scale(1)",
            transition: "transform 300ms ease-in-out",
          }}
        >
          <Warp
            width={240}
            height={240}
            colors={[activeColors.color1, activeColors.color2, activeColors.color3]}
            proportion={0.35}
            softness={1}
            distortion={0.32}
            swirl={1}
            speed={jobStatus?.status === "running" ? 22 : 12.2}
            scale={0.31}
            rotation={176}
          />
        </div>

        {/* Title & Batch Execution Button */}
        <div className="space-y-2 max-w-lg">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Indian Product Catalog Engine (200 Products)
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Takes minimal Indian product inputs (Tata Tea, Amul, Havells, Surf Excel, Voltas, Asian Paints, L&T, Kirloskar) and enriches canonical records grounded across 40 spec sheets.
          </p>
        </div>

        <button
          onClick={handleStartMockBatch}
          disabled={isStarting || (jobStatus && jobStatus.status === "running")}
          className="font-sans text-xs px-6 py-2.5 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isStarting || (jobStatus && jobStatus.status === "running") ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Enriching 200 Products...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Batch on 200 Products
            </>
          )}
        </button>

      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Total Processed</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-neutral-900">
              {jobStatus ? jobStatus.processed_items : 200}
            </span>
            <span className="text-xs text-neutral-400">/ {jobStatus ? jobStatus.total_items : 200}</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct || 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Auto-Validated Clean</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {jobStatus ? jobStatus.validated_clean_items : 0}
            </span>
            <span className="text-xs text-neutral-400">zero flags</span>
          </div>
          <p className="text-[10px] text-neutral-400">FSSAI, BEE, BIS & range checks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Flagged Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">
              {jobStatus ? jobStatus.flagged_items : 200}
            </span>
            <span className="text-xs text-neutral-400">routed to HITL</span>
          </div>
          <p className="text-[10px] text-neutral-400">Low confidence or missing mandatory field</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>Avg Grounded Confidence</span>
            <Sparkles className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-neutral-900">
              {jobStatus ? (jobStatus.avg_confidence * 100).toFixed(1) : "79.0"}%
            </span>
            <span className="text-xs text-neutral-400">score</span>
          </div>
          <p className="text-[10px] text-neutral-400">Cross-checked against 40 Indian datasheets</p>
        </div>

      </div>

      {/* Live Log Console */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Live Enrichment Stream & Lineage Console
          </h3>
          {jobStatus?.current_product && (
            <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Enriching: {jobStatus.current_product}
            </span>
          )}
        </div>

        <div className="h-56 overflow-y-auto bg-neutral-50 p-4 rounded-xl font-mono text-[11px] text-neutral-700 space-y-1.5 border border-neutral-200/70 scrollbar-thin">
          {jobStatus && jobStatus.logs && jobStatus.logs.length > 0 ? (
            jobStatus.logs.map((log: str, idx: number) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-neutral-400 font-bold">›</span>
                <span className={log.includes("completed") ? "text-emerald-700 font-bold" : "text-neutral-700"}>
                  {log}
                </span>
              </div>
            ))
          ) : (
            <div className="text-neutral-400 italic py-8 text-center">
              Batch processing console ready. Click "Run Batch on 200 Products" above to begin.
            </div>
          )}
        </div>

        {jobStatus && jobStatus.status === "completed" && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-emerald-900 font-medium">
                Batch job completed! {jobStatus.processed_items} products enriched. {jobStatus.flagged_items} fields routed to Review Queue.
              </p>
            </div>
            <button
              onClick={onNavigateToQueue}
              className="font-sans text-xs px-3.5 py-1.5 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              Open Review Queue ({jobStatus.flagged_items})
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
