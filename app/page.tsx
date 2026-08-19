"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginGate } from "@/components/LoginGate"
import { HomePage } from "@/components/HomePage"
import { AiOrbHeader } from "@/components/ai-orb-header"
import { BatchProcessorView } from "@/components/BatchProcessorView"
import { ProductCatalogView } from "@/components/ProductCatalogView"
import { ReviewQueueView } from "@/components/ReviewQueueView"
import { MetricsDashboardView } from "@/components/MetricsDashboardView"
import { ArchitectureDiagramView } from "@/components/ArchitectureDiagramView"
import { Loader2 } from "lucide-react"

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth()
  // "home" = landing page, anything else = dashboard tab
  const [view, setView] = useState<"home" | string>("home")
  const [metrics, setMetrics] = useState<any>(null)

  const fetchMetrics = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/metrics")
      if (res.ok) setMetrics(await res.json())
    } catch {}
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics()
      const interval = setInterval(fetchMetrics, 3000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleExport = (format: string) => {
    window.open(`http://localhost:8000/api/export?format=${format}`, "_blank")
  }

  // ── 1. Loading Splash State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-4">
        <img
          src="/logo.png"
          alt="ProductKOSH Logo"
          className="w-14 h-14 rounded-2xl object-contain drop-shadow-xl animate-pulse"
        />
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Verifying session...</span>
        </div>
      </div>
    )
  }

  // ── 2. Unauthenticated Gate ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginGate />
  }

  // ── 3. Authenticated Homepage ───────────────────────────────────────────
  if (view === "home") {
    return (
      <HomePage
        onEnter={(tab) => setView(tab)}
      />
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans antialiased selection:bg-black selection:text-white">

      <AiOrbHeader
        activeTab={view}
        setActiveTab={setView}
        metrics={metrics}
        onExport={handleExport}
        onHome={() => setView("home")}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "processor" && (
          <BatchProcessorView
            onBatchComplete={fetchMetrics}
            onNavigateToQueue={() => setView("review")}
          />
        )}
        {view === "catalog" && (
          <ProductCatalogView onRefreshMetrics={fetchMetrics} />
        )}
        {view === "review" && (
          <ReviewQueueView onRefreshMetrics={fetchMetrics} />
        )}
        {view === "metrics" && (
          <MetricsDashboardView metrics={metrics} />
        )}

      </main>

      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-400 font-sans">
        Productकोश — AI Product Intelligence for Indian Industrial Commerce
      </footer>

    </div>
  )
}
