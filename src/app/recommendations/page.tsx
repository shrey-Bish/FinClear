"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUp, AudioLines, Loader2, LogOut, Volume2 } from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
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
  const { user, isLoading, signOut } = useAuth()
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
    if (!isLoading && !user) {
      router.replace("/login?callbackUrl=%2Frecommendations")
    }
  }, [router, user, isLoading])

  useEffect(() => {
    if (isLoading || !user) return

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

      // First check for pending signup data (from onboarding flow)
      if (typeof window !== "undefined") {
        const raw = window.sessionStorage.getItem(PENDING_SIGNUP_KEY)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { data?: Record<string, any> }
            if (parsed.data && Object.keys(parsed.data).length > 0) {
              // User completed onboarding, sync their data
              const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile: parsed.data }),
              })
              if (response.ok) {
                setProfile(parsed.data)
              } else {
                setProfile(parsed.data)
              }
              window.sessionStorage.removeItem(PENDING_SIGNUP_KEY)
              return
            }
          } catch {
            // Ignore malformed data
          }
          window.sessionStorage.removeItem(PENDING_SIGNUP_KEY)
        }
      }

      // Check server for existing profile
      const response = await fetch("/api/profile")
      if (response.ok) {
        const payload = (await response.json()) as { profile: Record<string, any> | null }
        if (payload.profile && Object.keys(payload.profile).length > 0) {
          setProfile(payload.profile)
          return
        }
      }

      // Check local storage for profile
      const fallbackProfile = readFallbackProfile()
      if (fallbackProfile && Object.keys(fallbackProfile).length > 0) {
        setProfile(fallbackProfile)
        return
      }

      // No profile found - this is a new user, redirect to onboarding
      router.replace("/?newUser=true")
    }

    void syncAndFetch()
  }, [user, isLoading, router])

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
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
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

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading your account...</div>
  }

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="font-script text-2xl text-gray-800">SowSmart</div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#FF0080] hover:text-[#FF0080]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Greeting */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-3 text-4xl md:text-5xl font-serif italic text-gray-800">
            <span className="text-4xl">👋</span>
            <h1>Hey {firstName}!</h1>
          </div>
          <p className="mt-3 text-sm text-gray-500">Here&apos;s what we think is perfect for you based on your answers 💅</p>
        </motion.div>

        {/* Recommendations */}
        <section className="mt-10 space-y-4">
          {loadingRecommendation && (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#FF0080]" />
                Finding the best coverage for you...
              </div>
            </div>
          )}

          {!loadingRecommendation && recommendation && (
            <>
              {/* Main Recommendation */}
              <article className="rounded-3xl border-2 border-[#FF0080] bg-gradient-to-br from-pink-50 to-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#FF0080] font-semibold">🎯 Your perfect match</p>
                  <button 
                    onClick={() => speakSowSmartText(prepareVoiceText(recommendation.recommendationSummary))}
                    className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                    title="Listen to this"
                  >
                    <Volume2 className="h-4 w-4 text-[#FF0080]" />
                  </button>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-gray-800">{recommendation.recommendationTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{recommendation.recommendationSummary}</p>
              </article>

              {/* Why This */}
              <article className="rounded-3xl border border-gray-200 bg-white p-6 hover:border-[#FF0080] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">💡 Why this works for you</p>
                  <button 
                    onClick={() => speakSowSmartText(prepareVoiceText(recommendation.reason))}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Listen to this"
                  >
                    <Volume2 className="h-4 w-4 text-gray-400 hover:text-[#FF0080]" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-700">{recommendation.reason}</p>
              </article>

              {/* What It Covers */}
              <article className="rounded-3xl border border-gray-200 bg-white p-6 hover:border-[#FF0080] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">📋 What you&apos;re getting (in plain English)</p>
                  <button 
                    onClick={() => speakSowSmartText(prepareVoiceText(recommendation.policyExplanation))}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Listen to this"
                  >
                    <Volume2 className="h-4 w-4 text-gray-400 hover:text-[#FF0080]" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-700">{recommendation.policyExplanation}</p>
              </article>

              {/* Social Proof */}
              <article className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">👥 What others like you picked</p>
                  <button 
                    onClick={() => speakSowSmartText(prepareVoiceText(recommendation.peerChoices))}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    title="Listen to this"
                  >
                    <Volume2 className="h-4 w-4 text-gray-400 hover:text-[#FF0080]" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-600">{recommendation.peerChoices}</p>
              </article>
            </>
          )}

          {!loadingRecommendation && !recommendation && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              Oops! Something went wrong. Try refreshing the page 😅
            </div>
          )}
        </section>

        {/* Chat Section */}
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {chatTurns.length === 0 && (
              <p className="text-sm text-gray-500">
                Ask me anything about your coverage! Like "what's a deductible?" or "should I bundle?" 🤔
              </p>
            )}

            {chatTurns.map((turn, index) => (
              <div key={`${turn.role}-${index}`} className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    turn.role === "user"
                      ? "bg-[#FF0080] text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {turn.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask me anything about your coverage..."
              rows={2}
              className="w-full resize-none bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`rounded-full p-2 ${isListening ? "bg-green-100 text-green-600" : "hover:bg-gray-200"}`}
                  aria-label="Voice input"
                >
                  <AudioLines className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => void speakLastAssistant()}
                  disabled={isSpeaking}
                  className="rounded-full p-2 hover:bg-gray-200 disabled:opacity-50"
                  aria-label="Read last answer aloud"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSending || !chatInput.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0080] text-white transition-colors hover:bg-[#E60073] disabled:opacity-50"
                aria-label="Send"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </button>
            </div>
          </form>

          {chatSuggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void sendChat(suggestion)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 hover:border-[#FF0080] hover:text-[#FF0080]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Profile Info */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {profileEntries.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-500">{key}</p>
              <p className="mt-1 text-sm text-gray-700">{String(value)}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="font-script text-lg text-gray-400">SowSmart</p>
          <p className="text-xs text-gray-400 mt-1">Built for State Farm Hackathon · Insurance made ez for Gen Z</p>
        </footer>
      </div>
    </div>
  )
}
