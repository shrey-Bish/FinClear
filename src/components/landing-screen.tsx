"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  LogIn,
  UserPlus,
  ShieldCheck,
  Clock,
  Stars,
  Sparkles,
  X,
  HelpCircle,
  Sprout,
  TrendingUp,
  PiggyBank,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export default function LandingScreen({ onStart, onViewInsights, quizCompleted, onDemo }: any) {
  const [modal, setModal] = useState<"login" | "signup" | null>(null)
  const handleFakeSubmit = () => setTimeout(() => setModal(null), 1200)

  const SPOTLIGHTS = [
    { stat: "92%", label: "feel more confident after onboarding", Icon: Stars },
    { stat: "<2 min", label: "to get your first AI-guided plan", Icon: Clock },
    { stat: "5k+", label: "users trust SowSmart insights", Icon: ShieldCheck },
  ]

  const [invalid, setInvalid] = useState(false)

  const faqs = [
    {
      question: "How does SowSmart work?",
      answer:
        "SowSmart uses AI to analyze your life situation, financial goals, and priorities. It generates personalized recommendations, helping you understand which benefits and financial actions matter most right now.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. All data is stored locally on your device and encrypted. We follow strict data protection standards and never share your personal information. You control your data completely.",
    },
    {
      question: "What makes SowSmart different?",
      answer:
        "Unlike generic tools, SowSmart bridges your personal life context with actionable financial guidance, simplifying how people understand insurance, savings, and emergency planning.",
    },
    {
      question: "Can I use SowSmart as a guest?",
      answer:
        "Yes! You can try SowSmart as a guest without an account. Your data persists in your browser for convenience.",
    },
    {
      question: "When should I reassess?",
      answer:
        "We recommend reassessing whenever you have a major life change (new job, marriage, relocation, etc.) or at least once a year to stay aligned with your current situation.",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#1A1A1A]">
      {/* Top Gradient - Fresh green growth theme */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-gradient-to-b from-[#E8F5E9] via-[#C8E6C9] to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-20 pt-6 sm:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sprout className="h-6 w-6 text-[#2E7D32]" />
            <span className="text-lg font-bold text-[#2E7D32]">SowSmart</span>
          </motion.div>

          <nav className="flex items-center gap-2 text-sm">
            <Button
              onClick={() => setModal("login")}
              variant="ghost"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#2E7D32] hover:bg-[#E8F5E9]"
            >
              <LogIn className="mr-2 h-4 w-4" /> Log in
            </Button>
            <Button
              onClick={() => setModal("signup")}
              className="rounded-full bg-[#2E7D32] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#2E7D32]/25 hover:bg-[#1B5E20]"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign up
            </Button>
          </nav>
        </header>

        {/* HERO */}
        <main className="flex flex-col items-center gap-10 py-8 md:grid md:grid-cols-2 md:gap-12 md:py-14">
          <div className="w-full max-w-xl md:order-1 md:justify-self-start">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.5em] text-[#2E7D32]/80"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🌱 Plant Good Financial Habits Early
            </motion.p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-[#1A1A1A] sm:text-5xl">
              Grow your financial future with confidence.
            </h1>
            <p className="mt-3 max-w-lg text-base text-[#4B5563] sm:text-lg">
              Get personalized guidance on insurance, savings, and emergency planning tailored to your life and goals.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full rounded-full bg-[#2E7D32] py-6 text-base font-semibold text-white shadow-lg shadow-[#2E7D32]/25 hover:bg-[#1B5E20] sm:w-auto sm:px-10"
                onClick={quizCompleted ? onViewInsights ?? onStart : onStart}
              >
                {quizCompleted ? "Open insights" : "Start growing"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onDemo ?? onStart}
                className="w-full rounded-full border-[#C8E6C9] bg-white py-6 text-base font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] sm:w-auto sm:px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Try 2-min demo
              </Button>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <motion.div
            className="w-full md:order-2 md:justify-self-end mt-2 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[28px] border border-[#C8E6C9] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#E8F5E9] px-5 py-3">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-[#2E7D32]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">Preview</p>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:p-6">
                {[
                  {
                    title: "Insurance recommendations",
                    body: "Get personalized auto, home, and life insurance guidance based on your unique situation.",
                    Icon: ShieldCheck,
                  },
                  {
                    title: "Emergency readiness score",
                    body: "See how many months you could sustain if unexpected events happen, plus savings goals.",
                    Icon: PiggyBank,
                  },
                  {
                    title: "Financial literacy chat",
                    body: "Ask questions about deductibles, premiums, coverage — get simple, clear answers.",
                    Icon: TrendingUp,
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-[#E8F5E9] bg-white p-4 shadow-sm hover:shadow-md transition-shadow hover:border-[#C8E6C9]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <f.Icon className="h-4 w-4 text-[#2E7D32]" />
                      <p className="text-sm font-semibold text-[#1A1A1A]">{f.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-[#4B5563]">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>

        {/* STATS */}
        <section className="mt-6 hidden md:block">
          <div className="grid grid-cols-3 gap-4">
            {SPOTLIGHTS.map(({ stat, label, Icon }) => (
              <div
                key={stat}
                className="rounded-3xl border border-[#C8E6C9] bg-white p-5 shadow-md flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#2E7D32]" />
                  <p className="text-2xl font-semibold text-[#1A1A1A]">{stat}</p>
                </div>
                <p className="text-sm text-[#2E7D32]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === ABOUT + FAQ SECTION === */}
        <div className="mt-20 space-y-10">
          <Card className="p-6 border-[#C8E6C9]">
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="w-6 h-6 text-[#2E7D32]" />
              <h2 className="text-2xl font-bold">About SowSmart</h2>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              SowSmart is your AI-powered financial wellness companion, designed to help everyone — especially underserved 
              communities — make confident financial decisions. We simplify insurance education, emergency planning, and 
              budgeting tools, making financial literacy accessible. <strong>Plant good financial habits early</strong>, 
              and watch your financial security grow.
            </p>
          </Card>

          <Card className="p-6 border-[#C8E6C9]">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-[#2E7D32]" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#E8F5E9] pb-4 last:border-b-0">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">{faq.question}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center text-xs text-[#2E7D32] space-y-1">
            <p>🌱 Powered by Google Gemini AI · Built for State Farm Hackathon</p>
            <p>© 2025 SowSmart. Growing financial well-being through AI.</p>
            <p className="text-[#6B7280] mt-2">Disclaimer: This is an educational tool, not financial advice. Consult a licensed professional for personalized guidance.</p>
          </div>
        </div>
      </div>

      {/* === LOGIN / SIGNUP MODAL === */}
<AnimatePresence>
  {modal && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl border border-[#C8E6C9] bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-[#2E7D32]" />
            <h2 className="text-xl font-semibold text-[#1A1A1A]">
              {modal === "login" ? "Log in to SowSmart" : "Create an Account"}
            </h2>
          </div>
          <button onClick={() => setModal(null)}>
            <X className="h-5 w-5 text-[#2E7D32]" />
          </button>
        </div>
        <p className="text-sm text-[#4B5563] mb-4">
          {modal === "login"
            ? "Access your personalized insights instantly."
            : "Join SowSmart and start building your financial garden."}
        </p>

        {invalid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-sm font-medium text-red-600"
          >
            Invalid email or password
          </motion.p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value
            const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value

            if (modal === "login") {
              if (email === "demo@sowsmart.com" && password === "demo123") {
                setInvalid(false)
                setModal(null)
                // Navigate to quiz/insights based on what's available
                setTimeout(() => {
                  if (onViewInsights) {
                    onViewInsights()
                  } else if (onStart) {
                    onStart()
                  }
                }, 300)
              } else {
                setInvalid(true)
              }
            } else {
              // Signup: close modal and start the app
              setInvalid(false)
              setModal(null)
              setTimeout(() => {
                if (onStart) {
                  onStart()
                }
              }, 300)
            }
          }}
          className="flex flex-col gap-3"
        >
          {modal === "signup" && (
            <input
              required
              type="text"
              placeholder="Full Name"
              className="rounded-xl border border-[#C8E6C9] bg-[#F1F8E9] px-4 py-3 text-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border border-[#C8E6C9] bg-[#F1F8E9] px-4 py-3 text-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="rounded-xl border border-[#C8E6C9] bg-[#F1F8E9] px-4 py-3 text-sm focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
          <Button
            type="submit"
            className="mt-2 rounded-full bg-[#2E7D32] py-3 text-sm font-semibold text-white hover:bg-[#1B5E20]"
          >
            {modal === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-center text-[#6B7280]">
          Demo: demo@sowsmart.com / demo123
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
