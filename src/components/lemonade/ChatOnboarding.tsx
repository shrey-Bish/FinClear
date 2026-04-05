"use client"

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, HelpCircle, MessageSquare, RotateCcw, Volume2, VolumeX } from "lucide-react"

import {
  COMPLETION_MESSAGE,
  GUIDE_INTRO,
  PROGRESS_STEPS,
  getFilteredQuestions as getFilteredQuestionsFromConfig,
  getQuestionContent,
  type Question,
} from "@/config/questions"
import { prepareVoiceText, speakSowSmartText, stopSowSmartVoice } from "@/lib/voice"

const PENDING_SIGNUP_KEY = "sowsmart_pending_signup"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  options?: Question["options"]
  inputType?: Question["inputType"]
  inputPlaceholder?: string
  field?: string
}

interface AnswerHistoryItem {
  field: string
  value: string
  label: string
}

interface ChatOnboardingProps {
  onComplete: (data: Record<string, any>) => void
  onBack: () => void
}

function deriveProgress(questionIndex: number, isSignupStep: boolean) {
  if (isSignupStep || questionIndex >= 5) return 3
  if (questionIndex >= 2) return 2
  return 1
}

export function ChatOnboarding({ onComplete, onBack }: ChatOnboardingProps) {
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [voiceMode, setVoiceMode] = useState(false)
  const [modeSelected, setModeSelected] = useState(false)
  const [userData, setUserData] = useState<Record<string, string>>({})
  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryItem[]>([])
  const [showSignupStep, setShowSignupStep] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(0)

  const filteredQuestions = useMemo(
    () => getFilteredQuestionsFromConfig(userData),
    [userData]
  )

  const currentQuestion = filteredQuestions[questionIndex]
  const currentStep = deriveProgress(questionIndex, showSignupStep)

  const questionToMessage = useCallback(
    (question: Question, data: Record<string, string>, useVoice = voiceMode): Message => ({
      id: question.id,
      type: "ai",
      content:
        questionIndex === 0 && messages.length === 0
          ? `${GUIDE_INTRO.text}\n\n${getQuestionContent(question, data, useVoice)}`
          : getQuestionContent(question, data, useVoice),
      options: question.options,
      inputType: question.inputType,
      inputPlaceholder: question.inputPlaceholder,
      field: question.field,
    }),
    [messages.length, questionIndex, voiceMode]
  )

  const addAiMessage = useCallback(
    (message: Message) => {
      setIsTyping(true)
      const delay = voiceMode ? 1100 : 700

      window.setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [...prev, message])

        if (voiceMode) {
          void speakSowSmartText(prepareVoiceText(message.content))
        }
      }, delay)
    },
    [voiceMode]
  )

  const addUserMessage = useCallback((content: string) => {
    messageIdRef.current += 1
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${messageIdRef.current}`,
        type: "user",
        content,
      },
    ])
  }, [])

  const rebuildConversationFromHistory = useCallback(
    (history: AnswerHistoryItem[], useVoice = voiceMode) => {
      const rebuiltMessages: Message[] = []
      const rebuiltData: Record<string, string> = {}

      history.forEach((item, index) => {
        const qs = getFilteredQuestionsFromConfig(rebuiltData)
        const question = qs[index]
        if (!question) return

        rebuiltMessages.push(questionToMessage(question, rebuiltData, useVoice))
        rebuiltMessages.push({
          id: `history-${index}`,
          type: "user",
          content: item.label,
        })

        rebuiltData[item.field] = item.value
      })

      const nextQuestions = getFilteredQuestionsFromConfig(rebuiltData)
      const nextQuestion = nextQuestions[history.length]
      if (nextQuestion) {
        rebuiltMessages.push(questionToMessage(nextQuestion, rebuiltData, useVoice))
      }

      setUserData(rebuiltData)
      setQuestionIndex(history.length)
      setMessages(rebuiltMessages)
      setShowSignupStep(false)
      setAuthError(null)
    },
    [questionToMessage, voiceMode]
  )

  const moveToSignupStep = useCallback(
    (nextData: Record<string, string>) => {
      setShowSignupStep(true)
      setQuestionIndex(filteredQuestions.length)
      addAiMessage({
        id: "complete",
        type: "ai",
        content: `${COMPLETION_MESSAGE.text}\n\nNow lock this profile to your account. Add your email and create a password to finish signup.`,
      })
      if (nextData.firstName) {
        setEmail((prev) => prev || `${nextData.firstName.toLowerCase()}@`)
      }
    },
    [addAiMessage, filteredQuestions.length]
  )

  const handleAnswer = useCallback(
    (label: string, value: string, field?: string) => {
      if (!field) return

      addUserMessage(label)

      const nextData = { ...userData, [field]: value }
      const nextHistory = [...answerHistory, { field, value, label }]

      setUserData(nextData)
      setAnswerHistory(nextHistory)
      setInputValue("")

      const nextQuestions = getFilteredQuestionsFromConfig(nextData)
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)

      if (nextIndex >= nextQuestions.length) {
        moveToSignupStep(nextData)
        return
      }

      const nextQuestion = nextQuestions[nextIndex]
      if (nextQuestion) {
        addAiMessage(questionToMessage(nextQuestion, nextData))
      }
    },
    [addAiMessage, addUserMessage, answerHistory, moveToSignupStep, questionIndex, questionToMessage, userData]
  )

  const handleTextSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!inputValue.trim() || !currentQuestion?.field) return

    handleAnswer(inputValue.trim(), inputValue.trim(), currentQuestion.field)
  }

  const handleOptionSelect = (option: { label: string; value: string }, field?: string) => {
    handleAnswer(option.label, option.value, field)
  }

  const handlePreviousQuestion = () => {
    if (answerHistory.length === 0) return

    const nextHistory = answerHistory.slice(0, -1)
    setAnswerHistory(nextHistory)
    rebuildConversationFromHistory(nextHistory)
  }

  const handleModeSelect = (mode: "text" | "voice") => {
    const useVoice = mode === "voice"
    setVoiceMode(useVoice)
    setModeSelected(true)

    const initialQuestions = getFilteredQuestionsFromConfig({})
    const firstQuestion = initialQuestions[0]
    if (firstQuestion) {
      addAiMessage(questionToMessage(firstQuestion, {}, useVoice))
    }
  }

  const handleSignupConfirm = async (event: FormEvent) => {
    event.preventDefault()
    setAuthError(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || password.trim().length < 8) {
      setAuthError("Please provide a valid email and a password with at least 8 characters.")
      return
    }

    const answersPayload = { ...userData, voiceMode }
    setIsSubmitting(true)

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        name: userData.firstName || normalizedEmail,
        answers: answersPayload,
      }),
    })

    if (response.status === 409) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          PENDING_SIGNUP_KEY,
          JSON.stringify({ email: normalizedEmail, data: answersPayload })
        )
      }
      router.push(`/login?email=${encodeURIComponent(normalizedEmail)}`)
      return
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      setIsSubmitting(false)
      setAuthError(payload.error || "Unable to create account. Try again.")
      return
    }

    const loginResult = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    })

    setIsSubmitting(false)

    if (!loginResult?.ok) {
      setAuthError("Account created, but login failed. Please go to Login.")
      router.push(`/login?email=${encodeURIComponent(normalizedEmail)}`)
      return
    }

    onComplete(answersPayload)
    router.push("/recommendations")
  }

  const handleGoogleSignup = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        PENDING_SIGNUP_KEY,
        JSON.stringify({ email: email.trim().toLowerCase(), data: { ...userData, voiceMode } })
      )
    }
    await signIn("google", { callbackUrl: "/recommendations" })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      stopSowSmartVoice()
    }
  }, [])

  if (!modeSelected) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="font-script text-xl text-gray-800">SowSmart</div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <span className="text-4xl">👩</span>
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl font-medium text-gray-800 text-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hey there! I&apos;m Nova 👋
          </motion.h1>

          <motion.p
            className="text-gray-500 text-center mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Answer a few quick questions first, then create your account with email at the end.
          </motion.p>

          <motion.div
            className="w-full max-w-sm space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => handleModeSelect("text")}
              className="w-full flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-[#FF0080] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                <MessageSquare className="w-6 h-6 text-gray-600 group-hover:text-[#FF0080]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Text Chat</p>
                <p className="text-sm text-gray-500">Type your answers</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-[#FF0080] text-white text-xs font-medium rounded-full">FASTER</div>
            </button>

            <button
              onClick={() => handleModeSelect("voice")}
              className="w-full flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-[#FF0080] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                <Volume2 className="w-6 h-6 text-gray-600 group-hover:text-[#FF0080]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Voice Mode</p>
                <p className="text-sm text-gray-500">Nova reads questions aloud</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">ACCESSIBLE</div>
            </button>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden">
          <span className="text-2xl">👩</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceMode((prev) => !prev)}
            className={`p-2 rounded-full transition-colors ${voiceMode ? "bg-pink-100 text-[#FF0080]" : "hover:bg-gray-100 text-gray-400"}`}
            title={voiceMode ? "Voice mode on" : "Voice mode off"}
          >
            {voiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-6 py-4 border-b border-gray-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {PROGRESS_STEPS.slice(1).map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${index + 1 <= currentStep ? "bg-[#FF0080]" : "bg-gray-200"}`} />
                {index < PROGRESS_STEPS.length - 2 && (
                  <div className={`w-10 h-0.5 mx-2 ${index + 1 < currentStep ? "bg-[#FF0080]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handlePreviousQuestion}
            disabled={answerHistory.length === 0 || isSubmitting}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" />
            Previous
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-lg mx-auto space-y-4 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={`${message.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                      <span className="text-sm">👩</span>
                    </div>
                  </div>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 ${message.type === "user" ? "bg-[#FF0080] text-white rounded-tr-md" : "text-gray-800"}`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.type === "ai" &&
                    message.options &&
                    index === messages.length - 1 &&
                    !isTyping &&
                    !showSignupStep && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option, message.field)}
                            className="w-full flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-gray-200 hover:border-[#FF0080] rounded-xl text-gray-800 font-medium transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {option.icon && <span className="text-xl">{option.icon}</span>}
                              <div className="text-left">
                                <span className="block">{option.label}</span>
                                {option.description && <span className="text-xs text-gray-400">{option.description}</span>}
                              </div>
                            </div>
                            {option.badge && (
                              <span className="bg-[#FF0080] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">{option.badge}</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}

                  {message.type === "ai" &&
                    message.inputType === "text" &&
                    index === messages.length - 1 &&
                    !isTyping &&
                    !showSignupStep && (
                      <motion.form onSubmit={handleTextSubmit} className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            placeholder={message.inputPlaceholder}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF0080]"
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="px-6 py-3 bg-[#FF0080] text-white rounded-xl font-medium disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </motion.form>
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <span className="text-sm">👩</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}

          {showSignupStep && (
            <motion.form
              onSubmit={handleSignupConfirm}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#F4E7E1] bg-[#FFF7F1] p-4 space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2E7D32]">Create your account</p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#FF0080] focus:outline-none"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create password (min 8 chars)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#FF0080] focus:outline-none"
                required
              />

              {authError && <p className="text-sm text-red-600">{authError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#FF0080] px-4 py-3 text-sm font-semibold text-white hover:bg-[#E60073] disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Confirm and create account"}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-white"
              >
                Sign up with Google
              </button>
            </motion.form>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {voiceMode && (
        <div className="px-4 py-3 border-t border-gray-100 bg-pink-50">
          <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-[#FF0080] text-sm">
            <Volume2 className="w-4 h-4" />
            <span>Voice mode active - Nova will read questions aloud</span>
          </div>
        </div>
      )}
    </div>
  )
}
