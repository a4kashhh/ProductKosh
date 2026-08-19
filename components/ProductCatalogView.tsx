"use client"

import React, { useState, useEffect } from "react"
import { Search, HelpCircle, CheckCircle, AlertTriangle, ShieldCheck, X, FileText, Info, Eye } from "lucide-react"

interface ProductCatalogProps {
  onRefreshMetrics: () => void
}

export function ProductCatalogView({ onRefreshMetrics }: ProductCatalogProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [activeTooltipField, setActiveTooltipField] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = "http://localhost:8000/api/products"
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [categoryFilter, statusFilter])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getConfidenceBadge = (score: number) => {
    const pct = Math.round(score * 100)
    if (score >= 0.85) {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{pct}% Confidence</span>
    } else if (score >= 0.65) {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">{pct}% Confidence</span>
    } else {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">{pct}% Low Conf</span>
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Indian products by name, brand, or SKU (Tata, Amul, Havells, Voltas, L&T)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Categories (200 Products)</option>
            <option value="FMCG">FMCG & Groceries</option>
            <option value="Appliances">Appliances & Electricals</option>
            <option value="Hardware">Hardware & Construction</option>
            <option value="Pumps">Industrial Pumps</option>
            <option value="Valves">Industrial Valves</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Statuses</option>
            <option value="clean">Clean (Validated)</option>
            <option value="needs_review">Needs Review (Flagged)</option>
            <option value="reviewed">Human Reviewed</option>
          </select>
        </div>
      </div>

      {/* Catalog Product Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Specs</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 italic">
                    Loading 200 catalog records...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 italic">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-neutral-900">
                      {product.sku}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-900 max-w-xs truncate">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {product.category_name || product.category}
                    </td>
                    <td className="py-3 px-4 text-neutral-700 font-semibold">
                      {product.brand}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-neutral-800">
                      {Object.keys(product.specifications || {}).length}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getConfidenceBadge(product.overall_confidence)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {product.validation_status === "clean" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Clean
                        </span>
                      )}
                      {product.validation_status === "needs_review" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Needs Review ({product.flagged_fields.length})
                        </span>
                      )}
                      {product.validation_status === "reviewed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
                          <ShieldCheck className="w-3 h-3" /> Reviewed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="font-sans text-[11px] px-3 py-1 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Product Inspector Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900">{selectedProduct.name}</h3>
                  <span className="font-mono text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                    {selectedProduct.sku}
                  </span>
                  {getConfidenceBadge(selectedProduct.overall_confidence)}
                </div>
                <p className="text-xs text-neutral-500">
                  Category: <span className="font-medium text-neutral-800">{selectedProduct.category}</span> • Brand: <span className="font-medium text-neutral-800">{selectedProduct.brand}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-full bg-neutral-200/80 text-neutral-600 hover:bg-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
              
              {/* Left Column: Input Minimal Data */}
              <div className="lg:col-span-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-600" /> Limited Input Data
                  </h4>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">Sparse</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase">Product Name</label>
                    <p className="text-xs text-neutral-900 font-medium mt-0.5">{selectedProduct.name}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase">Input Attributes</label>
                    <div className="mt-1 bg-white p-3 rounded-xl border border-neutral-200 font-mono text-[11px] text-neutral-800 space-y-1">
                      {selectedProduct.input_data?.known_attributes ? (
                        Object.entries(selectedProduct.input_data.known_attributes).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-neutral-500">{k}:</span>
                            <span className="font-bold">{String(v)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-neutral-400 italic">No input attributes.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-[11px] text-neutral-600 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-neutral-700 inline mr-1" />
                  Vector retrieval matched Indian source text chunks to extract grounded specifications.
                </div>
              </div>

              {/* Right Column: Grounded Record */}
              <div className="lg:col-span-8 space-y-5">
                
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Product Description & INR Price</h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">{selectedProduct.description}</p>
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">Estimated Price (INR):</span>
                    <span className="font-bold text-neutral-900 text-sm">
                      ₹{selectedProduct.price_range?.min_price?.toLocaleString('en-IN')} – ₹{selectedProduct.price_range?.max_price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Grounded Specifications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Grounded Specifications</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Click "Why" for proof source</span>
                  </h4>

                  <div className="space-y-2">
                    {Object.entries(selectedProduct.specifications || {}).map(([key, attr]: [string, any]) => (
                      <div key={key} className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900">{key}:</span>
                            <span className="text-xs font-semibold text-neutral-800 font-mono">
                              {String(attr.value)} {attr.unit || ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getConfidenceBadge(attr.confidence_score)}
                            <button
                              onClick={() => setActiveTooltipField(activeTooltipField === key ? null : key)}
                              className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-medium transition-colors flex items-center gap-1"
                            >
                              <HelpCircle className="w-3 h-3" /> Why?
                            </button>
                          </div>
                        </div>

                        {/* Explainability Popover */}
                        {activeTooltipField === key && (
                          <div className="mt-2 p-3 bg-white rounded-xl border border-neutral-300 text-[11px] space-y-1.5 shadow-sm">
                            <div className="flex items-center justify-between text-neutral-500 font-mono text-[10px] border-b border-neutral-100 pb-1">
                              <span>Source: {attr.source_chunk_id || "RETRIEVED_CHUNK"}</span>
                              <span>Doc: {attr.source_doc_name || "Datasheet"}</span>
                            </div>
                            {attr.source_excerpt && (
                              <div className="bg-neutral-50 p-2 rounded text-neutral-800 italic font-mono text-[10px] border border-neutral-200">
                                "{attr.source_excerpt}"
                              </div>
                            )}
                            <p className="text-neutral-700">
                              <strong className="text-black">Reasoning:</strong> {attr.reasoning}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indian Compliance Standards */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Indian Compliance Standards & Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.compliance?.map((c: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white text-neutral-800 border border-neutral-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {c.standard}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
