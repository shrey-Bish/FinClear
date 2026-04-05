"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ArrowUp, AudioLines, CirclePlus, Loader2, LogOut, Sparkles, Volume2 } from "lucide-react"

import { prepareVoiceText, speakSowSmartText, stopSowSmartVoice } from "../../lib/voice"
import { readStorage } from "../../lib/storage"

const PENDING_SIGNUP_KEY = "sowsmart_pending_signup"
const USER_DATA_KEY = "sowsmart_user_data"

type RecommendationPayload = {
  recommendationTitle: string
  recommendationSummary: string
  reason: string
  policyExplanation: string
  peerChoices: string
  sectionConfidence: {
    recommendation: number
    reason: number
    policy: number
    peerChoices: number
  }
  sourceTitles: string[]
  provider: "gemini" | "fallback"
}

type ChatTurn = {
  role: "user" | "assistant"
  message: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function RecommendationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Record<string, any> | null>(null)
  const [recommendation, setRecommendation] = useState<RecommendationPayload | null>(null)
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([])
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=%2Frecommendations")
    }
  }, [router, status])

  useEffect(() => {
    if (status !== "authenticated") return

    const syncAndFetch = async () => {
      const readFallbackProfile = () => {
        if (typeof window === "undefined") return null

        const storedUserData = readStorage<Record<string, any> | null>(USER_DATA_KEY, null)
        if (storedUserData && Object.keys(storedUserData).length > 0) {
          return storedUserData
        }

        const pending = window.sessionStorage.getItem(PENDING_SIGNUP_KEY)
        if (!pending) return null

        try {
          const parsed = JSON.parse(pending) as { data?: Record<string, any> }
          return parsed.data && Object.keys(parsed.data).length > 0 ? parsed.data : null
        } catch {
          return null
        }
      }

      if (typeof window !== "undefined") {
        const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { data?: Record<string, any> }
            if (parsed.data) {
              const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile: parsed.data }),
              })
              if (!response.ok) {
                setProfile(parsed.data)
              }
            }
            window.sessionStorage.removeItem(PENDING_SIGNUP_KEY)
          } catch {
            const fallbackProfile = readFallbackProfile()
            if (fallbackProfile) {
              setProfile(fallbackProfile)
            }
            // Ignore malformed temporary onboarding cache.
          }
        }
      }

      const response = await fetch("/api/profile")
      if (!response.ok) {
        const fallbackProfile = readFallbackProfile()
        if (fallbackProfile) {
          setProfile(fallbackProfile)
        }
        return
      }

      const payload = (await response.json()) as { profile: Record<string, any> | null }
      if (payload.profile) {
        setProfile(payload.profile)
        return
      }

      const fallbackProfile = readFallbackProfile()
      if (fallbackProfile) {
        setProfile(fallbackProfile)
      }
    }

    void syncAndFetch()
  }, [status])

  useEffect(() => {
    if (!profile) return

    const generateRecommendation = async () => {
      setLoadingRecommendation(true)
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        })

        if (!response.ok) {
          setLoadingRecommendation(false)
          return
        }

        const payload = (await response.json()) as RecommendationPayload
        setRecommendation(payload)
      } finally {
        setLoadingRecommendation(false)
      }
    }

    void generateRecommendation()
  }, [profile])

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        if (result.isFinal) {
          finalTranscript += `${result[0].transcript} `
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const combined = (finalTranscript || interimTranscript).trim()
      if (combined) {
        setChatInput(combined)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopSowSmartVoice()
    }
  }, [])

  const profileEntries = useMemo(() => {
    if (!profile) return []
    return Object.entries(profile).filter(([_, value]) => value !== null && value !== "")
  }, [profile])

  const firstName =
    profile?.firstName ||
    session?.user?.name?.split(" ")[0] ||
    session?.user?.email?.split("@")[0] ||
    "there"

  const modelLabel = recommendation?.provider === "gemini" ? "Gemini + RAG" : "Fallback"

  const renderConfidence = (value: number) => {
    const tone = value >= 85 ? "text-emerald-300 border-emerald-300/30 bg-emerald-500/10" : value >= 70 ? "text-amber-200 border-amber-200/30 bg-amber-500/10" : "text-rose-200 border-rose-200/30 bg-rose-500/10"
    return (
      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>
        Confidence {value}%
      </span>
    )
  }

  const sendChat = async (message: string) => {
    const prompt = message.trim()
    if (!prompt || isSending) return

    setIsSending(true)
    setChatTurns((previous) => [...previous, { role: "user", message: prompt }])
    setChatInput("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userProfile: profile ?? {} }),
      })

      const payload = (await response.json()) as {
        message?: string
        suggestions?: string[]
      }

      const assistantMessage = payload.message || "I could not generate a response right now."
      setChatTurns((previous) => [...previous, { role: "assistant", message: assistantMessage }])
      setChatSuggestions(payload.suggestions ?? [])
    } catch {
      setChatTurns((previous) => [
        ...previous,
        {
          role: "assistant",
          message: "I hit a temporary issue while reaching policy guidance. Please try again.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleChatSubmit = (event: FormEvent) => {
    event.preventDefault()
    void sendChat(chatInput)
  }

  const toggleVoiceInput = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
      return
    }

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
    }
  }

  const speakLastAssistant = async () => {
    const lastAssistant = [...chatTurns].reverse().find((turn) => turn.role === "assistant")
    if (!lastAssistant) return

    setIsSpeaking(true)
    try {
      const playback = await speakSowSmartText(prepareVoiceText(lastAssistant.message))
      await playback.finished
    } finally {
      setIsSpeaking(false)
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading your account...</div>
  }

  if (status !== "authenticated") return null

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,_#222_0%,_#141414_45%,_#0E0E0E_100%)] px-4 py-8 text-[#ECE8E2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <button className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-[#C5BEB4]">Free plan · Upgrade</button>
          <button
            onClick={() => void signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-[#CFC8BC] transition-colors hover:border-white/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-3 text-5xl font-medium text-[#EAE4D9] max-sm:text-4xl">
            <Sparkles className="h-9 w-9 text-[#FF7B49]" />
            <h1 className="font-serif">Hello, {firstName}</h1>
          </div>
          <p className="mt-3 text-sm text-[#B4AEA5]">Personalized by {modelLabel} using your onboarding answers and policy knowledge.</p>
        </motion.div>

        <section className="mt-10 space-y-4">
          {loadingRecommendation && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-[#CBC5BB]">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating your recommendation...
              </div>
            </div>
          )}

          {!loadingRecommendation && recommendation && (
            <>
              <article className="rounded-3xl border border-[#FF7B49]/30 bg-gradient-to-br from-[#2A211D] to-[#181818] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#FF9F77]">Recommendation based on your input, {firstName}</p>
                  {renderConfidence(recommendation.sectionConfidence.recommendation)}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-[#F4EEE5]">{recommendation.recommendationTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-[#D2CBC0]">{recommendation.recommendationSummary}</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#AFA69A]">Reason of choosing this recommendation</p>
                  {renderConfidence(recommendation.sectionConfidence.reason)}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#DDD7CD]">{recommendation.reason}</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#AFA69A]">Explain about policy</p>
                  {renderConfidence(recommendation.sectionConfidence.policy)}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#DDD7CD]">{recommendation.policyExplanation}</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#AFA69A]">What users generally pick in your situation</p>
                  {renderConfidence(recommendation.sectionConfidence.peerChoices)}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#DDD7CD]">{recommendation.peerChoices}</p>
              </article>

              {recommendation.sourceTitles.length > 0 && (
                <article className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8F897F]">RAG sources used</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendation.sourceTitles.map((source) => (
                      <span key={source} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[#BDB6AA]">
                        {source}
                      </span>
                    ))}
                  </div>
                </article>
              )}
            </>
          )}

          {!loadingRecommendation && !recommendation && (
            <div className="rounded-3xl border border-rose-400/30 bg-rose-900/20 p-5 text-sm text-rose-100">
              Recommendation generation failed. Try refreshing this page.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[28px] border border-white/15 bg-white/[0.05] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {chatTurns.length === 0 && (
              <p className="text-sm text-[#B8B1A7]">
                Ask me anything about your recommended policy, deductibles, trade-offs, or bundle options.
              </p>
            )}

            {chatTurns.map((turn, index) => (
              <div key={`${turn.role}-${index}`} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    turn.role === "user"
                      ? "bg-[#FF7B49] text-white"
                      : "border border-white/10 bg-black/30 text-[#E9E3D8]"
                  }`}
                >
                  {turn.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="mt-4 rounded-2xl border border-white/15 bg-[#1E1E1E]/80 px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="How can I help you today?"
              rows={2}
              className="w-full resize-none bg-transparent text-lg text-[#EFE9DE] placeholder:text-[#9B9489] focus:outline-none"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-[#A9A296]">
                <button type="button" className="rounded-full p-1 hover:bg-white/10" aria-label="Add context">
                  <CirclePlus className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`rounded-full p-1 ${isListening ? "text-[#2E7D32]" : "hover:bg-white/10"}`}
                  aria-label="Voice input"
                >
                  <AudioLines className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => void speakLastAssistant()}
                  disabled={isSpeaking}
                  className="rounded-full p-1 hover:bg-white/10 disabled:opacity-50"
                  aria-label="Read last answer aloud"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div className="inline-flex items-center gap-3">
                <span className="text-sm text-[#B7B0A5]">{modelLabel}</span>
                <button
                  type="submit"
                  disabled={isSending || !chatInput.trim()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF7B49] text-white transition-colors hover:bg-[#E6693A] disabled:opacity-50"
                  aria-label="Send"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>

          {chatSuggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void sendChat(suggestion)}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-[#BFB8AC] hover:border-white/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {profileEntries.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[#9F988C]">{key}</p>
              <p className="mt-1 text-sm text-[#D6D0C5]">{String(value)}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
