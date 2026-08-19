"use client"

import React, { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { GoogleIcon, AppleIcon } from "@/components/AuthModal"
import {
  Mail,
  Phone,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Layers,
  Database,
  Search,
  CheckCircle
} from "lucide-react"

export function LoginGate() {
  const {
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    sendPhoneVerification,
    verifyPhoneCode,
  } = useAuth()

  // Tabs: 'social' | 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<"social" | "email" | "phone">("social")
  const [emailMode, setEmailMode] = useState<"signin" | "signup" | "forgot">("signin")

  // Email states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Phone states
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [otpSent, setOtpSent] = useState(false)

  // Status & loading
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  const resetMessages = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  // ── Handle Google ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    resetMessages()
    try {
      await signInWithGoogle()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Failed to sign in with Google.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Apple ───────────────────────────────────────────────────────────
  const handleAppleSignIn = async () => {
    setIsLoading(true)
    resetMessages()
    try {
      await signInWithApple()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Failed to sign in with Apple.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Email / Password ────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    resetMessages()

    try {
      if (emailMode === "signin") {
        await signInWithEmail(email, password)
      } else if (emailMode === "signup") {
        if (!displayName.trim()) {
          throw new Error("Please enter your name.")
        }
        await signUpWithEmail(email, password, displayName)
      } else if (emailMode === "forgot") {
        await sendPasswordReset(email)
        setSuccessMessage("Password reset email sent. Please check your inbox.")
      }
    } catch (err: any) {
      console.error(err)
      let msg = err.message || "Authentication error."
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. Please check and try again."
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists."
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters."
      }
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Phone / OTP ─────────────────────────────────────────────────────
  const initRecaptcha = () => {
    if (!recaptchaVerifierRef.current && typeof window !== "undefined") {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "gate-recaptcha-container", {
          size: "invisible",
          callback: () => {},
        })
      } catch (e) {
        console.error("Recaptcha init error", e)
      }
    }
  }

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    resetMessages()

    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g, "")}`
      if (fullPhone.length < 10) {
        throw new Error("Please enter a valid 10-digit mobile number.")
      }

      initRecaptcha()
      if (!recaptchaVerifierRef.current) {
        throw new Error("reCAPTCHA failed to initialize.")
      }

      const { confirmationResult: conf, isMock } = await sendPhoneVerification(
        fullPhone,
        recaptchaVerifierRef.current
      )
      setConfirmationResult(conf)
      setOtpSent(true)
      if (isMock) {
        setSuccessMessage("Test mode active (SMS restricted in console). Enter test OTP: 123456")
      } else {
        setSuccessMessage(`OTP sent to ${fullPhone}. Enter the 6-digit code below.`)
      }
    } catch (err: any) {
      console.error(err)
      try {
        if (recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current.clear()
          recaptchaVerifierRef.current = null
        }
      } catch (clearErr) {}

      let msg = err.message || "Failed to send verification code."
      if (err.code === "auth/invalid-phone-number") {
        msg = "Invalid phone number format. Please enter a valid 10-digit mobile number."
      }
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmationResult) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await verifyPhoneCode(confirmationResult, otpCode)
    } catch (err: any) {
      console.error(err)
      setErrorMessage("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Invisible container for phone reCAPTCHA */}
      <div id="gate-recaptcha-container"></div>

      {/* Decorative gradient orbs in background */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-16 h-16 rounded-2xl object-contain drop-shadow-2xl ring-1 ring-white/10"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            Product<span className="text-amber-400">कोश</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            AI Product Intelligence & Catalog Governance for Indian Industrial Commerce
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200/80">
          
          <div className="text-center pb-5 border-b border-neutral-100 mb-5">
            <h2 className="text-lg font-bold text-neutral-900">
              Sign In to Access Platform
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Authentication required to access the catalog and governance engine.
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60 mb-5 gap-1">
            <button
              onClick={() => {
                setAuthMethod("social")
                resetMessages()
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "social"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Google / Apple</span>
            </button>

            <button
              onClick={() => {
                setAuthMethod("email")
                resetMessages()
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "email"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              onClick={() => {
                setAuthMethod("phone")
                resetMessages()
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "phone"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* ── METHOD 1: Social Providers ───────────────────────────────── */}
          {authMethod === "social" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 font-semibold text-sm transition-all shadow-2xs group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                ) : (
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-semibold text-sm transition-all shadow-2xs group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <AppleIcon className="w-4 h-4 shrink-0 text-white" />
                )}
                <span>Continue with Apple</span>
              </button>
            </div>
          )}

          {/* ── METHOD 2: Email & Password ─────────────────────────────────── */}
          {authMethod === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {emailMode === "signup" && (
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {emailMode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Password
                    </label>
                    {emailMode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailMode("forgot")
                          resetMessages()
                        }}
                        className="text-[10px] text-neutral-500 hover:text-black font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {emailMode === "signin"
                    ? "Sign In with Email"
                    : emailMode === "signup"
                    ? "Create Account"
                    : "Send Password Reset Link"}
                </span>
              </button>

              <div className="pt-2 text-center text-xs text-neutral-500">
                {emailMode === "signin" ? (
                  <span>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode("signup")
                        resetMessages()
                      }}
                      className="font-semibold text-black hover:underline"
                    >
                      Sign up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode("signin")
                        resetMessages()
                      }}
                      className="font-semibold text-black hover:underline"
                    >
                      Sign in
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* ── METHOD 3: Phone Number & SMS OTP ───────────────────────────── */}
          {authMethod === "phone" && (
            <div className="space-y-3.5">
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50 font-medium text-neutral-800"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+65">🇸🇬 +65</option>
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5" />
                    )}
                    <span>Send SMS Verification Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono font-semibold rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Verify & Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtpCode("")
                    }}
                    className="w-full text-center text-xs text-neutral-500 hover:text-black py-1"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Features Preview Strip */}
        <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-neutral-400">
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>200+ Products</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>BIS/FSSAI Compliance</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Grounded Specs</span>
          </div>
        </div>

      </div>
    </div>
  )
}
