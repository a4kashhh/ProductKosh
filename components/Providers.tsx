"use client"

import React, { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { AuthModal } from "@/components/AuthModal"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  )
}
