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
  ShieldCheck
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
      let msg = err.message || "Failed to sign in with Google."
      if (err.code === "auth/operation-not-allowed") {
        msg = "Google Sign-In is not enabled in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method > Google > Enable."
      } else if (err.code === "auth/unauthorized-domain") {
        msg = "Domain unauthorized. Add 'localhost' in Firebase Console > Authentication > Settings > Authorized domains."
      } else if (err.code === "auth/popup-closed-by-user") {
        msg = "Sign-in window was closed. Please try again."
      } else if (err.code === "auth/popup-blocked") {
        msg = "Popup was blocked by your browser. Please allow popups for localhost."
      }
      setErrorMessage(msg)
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
      let msg = err.message || "Failed to sign in with Apple."
      if (err.code === "auth/operation-not-allowed") {
        msg = "Apple Sign-In is not enabled in Firebase Console (requires Apple Developer Service ID and Key)."
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
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between font-sans antialiased selection:bg-black selection:text-white">
      {/* Invisible container for phone reCAPTCHA */}
      <div id="gate-recaptcha-container"></div>

      {/* Top Header */}
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

        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Enterprise Portal</span>
        </div>
      </header>

      {/* Center Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-md w-full mx-auto">
        
        {/* Brand Logo & Wordmark Unit */}
        <div className="flex flex-col items-center gap-2.5 mb-8 text-center">
          <img
            src="/logo.png"
            alt="ProductKOSH Logo"
            className="w-16 h-16 rounded-2xl object-contain drop-shadow-md"
          />
          <img
            src="/wordmark.png"
            alt="productkosh"
            className="block mx-auto object-contain"
            style={{ height: "48px", filter: "brightness(0)" }}
          />
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            AI Product Intelligence & Catalog Governance for Indian Industrial Commerce
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm">
          
          {/* Pills Selector */}
          <div className="flex bg-neutral-100/90 p-1 rounded-full border border-neutral-200/60 mb-5 gap-1">
            <button
              onClick={() => {
                setAuthMethod("social")
                resetMessages()
              }}
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
              onClick={() => {
                setAuthMethod("email")
                resetMessages()
              }}
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
              onClick={() => {
                setAuthMethod("phone")
                resetMessages()
              }}
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

          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px]">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2.5 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px]">{successMessage}</div>
            </div>
          )}

          {/* ── METHOD 1: Social Providers ───────────────────────────────── */}
          {authMethod === "social" && (
            <div className="space-y-2.5">
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
            <form onSubmit={handleEmailSubmit} className="space-y-3">
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
            <div className="space-y-3">
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

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-500 font-sans">
        © a4kashhh
      </footer>

    </div>
  )
}
