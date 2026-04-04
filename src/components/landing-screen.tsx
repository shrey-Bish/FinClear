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
  Info,
  HelpCircle,
  Shield,
  Cpu,
  Database,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export default function LandingScreen({ onStart, onViewInsights, quizCompleted, onDemo }: any) {
  const [modal, setModal] = useState<"login" | "signup" | null>(null)
  const handleFakeSubmit = () => setTimeout(() => setModal(null), 1200)

  const SPOTLIGHTS = [
    { stat: "92%", label: "feel more confident after onboarding", Icon: Stars },
    { stat: "<2 min", label: "to get your first AI-guided plan", Icon: Clock },
    { stat: "5k+", label: "employers rely on FinMate insights", Icon: ShieldCheck },
  ]

  const [invalid, setInvalid] = useState(false)

  const faqs = [
    {
      question: "How does FinMate work?",
      answer:
        "FinMate uses AI to analyze your life situation, financial goals, and priorities. It generates personalized recommendations, helping you understand which benefits and financial actions matter most right now.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. All data is encrypted and stored securely. We follow strict data protection standards and never share your personal information. You can delete your data at any time from your settings.",
    },
    {
      question: "What makes FinMate different?",
      answer:
        "Unlike generic tools, FinMate bridges your personal life context with actionable financial guidance, simplifying how people understand their benefits and financial path.",
    },
    {
      question: "Can I use FinMate as a guest?",
      answer:
        "Yes! You can try FinMate as a guest without an account. However, your data won’t persist across sessions unless you sign up.",
    },
    {
      question: "When should I reassess?",
      answer:
        "We recommend reassessing whenever you have a major life change (new job, marriage, relocation, etc.) or at least once a year to stay aligned with your current situation.",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#1A1A1A]">
      {/* Top Gradient - State Farm subtle red tint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-gradient-to-b from-[#FEF2F2] via-[#FEE2E2] to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-20 pt-6 sm:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <motion.span
            className="hidden text-s font-semibold uppercase tracking-[0.35em] text-[#E31837]/80 md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            State Farm ·{" "}
            <span className="text-[#E31837] font-extrabold drop-shadow-[0_0_8px_rgba(227,24,55,0.35)]">
              FinMate
            </span>
          </motion.span>

          <nav className="flex items-center gap-2 text-sm">
            <Button
              onClick={() => setModal("login")}
              variant="ghost"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#E31837] hover:bg-[#FEF2F2]"
            >
              <LogIn className="mr-2 h-4 w-4" /> Log in
            </Button>
            <Button
              onClick={() => setModal("signup")}
              className="rounded-full bg-[#E31837] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#E31837]/25 hover:bg-[#C41230]"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Sign up
            </Button>
          </nav>
        </header>

        {/* HERO */}
        <main className="flex flex-col items-center gap-10 py-8 md:grid md:grid-cols-2 md:gap-12 md:py-14">
          <div className="w-full max-w-xl md:order-1 md:justify-self-start">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.5em] text-[#E31837]/80"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              AI-Powered Financial Wellness
            </motion.p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-[#1A1A1A] sm:text-5xl">
              Like a good neighbor, your financial future is here.
            </h1>
            <p className="mt-3 max-w-lg text-base text-[#4B5563] sm:text-lg">
              Get personalized guidance on insurance, savings, and emergency planning tailored to your life and goals.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full rounded-full bg-[#E31837] py-6 text-base font-semibold text-white shadow-lg shadow-[#E31837]/25 hover:bg-[#C41230] sm:w-auto sm:px-10"
                onClick={quizCompleted ? onViewInsights ?? onStart : onStart}
              >
                {quizCompleted ? "Open insights" : "Start now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onDemo ?? onStart}
                className="w-full rounded-full border-[#E5E7EB] bg-white py-6 text-base font-semibold text-[#E31837] hover:bg-[#FEF2F2] sm:w-auto sm:px-8"
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
            <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E31837]">Preview</p>
              </div>

              <div className="grid gap-4 p-5 sm:p-6">
                {[
                  {
                    title: "Insurance recommendations",
                    body: "Get personalized auto, home, and life insurance guidance based on your unique situation.",
                  },
                  {
                    title: "Emergency readiness score",
                    body: "See how many months you could sustain if unexpected events happen, plus savings goals.",
                  },
                  {
                    title: "Financial literacy chat",
                    body: "Ask questions about deductibles, premiums, coverage — get simple, clear answers.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm font-semibold text-[#1A1A1A]">{f.title}</p>
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
                className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-md flex flex-col"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#E31837]" />
                  <p className="text-2xl font-semibold text-[#1A1A1A]">{stat}</p>
                </div>
                <p className="text-sm text-[#E31837]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === ABOUT + FAQ SECTION === */}
        <div className="mt-20 space-y-10">
          <Card className="p-6 border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-[#E31837]" />
              <h2 className="text-2xl font-bold">About FinMate</h2>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              FinMate is your AI-powered financial wellness companion, designed to help underserved communities make confident 
              financial decisions. We simplify insurance education, emergency planning, and budgeting tools — making financial 
              literacy accessible to everyone. Like a good neighbor, we're here to help you plan for the unexpected.
            </p>
          </Card>

          <Card className="p-6 border-[#E5E7EB]">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-[#E31837]" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#E5E7EB] pb-4 last:border-b-0">
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">{faq.question}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center text-xs text-[#E31837] space-y-1">
            <p>Powered by Google Gemini AI · Built for State Farm Hackathon</p>
            <p>© 2026 FinMate. Empowering financial well-being through AI.</p>
            <p className="text-[#6B7280] mt-2">Disclaimer: This is an educational tool, not financial advice.</p>
          </div>
        </div>
      </div>

      {/* === LOGIN / SIGNUP MODAL === */}
      /* === LOGIN / SIGNUP MODAL === */
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
        className="w-full max-w-sm rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            {modal === "login" ? "Log in to FinMate" : "Create an Account"}
          </h2>
          <button onClick={() => setModal(null)}>
            <X className="h-5 w-5 text-[#E31837]" />
          </button>
        </div>
        <p className="text-sm text-[#4B5563] mb-4">
          {modal === "login"
            ? "Access your personalized insights instantly."
            : "Join FinMate and start building your plan."}
        </p>

        {/* state for invalid feedback */}
        {invalid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-sm font-medium text-[#E31837]"
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
              if (email === "demo@finmate.com" && password === "demo123") {
                setInvalid(false)
                setModal(null)
                setTimeout(() => onViewInsights?.(), 300)
              } else {
                setInvalid(true)
              }
            } else {
              // signup: fake success
              setInvalid(false)
              handleFakeSubmit()
            }
          }}
          className="flex flex-col gap-3"
        >
          {modal === "signup" && (
            <input
              required
              type="text"
              placeholder="Full Name"
              className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm focus:border-[#E31837] focus:outline-none focus:ring-1 focus:ring-[#E31837]"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm focus:border-[#E31837] focus:outline-none focus:ring-1 focus:ring-[#E31837]"
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm focus:border-[#E31837] focus:outline-none focus:ring-1 focus:ring-[#E31837]"
          />
          <Button
            type="submit"
            className="mt-2 rounded-full bg-[#E31837] py-3 text-sm font-semibold text-white hover:bg-[#C41230]"
          >
            {modal === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-center text-[#6B7280]">
          Demo: demo@finmate.com / demo123
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}
