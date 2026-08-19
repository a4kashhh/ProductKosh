"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { HomePage } from "@/components/HomePage"
import { AiOrbHeader } from "@/components/ai-orb-header"
import { BatchProcessorView } from "@/components/BatchProcessorView"
import { ProductCatalogView } from "@/components/ProductCatalogView"
import { ReviewQueueView } from "@/components/ReviewQueueView"
import { MetricsDashboardView } from "@/components/MetricsDashboardView"
import { ArchitectureDiagramView } from "@/components/ArchitectureDiagramView"
import { API_BASE_URL } from "@/lib/api-config"

export default function Page() {
  const { isAuthenticated, openAuthModal } = useAuth()
  // "home" = landing page, anything else = dashboard tab
  const [view, setView] = useState<"home" | string>("home")
  const [pendingTab, setPendingTab] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<any>(null)

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/metrics`)
      if (res.ok) setMetrics(await res.json())
    } catch {}
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 3000)
    return () => clearInterval(interval)
  }, [])

  // When user successfully authenticates while waiting to enter a dashboard tab
  useEffect(() => {
    if (isAuthenticated && pendingTab) {
      setView(pendingTab)
      setPendingTab(null)
    }
  }, [isAuthenticated, pendingTab])

  // If user signs out while on a dashboard tab, return to homepage
  useEffect(() => {
    if (!isAuthenticated && view !== "home") {
      setView("home")
    }
  }, [isAuthenticated, view])

  const handleEnterDashboard = (tab: string) => {
    if (isAuthenticated) {
      setView(tab)
    } else {
      setPendingTab(tab)
      openAuthModal()
    }
  }

  const handleExport = (format: string) => {
    window.open(`${API_BASE_URL}/api/export?format=${format}`, "_blank")
  }

  // ── 1. Homepage (Freely accessible with all details) ────────────────────
  if (view === "home") {
    return (
      <HomePage
        onEnter={handleEnterDashboard}
      />
    )
  }

  // ── 2. Dashboard (Gated behind authentication) ──────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans antialiased selection:bg-black selection:text-white">

      <AiOrbHeader
        activeTab={view}
        setActiveTab={(tab) => {
          if (isAuthenticated) {
            setView(tab)
          } else {
            setPendingTab(tab)
            openAuthModal()
          }
        }}
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

      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-500 font-sans">
        © a4kashhh
      </footer>

    </div>
  )
}
