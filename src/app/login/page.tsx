"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { ChevronDown, KeyRound } from "lucide-react"

const PENDING_SIGNUP_KEY = "sowsmart_pending_signup"

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pendingData, setPendingData] = useState<Record<string, any> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"email" | "password">("email")

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/recommendations")
    }
  }, [router, status])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const incomingEmail = params.get("email")
    if (incomingEmail) {
      queueMicrotask(() => {
        setEmail((current) => current || incomingEmail)
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as { email?: string; data?: Record<string, any> }
      queueMicrotask(() => {
        if (parsed.email && !email) {
          setEmail(parsed.email)
        }
        if (parsed.data) {
          setPendingData(parsed.data)
        }
      })
    } catch {
      // Ignore parse errors for stale session data.
    }
  }, [email])

  const pendingSummary = useMemo(() => {
    if (!pendingData) return []
    return Object.entries(pendingData)
      .filter(([key, value]) => key !== "voiceMode" && value !== null && value !== "")
      .slice(0, 5)
  }, [pendingData])

  const handleCredentialsLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter a valid email address.")
      return
    }

    if (step === "email") {
      setEmail(normalizedEmail)
      setStep("password")
      return
    }

    if (!password) {
      setError("Enter your password.")
      return
    }

    setIsSubmitting(true)

    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })

    setIsSubmitting(false)

    if (!result?.ok) {
      setError("Unable to login. Check your credentials and try again.")
      return
    }

    router.push("/recommendations")
  }

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/recommendations" })
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] px-4 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <h1 className="font-script text-[64px] leading-none text-[#4A4A4A]">Lemonade</h1>

        <form onSubmit={handleCredentialsLogin} className="mt-14 w-full max-w-xl space-y-4">
          <div className="overflow-hidden rounded-xl border border-[#CFCFCF] bg-white">
            <div className="flex items-center gap-3 px-6 py-5">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="EMAIL ADDRESS"
                autoComplete="email"
                className="w-full bg-transparent text-[36px] uppercase tracking-wide text-[#6D6D6D] placeholder:text-[#B7B7B7] focus:outline-none max-sm:text-[24px]"
                required
              />
              <div className="flex items-center gap-1 rounded-lg bg-[#F4F4F4] px-2 py-1 text-[#555555]">
                <KeyRound className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {step === "password" && (
            <div className="overflow-hidden rounded-xl border border-[#CFCFCF] bg-white">
              <div className="px-6 py-4">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="PASSWORD"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-xl uppercase tracking-[0.06em] text-[#6D6D6D] placeholder:text-[#B7B7B7] focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#D5D5D8] px-6 py-5 text-4xl font-semibold tracking-[0.03em] text-[#F8F8F8] transition-colors hover:bg-[#C8C8CC] disabled:opacity-70 max-sm:text-3xl"
          >
            {isSubmitting ? "LOGGING IN" : "LOG IN"}
          </button>

          {step === "password" && (
            <button
              type="button"
              onClick={() => {
                setStep("email")
                setPassword("")
                setError(null)
              }}
              className="w-full text-center text-sm text-[#6B6B6B] underline-offset-2 hover:underline"
            >
              Edit email
            </button>
          )}

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          {pendingData && (
            <div className="rounded-xl border border-[#D7D7D7] bg-[#F6F6F6] px-4 py-3 text-sm text-[#666]">
              We found saved signup answers and will apply them after login.
              {pendingSummary.length > 0 && (
                <p className="mt-1 text-xs text-[#7B7B7B]">{pendingSummary.map(([key]) => key).join(" • ")}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-xl border border-[#CFCFCF] bg-white px-4 py-3 text-sm font-medium text-[#5A5A5A] hover:bg-[#F8F8F8]"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-center text-sm text-[#6B6B6B] underline-offset-2 hover:underline"
          >
            Back to home
          </button>
        </form>
      </div>
    </div>
  )
}
