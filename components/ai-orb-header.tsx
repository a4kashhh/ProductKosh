"use client"

import React from "react"
import { Cpu, Database, AlertTriangle, FileSpreadsheet, BarChart3, Layers, Download, Home } from "lucide-react"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            {/* Home button */}
            {onHome && (
              <button
                onClick={onHome}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                title="Back to Home"
              >
                <Home className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            )}
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-9 h-9 rounded-xl object-contain drop-shadow flex-shrink-0"
            />
            <div>
              <img
                src="/wordmark.png"
                alt="productkosh"
                className="w-auto object-contain"
                style={{ height: "32px", filter: "brightness(0)" }}
              />
            </div>
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onExport("json")}
              className="font-sans text-[11px] px-3 py-1 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Export JSON
            </button>
            <button
              onClick={() => onExport("csv")}
              className="font-sans text-[11px] px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-1">
          {["processor", "catalog", "review", "metrics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-sans text-[10px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap capitalize ${
                activeTab === tab ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>
    </header>
  )
}
