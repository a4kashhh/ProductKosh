"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  X,
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
  KeyRound
} from "lucide-react"

export function GoogleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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

export function AppleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.94-1 .04-2.15.65-2.82 1.43-.59.67-1.11 1.76-.97 2.81 1.11.09 2.19-.52 2.83-1.3" />
    </svg>
  )
}

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
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

  // Reset form errors on method switch
  useEffect(() => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }, [authMethod, emailMode])

  if (!isAuthModalOpen) return null

  // ── Handle Google ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      console.error(err)
      let msg = err.message || "Failed to sign in with Google."
      if (err.code === "auth/operation-not-allowed") {
        msg = "Google Sign-In needs to be enabled in Firebase Console > Authentication > Sign-in method."
      } else if (err.code === "auth/popup-closed-by-user") {
        msg = "Sign-in window was closed."
      }
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Apple ───────────────────────────────────────────────────────────
  const handleAppleSignIn = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      await signInWithApple()
    } catch (err: any) {
      console.error(err)
      let msg = err.message || "Failed to sign in with Apple."
      if (err.code === "auth/operation-not-allowed") {
        msg = "Apple Sign-In is not enabled in Firebase Console (requires Apple Developer Service ID)."
      } else if (err.code === "auth/popup-closed-by-user") {
        msg = "Apple sign-in window was closed."
      }
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handle Email / Password ────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

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
        msg = "Invalid email or password. Please try again."
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
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "modal-recaptcha-container", {
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
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g, "")}`
      if (fullPhone.length < 10) {
        throw new Error("Please enter a valid 10-digit phone number.")
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
      setErrorMessage("Invalid verification code. Please check and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Invisible container for phone reCAPTCHA */}
      <div id="modal-recaptcha-container"></div>

      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutral-100 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ProductKOSH Logo"
              className="w-10 h-10 rounded-xl object-contain drop-shadow"
            />
            <div>
              <h2 className="font-bold text-base text-neutral-900 tracking-tight flex items-center gap-1.5">
                Sign In to Product<span className="text-amber-500">कोश</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Indian Product Intelligence & Governance
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          
          {/* Method Selector Pills */}
          <div className="flex bg-neutral-100/90 p-1 rounded-full border border-neutral-200/60 gap-1">
            <button
              onClick={() => setAuthMethod("social")}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "social"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <GoogleIcon className="w-3 h-3" />
              <span>Social</span>
            </button>

            <button
              onClick={() => setAuthMethod("email")}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "email"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>

            <button
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                authMethod === "phone"
                  ? "bg-black text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Phone</span>
            </button>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px]">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px]">{successMessage}</div>
            </div>
          )}

          {/* ── METHOD 1: Social Providers ───────────────────────────────── */}
          {authMethod === "social" && (
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 font-semibold text-xs transition-all shadow-2xs group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />
                ) : (
                  <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-2xs group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <AppleIcon className="w-3.5 h-3.5 shrink-0 text-white" />
                )}
                <span>Continue with Apple</span>
              </button>
            </div>
          )}

          {/* ── METHOD 2: Email & Password ─────────────────────────────────── */}
          {authMethod === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
              {emailMode === "signup" && (
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
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
                        onClick={() => setEmailMode("forgot")}
                        className="text-[10px] text-neutral-500 hover:text-black font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-8 py-2 text-xs rounded-full border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
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
                className="w-full py-2.5 px-4 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 mt-2"
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

              <div className="pt-1.5 text-center text-xs text-neutral-500">
                {emailMode === "signin" ? (
                  <span>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setEmailMode("signup")}
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
                      onClick={() => setEmailMode("signin")}
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
            <div className="space-y-3 pt-1">
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
                        className="px-3 py-2 text-xs rounded-full border border-neutral-200 bg-neutral-50 font-medium text-neutral-800"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+65">🇸🇬 +65</option>
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
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
                      <KeyRound className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs tracking-widest font-mono font-semibold rounded-full border border-neutral-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black bg-neutral-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
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
                    className="w-full text-center text-xs text-neutral-500 hover:text-black py-0.5"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
