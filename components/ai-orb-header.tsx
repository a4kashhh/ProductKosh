"use client"

import React from "react"
import { Cpu, Database, AlertTriangle, FileSpreadsheet, BarChart3, Layers, Download, Home } from "lucide-react"
import { UserMenu } from "@/components/UserMenu"

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  metrics: any
  onExport: (format: string) => void
  onHome?: () => void
}

export function AiOrbHeader({ activeTab, setActiveTab, metrics, onExport, onHome }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onHome && (
              <button
                onClick={onHome}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                title="Back to Home"
              >
                <Home className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            )}
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain drop-shadow shrink-0"
            />
            <img
              src="/wordmark.png"
              alt="ProductKosh"
              className="h-5 sm:h-6 object-contain"
              style={{ filter: "brightness(0)" }}
            />
          </div>

          {/* Center Navigation Pills - Matching Zip Design */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-full border border-neutral-200/60">
            <button
              onClick={() => setActiveTab("processor")}
              className={`font-sans text-[11px] px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === "processor"
                  ? "bg-black text-white font-medium shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Batch Processor
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`font-sans text-[11px] px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === "catalog"
                  ? "bg-black text-white font-medium shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Product Catalog
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`font-sans text-[11px] px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === "review"
                  ? "bg-black text-white font-medium shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Review Queue
              {metrics?.flagged_count > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500 text-black">
                  {metrics.flagged_count}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("metrics")}
              className={`font-sans text-[11px] px-3.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === "metrics"
                  ? "bg-black text-white font-medium shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Metrics
            </button>

          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => onExport("json")}
              className="font-sans text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> <span className="hidden xs:inline">Export</span> JSON
            </button>
            <button
              onClick={() => onExport("csv")}
              className="font-sans text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> CSV
            </button>

            <div className="h-4 w-px bg-neutral-200 mx-0.5" />

            <UserMenu />
          </div>

        </div>

        {/* Mobile Navigation Row (Horizontal Scroll) */}
        <div className="flex md:hidden items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: "processor", label: "Batch Processor" },
            { id: "catalog", label: "Catalog" },
            { id: "review", label: "Review Queue", count: metrics?.flagged_count },
            { id: "metrics", label: "Metrics" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-sans text-[11px] px-3 py-1 rounded-full transition-colors whitespace-nowrap flex items-center gap-1 shrink-0 ${
                activeTab === tab.id
                  ? "bg-black text-white font-semibold shadow-2xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-500 text-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>
    </header>
  )
}
