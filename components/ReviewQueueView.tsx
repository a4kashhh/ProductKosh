"use client"

import React, { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Edit3, XCircle, CheckCheck, Loader2, UserCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL } from "@/lib/api-config"

interface ReviewQueueProps {
  onRefreshMetrics: () => void
}

export function ReviewQueueView({ onRefreshMetrics }: ReviewQueueProps) {
  const { user } = useAuth()
  const [flaggedProducts, setFlaggedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedValue, setEditedValue] = useState("")
  const [editedUnit, setEditedUnit] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchFlaggedProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/products?status=needs_review`)
      if (res.ok) {
        const data = await res.json()
        setFlaggedProducts(data)
        if (data.length > 0 && !selectedProduct) {
          setSelectedProduct(data[0])
        }
      }
    } catch (err) {
      console.error("Error fetching flagged products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlaggedProducts()
  }, [])

  const handleReviewAction = async (product_id: string, field_name: string, action: "accept" | "edit" | "reject") => {
    setIsSubmitting(true)
    try {
      const reviewerTag = user ? `${user.name} (${user.role})` : "Human reviewer"
      const payload = {
        field_name: field_name,
        action: action,
        edited_value: action === "edit" ? editedValue : null,
        edited_unit: action === "edit" ? editedUnit : null,
        comment: reviewComment || `${reviewerTag} ${action}ed field.`
      }

      const res = await fetch(`${API_BASE_URL}/api/products/${product_id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const updated = await res.json()
        setSelectedProduct(updated)
        fetchFlaggedProducts()
        onRefreshMetrics()
        setEditingField(null)
        setReviewComment("")
      }
    } catch (err) {
      console.error("Error submitting review action:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkAcceptAll = async () => {
    setIsSubmitting(true)
    try {
      for (const prod of flaggedProducts) {
        for (const field of prod.flagged_fields) {
          await fetch(`${API_BASE_URL}/api/products/${prod.id}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              field_name: field,
              action: "accept",
              comment: "Bulk accepted during batch triage."
            })
          })
        }
      }
      fetchFlaggedProducts()
      onRefreshMetrics()
    } catch (err) {
      console.error("Error running bulk accept:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" /> Human-in-the-Loop Review Queue
          </div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Flagged Products & Specs Requiring Triage
          </h2>
          <p className="text-xs text-neutral-500">
            Reviewers inspect grounded source evidence and Accept, Edit inline, or Reject flagged fields.
          </p>
          {user && (
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-neutral-600 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auditing as: <strong className="text-black">{user.name}</strong> ({user.role})</span>
            </div>
          )}
        </div>

        {flaggedProducts.length > 0 && (
          <button
            onClick={handleBulkAcceptAll}
            disabled={isSubmitting}
            className="font-sans text-xs px-4 py-2 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
            Bulk Accept All ({flaggedProducts.length})
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400 italic bg-white rounded-2xl border border-neutral-200">
          Loading flagged items...
        </div>
      ) : flaggedProducts.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-neutral-200">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-900">Review Queue Clear!</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            All enriched product records have been validated cleanly with high confidence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Flagged Items List */}
          <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-neutral-200 space-y-2.5 max-h-[75vh] overflow-y-auto scrollbar-thin">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
              Flagged Products ({flaggedProducts.length})
            </h3>

            {flaggedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedProduct?.id === prod.id
                    ? "bg-neutral-100 border-black shadow-xs"
                    : "bg-neutral-50/60 border-neutral-200 hover:bg-neutral-100/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-800 font-bold">{prod.sku}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {prod.flagged_fields.length} flagged
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 mt-1 truncate">{prod.name}</h4>
              </div>
            ))}
          </div>

          {/* Detailed Reviewer Action Panel */}
          {selectedProduct && (
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200 space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="font-mono text-xs text-neutral-500">{selectedProduct.sku}</span>
                  <h3 className="text-base font-bold text-neutral-900 mt-0.5">{selectedProduct.name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Needs Review
                </span>
              </div>

              {/* Flagged Fields Action Cards */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Flagged Specification Fields
                </h4>

                {selectedProduct.flagged_fields.map((fieldName: string) => {
                  const attr = selectedProduct.specifications[fieldName] || {
                    value: "Unspecified",
                    unit: "",
                    confidence_score: 0.5,
                    reasoning: "Field missing or flagged during validation."
                  }

                  return (
                    <div key={fieldName} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-neutral-900">{fieldName}</h5>
                          <p className="text-xs font-mono text-neutral-700 mt-0.5">
                            Value: <strong className="text-black">{String(attr.value)}</strong> {attr.unit || ""}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {Math.round(attr.confidence_score * 100)}% Confidence
                        </span>
                      </div>

                      {/* Source Chunk Grounding Quote */}
                      {attr.source_excerpt && (
                        <div className="bg-white p-3 rounded-lg border border-neutral-200 text-[10px] text-neutral-700 italic font-mono">
                          <strong className="text-black not-italic">Grounded Quote ({attr.source_doc_name}):</strong> "{attr.source_excerpt}"
                        </div>
                      )}

                      <p className="text-xs text-neutral-600">
                        <strong className="text-neutral-900">AI Reasoning:</strong> {attr.reasoning}
                      </p>

                      {/* Action Controls */}
                      {editingField === fieldName ? (
                        <div className="p-3.5 bg-white rounded-xl border border-neutral-300 space-y-3">
                          <h6 className="text-xs font-bold text-neutral-900">Edit Field Value & Unit</h6>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="New Value"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              className="bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs text-neutral-900"
                            />
                            <input
                              type="text"
                              placeholder="New Unit"
                              value={editedUnit}
                              onChange={(e) => setEditedUnit(e.target.value)}
                              className="bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs text-neutral-900"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingField(null)}
                              className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReviewAction(selectedProduct.id, fieldName, "edit")}
                              disabled={isSubmitting}
                              className="px-4 py-1.5 rounded-full bg-black text-white font-semibold text-xs"
                            >
                              Save Corrected Value
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/80">
                          <button
                            onClick={() => handleReviewAction(selectedProduct.id, fieldName, "reject")}
                            disabled={isSubmitting}
                            className="font-sans text-xs px-3 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium transition-colors flex items-center gap-1 border border-rose-200"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>

                          <button
                            onClick={() => {
                              setEditingField(fieldName)
                              setEditedValue(String(attr.value))
                              setEditedUnit(attr.unit || "")
                            }}
                            className="font-sans text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 font-medium transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => handleReviewAction(selectedProduct.id, fieldName, "accept")}
                            disabled={isSubmitting}
                            className="font-sans text-xs px-4 py-1 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </button>
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  )
}
