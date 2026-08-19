"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react"

export function GoogleLogoIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

export function UserMenu() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={openAuthModal}
        className="font-sans text-[11px] px-3.5 py-1.5 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs"
      >
        <GoogleLogoIcon className="w-3.5 h-3.5 shrink-0" />
        <span>Sign In / Register</span>
      </button>
    )
  }

  const getProviderBadge = (providerId: string) => {
    if (providerId.includes("google")) return "Google"
    if (providerId.includes("apple")) return "Apple"
    if (providerId.includes("password")) return "Email"
    if (providerId.includes("phone")) return "Phone OTP"
    return "Firebase"
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all text-left shadow-2xs"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover border border-neutral-200"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-semibold text-neutral-900 leading-tight">
            {user.name}
          </span>
          <span className="text-[9px] text-neutral-400 leading-tight truncate max-w-[120px]">
            {user.email || user.phoneNumber || user.role}
          </span>
        </div>

        <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Details */}
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="flex items-center gap-2.5 mb-1.5">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {user.email || user.phoneNumber || "Authenticated"}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-medium text-emerald-800">
                {user.role}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[9px] text-neutral-600 font-medium capitalize">
                {getProviderBadge(user.providerId)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-1 space-y-0.5 text-xs">
            <button
              onClick={() => {
                setIsOpen(false)
                openAuthModal()
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Switch Account / Method</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
