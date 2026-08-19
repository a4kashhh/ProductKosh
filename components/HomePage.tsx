"use client"

import React, { useState } from "react"
import { HowItWorksPage } from "@/components/HowItWorksPage"
import { ArrowRight, Layers, Search, ShieldCheck, BarChart3, GitBranch, ClipboardList, HelpCircle } from "lucide-react"
import { UserMenu } from "@/components/UserMenu"

interface HomePageProps {
  onEnter: (tab: string) => void
}

const features = [
  {
    icon: Layers,
    tab: "processor",
    label: "Batch Processor",
    headline: "Enrich 200 products at once",
    desc: "Feed minimal inputs — brand + product name. Get fully structured, grounded catalog records automatically.",
    cta: "Run Batch Engine",
    color: "bg-orange-50 border-orange-100",
    iconColor: "text-orange-500",
  },
  {
    icon: Search,
    tab: "catalog",
    label: "Product Catalog",
    headline: "Browse & inspect every record",
    desc: "Search across 200 Indian products. Click any row to inspect grounded specs, confidence scores, and source proof.",
    cta: "Open Catalog",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: ClipboardList,
    tab: "review",
    label: "Review Queue",
    headline: "Human-in-the-loop validation",
    desc: "Accept, edit, or reject AI-generated fields. Every flagged product waits here for your decision.",
    cta: "Go to Queue",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
  },
  {
    icon: BarChart3,
    tab: "metrics",
    label: "Quality Metrics",
    headline: "Live accuracy dashboard",
    desc: "Track confidence scores, validation rates, flagged fields, and category breakdowns in real time.",
    cta: "View Metrics",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    icon: GitBranch,
    tab: "architecture",
    label: "Pipeline Architecture",
    headline: "See how it works under the hood",
    desc: "Visualise the full retrieval → generation → validation → HITL pipeline powering every enrichment.",
    cta: "View Architecture",
    color: "bg-violet-50 border-violet-100",
    iconColor: "text-violet-500",
  },
  {
    icon: ShieldCheck,
    tab: "catalog",
    label: "Indian Standards",
    headline: "FSSAI · BIS · BEE · IBR · PESO",
    desc: "Every product is cross-checked against Indian regulatory standards and priced in INR (₹).",
    cta: "Explore Catalog",
    color: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-500",
  },
]

export function HomePage({ onEnter }: HomePageProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  if (showHelp) {
    return <HowItWorksPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased selection:bg-black selection:text-white">

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-neutral-100 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="w-7 h-7 rounded-lg object-contain"
          />
          <span className="font-semibold text-sm tracking-tight text-neutral-900">
            Product<span className="text-amber-500">कोश</span>
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

          <UserMenu />
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-16 px-6 gap-8">

        {/* Logo + Wordmark as one unit */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="rounded-2xl object-contain drop-shadow-xl"
            style={{ width: 140, height: 140 }}
          />
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="block mx-auto object-contain"
            style={{ height: "90px", filter: "brightness(0)" }}
          />
        </div>

        {/* Description */}
        <p className="text-base text-neutral-500 leading-relaxed max-w-xl text-center">
          Give it a product name and one attribute. It returns a fully structured, 
          validated, commerce-ready catalog record — grounded in real Indian technical datasheets.
        </p>

        {/* Primary CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnter("processor")}
            className="group inline-flex items-center gap-2.5 bg-black text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors px-4 py-3 rounded-full hover:bg-neutral-100"
          >
            How it works
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-8 pt-2 text-xs text-neutral-400 font-medium divide-x divide-neutral-200">
          <span className="pr-8"><span className="text-neutral-900 font-black text-lg">200</span><br />Indian Products</span>
          <span className="px-8"><span className="text-neutral-900 font-black text-lg">20+</span><br />Source Datasheets</span>
          <span className="px-8"><span className="text-neutral-900 font-black text-lg">15+</span><br />UNSPSC Categories</span>
          <span className="pl-8"><span className="text-neutral-900 font-black text-lg">₹</span><br />INR Pricing</span>
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <p className="text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase text-center mb-10">
          What would you like to do?
        </p>

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
                  group text-left p-6 rounded-2xl border transition-all duration-200
                  ${f.color}
                  ${hoveredIdx === idx
                    ? "shadow-lg -translate-y-1 scale-[1.01]"
                    : "shadow-xs hover:shadow-md"}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-white shadow-xs border border-white/80`}>
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase pt-1">
                    {f.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 mb-1.5 leading-snug">
                  {f.headline}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-5">
                  {f.desc}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 group-hover:gap-2.5 transition-all">
                  {f.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )
          })}
        </div>
      </section>



    </div>
  )
}
