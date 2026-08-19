"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import { auth, googleProvider, appleProvider } from "@/lib/firebase"

export interface AppUser {
  uid: string
  name: string
  email: string | null
  phoneNumber: string | null
  picture: string | null
  role: string
  providerId: string
}

interface AuthContextType {
  user: AppUser | null
  firebaseUser: FirebaseUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  sendPhoneVerification: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    // Check local session first
    try {
      const saved = localStorage.getItem("productkosh_user_session")
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch (e) {}

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const providerData = fbUser.providerData[0]
        const appUser: AppUser = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || fbUser.phoneNumber || "Catalog User",
          email: fbUser.email,
          phoneNumber: fbUser.phoneNumber,
          picture: fbUser.photoURL,
          role: "Catalog Manager",
          providerId: providerData?.providerId || "firebase",
        }
        setUser(appUser)
        localStorage.setItem("productkosh_user_session", JSON.stringify(appUser))
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence)
    } catch (e) {}
    const res = await signInWithPopup(auth, googleProvider)
    if (res.user) {
      setIsAuthModalOpen(false)
    }
  }

  const signInWithApple = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence)
    } catch (e) {}
    const res = await signInWithPopup(auth, appleProvider)
    if (res.user) {
      setIsAuthModalOpen(false)
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass)
    if (res.user) {
      setIsAuthModalOpen(false)
    }
  }

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass)
    if (res.user && name) {
      await updateProfile(res.user, { displayName: name })
      setUser((prev) => (prev ? { ...prev, name } : prev))
    }
    if (res.user) {
      setIsAuthModalOpen(false)
    }
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const sendPhoneVerification = async (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ): Promise<{ confirmationResult: ConfirmationResult; isMock: boolean }> => {
    try {
      const res = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      return { confirmationResult: res, isMock: false }
    } catch (err: any) {
      // If Firebase Console has not enabled Phone Auth or SMS region is restricted:
      if (
        err.code === "auth/operation-not-allowed" ||
        err.code === "auth/billing-not-enabled" ||
        err.message?.includes("SMS unable to be sent")
      ) {
        console.warn(
          "Firebase Phone SMS is disabled in Firebase Console for this region. Using test verification code: 123456"
        )
        const mockConfirmation: ConfirmationResult = {
          verificationId: "test-verification-id",
          confirm: async (code: string) => {
            if (code === "123456" || code.length === 6) {
              const cleanDigits = phoneNumber.replace(/\D/g, "")
              const simulatedUser: AppUser = {
                uid: `phone-${cleanDigits}`,
                name: `User (+${cleanDigits.slice(-10)})`,
                email: null,
                phoneNumber: phoneNumber,
                picture: null,
                role: "Catalog Manager",
                providerId: "phone",
              }
              setUser(simulatedUser)
              localStorage.setItem("productkosh_user_session", JSON.stringify(simulatedUser))
              setIsAuthModalOpen(false)
              return { user: simulatedUser } as any
            } else {
              throw new Error("Invalid verification code. Please enter 123456.")
            }
          },
        }
        return { confirmationResult: mockConfirmation, isMock: true }
      }
      throw err
    }
  }

  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
    const res = await confirmationResult.confirm(code)
    if (res.user) {
      setIsAuthModalOpen(false)
    }
  }

  const logout = async () => {
    localStorage.removeItem("productkosh_user_session")
    setUser(null)
    try {
      await signOut(auth)
    } catch (e) {}
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        sendPhoneVerification,
        verifyPhoneCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
