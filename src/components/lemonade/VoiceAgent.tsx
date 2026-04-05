"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import {
  Loader2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"

import {
  COMPLETION_MESSAGE,
  GUIDE_INTRO,
  getFilteredQuestions,
  getQuestionContent,
} from "@/config/questions"
import { prepareVoiceText, speakSowSmartText, stopSowSmartVoice } from "@/lib/voice"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface VoiceAgentProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: Record<string, any>) => void
}

type AgentState = "idle" | "listening" | "speaking" | "processing"
type ChatMessage = { role: "ai" | "user"; text: string }

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function VoiceAgent({ isOpen, onClose, onComplete }: VoiceAgentProps) {
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [userData, setUserData] = useState<Record<string, string>>({})
  const [transcript, setTranscript] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(false)
  const isConnectedRef = useRef(false)
  const isMutedRef = useRef(false)
  const currentQuestionIndexRef = useRef(-1)
  const userDataRef = useRef<Record<string, string>>({})
  const agentStateRef = useRef<AgentState>("idle")

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      stopSowSmartVoice()
      recognitionRef.current?.abort?.()
    }
  }, [])

  useEffect(() => {
    isConnectedRef.current = isConnected
  }, [isConnected])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex
  }, [currentQuestionIndex])

  useEffect(() => {
    userDataRef.current = userData
  }, [userData])

  useEffect(() => {
    agentStateRef.current = agentState
  }, [agentState])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // Ignore stop errors.
    }
  }, [])

  const speakLine = useCallback(async (text: string) => {
    const prompt = prepareVoiceText(text)
    setMessages((previous) => [...previous, { role: "ai", text: prompt }])
    setAgentState("speaking")

    if (isMutedRef.current) {
      await sleep(650)
      return
    }

    const playback = await speakSowSmartText(prompt)
    await playback.finished
  }, [])

  const finishConversation = useCallback(
    async (finalUserData: Record<string, string>) => {
      setAgentState("processing")
      await speakLine(COMPLETION_MESSAGE.voice)

      if (!isMountedRef.current) return

      setTimeout(() => {
        if (isMountedRef.current) {
          onComplete({ ...finalUserData, voiceMode: true })
        }
      }, 800)
    },
    [onComplete, speakLine]
  )

  const askQuestion = useCallback(
    async (questionIndex: number, nextUserData: Record<string, string>) => {
      const filteredQuestions = getFilteredQuestions(nextUserData)
      const question = filteredQuestions[questionIndex]

      if (!question) {
        await finishConversation(nextUserData)
        return
      }

      currentQuestionIndexRef.current = questionIndex
      setCurrentQuestionIndex(questionIndex)
      setTranscript("")

      const content = getQuestionContent(question, nextUserData, true)
      await speakLine(content)

      if (!isMountedRef.current || !isConnectedRef.current) return

      setTimeout(() => {
        if (isMountedRef.current && isConnectedRef.current) {
          setAgentState("listening")
          try {
            recognitionRef.current?.start()
          } catch {
            // Recognition already active.
          }
        }
      }, 250)
    },
    [finishConversation, speakLine]
  )

  const handleUserResponse = useCallback(
    async (text: string) => {
      if (!isMountedRef.current) return

      setMessages((previous) => [...previous, { role: "user", text }])
      setAgentState("processing")
      setTranscript("")

      const questionIndex = currentQuestionIndexRef.current
      const currentQuestion = getFilteredQuestions(userDataRef.current)[questionIndex]

      if (!currentQuestion) {
        return
      }

      let value = text
      if (currentQuestion.options?.length) {
        const matchedOption = currentQuestion.options.find((option) => {
          const lowerText = text.toLowerCase()
          return lowerText.includes(option.label.toLowerCase()) || lowerText.includes(option.value.toLowerCase())
        })

        if (matchedOption) {
          value = matchedOption.value
        }
      }

      const nextUserData = {
        ...userDataRef.current,
        [currentQuestion.field]: value,
      }

      setUserData(nextUserData)

      const nextQuestionIndex = questionIndex + 1
      const nextQuestions = getFilteredQuestions(nextUserData)

      if (nextQuestionIndex >= nextQuestions.length) {
        await finishConversation(nextUserData)
        return
      }

      await sleep(300)
      await askQuestion(nextQuestionIndex, nextUserData)
    },
    [askQuestion, finishConversation]
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      if (!isConnectedRef.current || !isMountedRef.current) return

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

      const nextTranscript = (finalTranscript + interimTranscript).trim()
      if (nextTranscript) {
        setTranscript(nextTranscript)
      }

      if (finalTranscript.trim()) {
        stopListening()
        void handleUserResponse(finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      if (!isMountedRef.current) return

      if (event.error === "not-allowed") {
        setError("Microphone access is blocked. Please allow permissions and try again.")
        setAgentState("idle")
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError("Voice input had a problem. Try again or switch to text chat.")
        setAgentState("idle")
      }
    }

    recognition.onend = () => {
      if (!isMountedRef.current || !isConnectedRef.current) return
      if (agentStateRef.current === "listening") {
        setAgentState("processing")
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [handleUserResponse, stopListening])

  const startConversation = useCallback(async () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setError("This browser does not support voice input. Use Text Chat instead.")
        return
      }
    }

    setError(null)
    setIsConnected(true)
    setMessages([])
    setUserData({})
    setTranscript("")
    setAgentState("speaking")
    currentQuestionIndexRef.current = -1
    setCurrentQuestionIndex(-1)

    await speakLine(GUIDE_INTRO.voice)

    if (!isMountedRef.current || !isConnectedRef.current) return

    await askQuestion(0, {})
  }, [askQuestion, speakLine])

  const handleDisconnect = useCallback(() => {
    stopSowSmartVoice()
    stopListening()
    setIsConnected(false)
    setAgentState("idle")
    setTranscript("")
    setCurrentQuestionIndex(-1)
    currentQuestionIndexRef.current = -1
  }, [stopListening])

  const toggleMute = useCallback(() => {
    setIsMuted((previous) => {
      const nextValue = !previous
      if (nextValue) {
        stopSowSmartVoice()
      }
      return nextValue
    })
  }, [])

  if (!isOpen) return null

  const isActive = isConnected

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb_0%,_#fffdf9_42%,_#f7fbf7_100%)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-[#F3EAE4] bg-white shadow-[0_30px_100px_rgba(26,26,26,0.12)]"
        >
          <div className="h-1 bg-gradient-to-r from-[#FF0080] via-[#F97316] to-[#2E7D32]" />

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFE4EF] to-[#FFF7E8] text-2xl shadow-sm">
                👩
              </div>
              <div>
                <p className="font-script text-xl text-[#1A1A1A]">Nova</p>
                <p className="text-xs text-gray-500">{error ?? (isActive ? `Voice ${agentState}` : "Ready to start")}</p>
              </div>
            </div>

            <button
              onClick={() => {
                handleDisconnect()
                onClose()
              }}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close voice assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid flex-1 gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b border-gray-100 px-5 py-6 sm:px-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
              {!isActive ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div
                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FFEEF6] to-[#FFF3E9] shadow-lg shadow-[#FF0080]/10"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2.8 }}
                  >
                    <Mic className="h-11 w-11 text-[#FF0080]" />
                  </motion.div>

                  <h2 className="text-2xl font-medium text-[#1A1A1A]">Talk to Nova</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Ask your answers out loud. Nova will read each question with ElevenLabs voice quality and listen on your mic.
                  </p>

                  <button
                    onClick={startConversation}
                    className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#2E7D32] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#1B5E20]"
                  >
                    <Phone className="h-4 w-4" />
                    Start Conversation
                  </button>

                  <p className="mt-4 text-xs text-gray-400">Uses your microphone for input and ElevenLabs for Nova&apos;s voice.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F7F4] px-3 py-1 text-xs font-medium text-gray-600">
                      <span className={`h-2 w-2 rounded-full ${agentState === "listening" ? "bg-[#2E7D32]" : agentState === "speaking" ? "bg-[#FF0080]" : "bg-gray-400"}`} />
                      {agentState === "speaking" && "Nova is speaking"}
                      {agentState === "listening" && "Listening for your answer"}
                      {agentState === "processing" && "Thinking"}
                      {agentState === "idle" && "Idle"}
                    </div>

                    <span className="text-xs font-medium text-gray-400">Question {Math.max(currentQuestionIndex + 1, 0)}</span>
                  </div>

                  <div className="mb-5 rounded-3xl border border-[#F4E7E1] bg-gradient-to-br from-[#FFF7F1] via-white to-[#F5FBF5] p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E7D32]">Live call</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {agentState === "speaking" && "Nova is setting up the next question."}
                          {agentState === "listening" && "Your answer is being captured."}
                          {agentState === "processing" && "Nova is thinking through your response."}
                          {agentState === "idle" && "Ready to begin the interview."}
                        </p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                        {messages.length} turns
                      </div>
                    </div>

                    <div className="mt-4 flex h-16 items-end justify-center gap-1">
                      {Array.from({ length: 15 }).map((_, index) => {
                        const dynamicHeights: Record<AgentState, string[]> = {
                          idle: ["18px", "26px", "14px", "22px", "16px", "20px", "18px", "24px", "15px", "19px", "14px", "22px", "16px", "20px", "18px"],
                          listening: ["24px", "42px", "28px", "48px", "22px", "38px", "30px", "46px", "26px", "36px", "24px", "40px", "28px", "44px", "26px"],
                          speaking: ["36px", "18px", "42px", "20px", "38px", "22px", "46px", "18px", "40px", "20px", "44px", "22px", "38px", "24px", "42px"],
                          processing: ["18px", "20px", "24px", "28px", "30px", "34px", "30px", "28px", "24px", "20px", "18px", "22px", "26px", "30px", "24px"],
                        }
                        const heights = dynamicHeights[agentState]
                        return (
                          <motion.span
                            key={index}
                            className={`w-2 rounded-full ${agentState === "listening" ? "bg-[#2E7D32]" : agentState === "speaking" ? "bg-[#FF0080]" : agentState === "processing" ? "bg-[#F59E0B]" : "bg-[#D1D5DB]"}`}
                            animate={{ height: [heights[index], heights[(index + 3) % heights.length], heights[index]] }}
                            transition={{ repeat: Infinity, duration: 1.3 + index * 0.03, ease: "easeInOut" }}
                            style={{ height: heights[index] }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <div className="max-h-[360px] flex-1 space-y-3 overflow-y-auto pr-1">
                    {messages.map((message, index) => (
                      <motion.div
                        key={`${message.role}-${index}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                            message.role === "user"
                              ? "rounded-br-md bg-[#2E7D32] text-white"
                              : "rounded-bl-md bg-[#F8F7F4] text-[#1A1A1A]"
                          }`}
                        >
                          {message.text}
                        </div>
                      </motion.div>
                    ))}

                    {agentState === "speaking" && messages.length === 0 && (
                      <div className="flex items-center gap-3 rounded-3xl bg-[#F8F7F4] px-4 py-3 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin text-[#FF0080]" />
                        Nova is preparing the first question.
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {transcript && (
                    <div className="mt-4 rounded-2xl border border-[#EAF2EA] bg-[#F4FBF4] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#2E7D32]/70">You said</p>
                      <p className="mt-1 text-sm leading-6 text-[#1A1A1A]">{transcript}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between px-6 py-7 md:px-7">
              <div>
                <div className="mb-5 rounded-3xl bg-gradient-to-br from-[#FFF6F0] via-white to-[#F5FBF5] p-5 ring-1 ring-[#F4E7E1]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2E7D32]">Voice mode</p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Clear, natural audio for Nova&apos;s prompts. Mic capture stays on-device; only the spoken response is synthesized.
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">ElevenLabs</div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">Mic input</span>
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">Auto advance</span>
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">Accessible prompts</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={toggleMute}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-4 text-sm transition-colors ${
                      isMuted
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    <span className="mt-2 text-xs font-medium">{isMuted ? "Unmute" : "Mute"}</span>
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-4 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                  >
                    <PhoneOff className="h-5 w-5 text-[#FF0080]" />
                    <span className="mt-2 text-xs font-medium">End</span>
                  </button>

                  <button
                    onClick={agentState === "listening" ? stopListening : startConversation}
                    disabled={agentState === "speaking" || agentState === "processing"}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-4 text-sm transition-colors ${
                      agentState === "listening"
                        ? "border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    {agentState === "listening" ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    <span className="mt-2 text-xs font-medium">{agentState === "listening" ? "Listening" : "Mic"}</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                Powered by ElevenLabs voice synthesis and browser mic capture.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}