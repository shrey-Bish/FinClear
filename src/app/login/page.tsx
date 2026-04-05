"use client"

import { FormEvent, Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

const DEFAULT_CALLBACK_URL = "/recommendations"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_CALLBACK_URL

  // Check if already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace(callbackUrl)
      }
    }
    checkUser()
  }, [callbackUrl, router, supabase.auth])

  // Check for error from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "auth_callback_error") {
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const handleEmailLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter a valid email address.")
      return
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsSubmitting(true)

    if (isSignUp) {
      // Sign up
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}`,
        },
      })

      setIsSubmitting(false)

      if (error) {
        setError(error.message)
        return
      }

      setError(null)
      alert("Check your email for a confirmation link!")
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      setIsSubmitting(false)

      if (error) {
        if (error.message.includes("Invalid login")) {
          setError("Invalid email or password.")
        } else {
          setError(error.message)
        }
        return
      }

      router.push(callbackUrl)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:py-16">
      {/* Header */}
      <header className="mx-auto max-w-2xl mb-8">
        <motion.div 
          className="font-script text-2xl text-gray-800 text-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/")}
        >
          SowSmart
        </motion.div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-medium text-gray-800 text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isSignUp ? "Create your account" : "Welcome back"}
        </motion.h1>
        <motion.p 
          className="text-gray-500 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {isSignUp ? "Sign up to get started" : "Sign in to your account"}
        </motion.p>

        <motion.form 
          onSubmit={handleEmailLogin} 
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0080] focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0080] focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <motion.p 
              className="text-center text-sm text-red-600 bg-red-50 py-2 px-4 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF0080] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#E60073] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25"
          >
            {isSubmitting ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-[#FF0080] hover:text-[#E60073] font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </button>
        </motion.form>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="font-script text-2xl text-gray-800 mb-4">SowSmart</div>
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
