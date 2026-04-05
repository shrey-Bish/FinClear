"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const PENDING_SIGNUP_KEY = "sowsmart_pending_signup"

export default function RecommendationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [router, status])

  useEffect(() => {
    if (status !== "authenticated") return

    const syncAndFetch = async () => {
      if (typeof window !== "undefined") {
        const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { data?: Record<string, any> }
            if (parsed.data) {
              await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile: parsed.data }),
              })
            }
            window.sessionStorage.removeItem(PENDING_SIGNUP_KEY)
          } catch {
            // Ignore malformed temporary onboarding cache.
          }
        }
      }

      const response = await fetch("/api/profile")
      if (!response.ok) return
      const payload = (await response.json()) as { profile: Record<string, any> | null }
      setProfile(payload.profile)
    }

    void syncAndFetch()
  }, [status])

  const profileEntries = useMemo(() => {
    if (!profile) return []
    return Object.entries(profile).filter(([_, value]) => value !== null && value !== "")
  }, [profile])

  if (status === "loading") {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading your account...</div>
  }

  if (status !== "authenticated") return null

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb_0%,_#fffdf9_45%,_#f7fbf7_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[#F3EAE4] bg-white p-8 shadow-[0_25px_80px_rgba(26,26,26,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-script text-3xl text-[#1A1A1A]">Recommendations</h1>
            <p className="mt-2 text-sm text-gray-500">
              Logged in as <span className="font-medium text-gray-700">{session?.user?.email}</span>
            </p>
          </div>
          <button
            onClick={() => void signOut({ callbackUrl: "/login" })}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] p-6">
          <p className="text-sm text-gray-500">This page is ready for your next step: recommendation generation.</p>
          <p className="mt-1 text-sm text-gray-500">We already have the user profile data saved and loaded here.</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {profileEntries.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-gray-100 bg-[#FAFAFA] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-400">{key}</p>
              <p className="mt-1 text-sm font-medium text-gray-700">{String(value)}</p>
            </div>
          ))}
          {profileEntries.length === 0 && (
            <p className="text-sm text-gray-500">No profile answers saved yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
