"use client"

import { useState } from "react"
import { AlertCircle, Briefcase, ExternalLink, HelpCircle, MessageCircle, Phone, RefreshCw, Send, Shield, Star, User, Users, Heart } from "lucide-react"

import { openSowSmartChat } from "@/components/chat-bus"
import { EmergencyCalculator } from "@/components/emergency-calculator"
import { InsightsVisualization } from "@/components/insights-visualization"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { EnrollmentFormData, SowSmartInsights } from "@/lib/types"

interface InsightsDashboardProps {
  insights: SowSmartInsights
  onBackToLanding: () => void
  onRegenerate: () => void
  onSendReport: () => void
  onRecalculate?: () => void
  loading?: boolean
  usingPlaceholder?: boolean
  formData?: EnrollmentFormData | null
}

const TESTIMONIALS = [
  {
    name: "Maria G.",
    role: "First-time homebuyer",
    text: "SowSmart helped me understand the difference between HMO and PPO before open enrollment. I saved $1,200/year by switching plans!",
    stars: 5,
  },
  {
    name: "James L.",
    role: "Small business owner",
    text: "The emergency readiness calculator was eye-opening. I didn't realize how underfunded my safety net was. Now I'm on track for 6 months.",
    stars: 5,
  },
  {
    name: "Priya K.",
    role: "Recent graduate",
    text: "I had no idea what renters insurance was until SowSmart explained it. $20/month for $30K in coverage? Already signed up through State Farm.",
    stars: 5,
  },
]

export function InsightsDashboard({
  insights,
  onBackToLanding,
  onRegenerate,
  onSendReport,
  onRecalculate,
  loading,
  usingPlaceholder = false,
  formData,
}: InsightsDashboardProps) {
  const topPriority = insights.priorityBenefits[0]
  const [showHelp, setShowHelp] = useState(false)
  
  // Calculate risk score based on form data
  const calculateRiskScore = () => {
    if (!formData) return 50
    let score = 50
    // Higher dependents = higher risk
    score += (formData.dependents ?? 0) * 10
    // Higher income = lower risk
    if (formData.incomeRange === '100-200k' || formData.incomeRange === '200k-plus') score -= 15
    // Higher savings = lower risk
    score -= (formData.savingsRate ?? 10) / 2
    // Higher risk comfort = lower perceived risk concern
    score -= ((formData.riskComfort ?? 3) - 3) * 5
    return Math.max(10, Math.min(90, Math.round(score)))
  }
  const riskScore = calculateRiskScore()

  return (
    <div className="relative min-h-screen bg-[#F7F4F2] pb-32 text-[#2A1A1A]">
      {usingPlaceholder && (
        <div className="sticky top-0 z-50 border-b border-[#E2D5D7] bg-[#FFF9E6] px-6 py-3">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-[#A41E34]" />
            <span className="font-medium text-[#4D3B3B]">
              * Using placeholder data. Complete the survey to see personalized insights.
            </span>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-[#E2D5D7] bg-[#F7F4F2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7F1527]">Priority guidance</p>
            <h1 className="text-lg font-semibold text-[#2A1A1A] sm:text-xl">{insights.focusGoal}</h1>
            {topPriority && (
              <p className="text-sm text-[#4D3B3B]">Next up: {topPriority.title}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-[#A41E34]/30 text-sm font-semibold text-[#A41E34] hover:bg-[#F9EDEA]"
              onClick={onRegenerate}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh priorities
            </Button>
            <Button
              variant="ghost"
              className="rounded-full text-sm font-semibold text-[#A41E34] hover:text-[#7F1527]"
              onClick={onBackToLanding}
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6">
        {/* Profile Summary Card */}
        {formData && (
          <Card className="overflow-hidden rounded-3xl border border-[#E2D5D7] bg-gradient-to-r from-[#2E7D32]/5 via-white to-white p-6 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32]/10">
                  <User className="h-7 w-7 text-[#2E7D32]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#2A1A1A]">
                    {formData.preferredName || formData.fullName || "Guest"}
                  </h2>
                  {insights.goalTheme && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F9EDEA] px-3 py-1 text-xs font-semibold text-[#A41E34]">
                      <Briefcase className="h-3 w-3" />
                      {insights.goalTheme}
                    </span>
                  )}
                </div>
              </div>
              {onRecalculate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#2E7D32]/30 text-sm font-semibold text-[#2E7D32] hover:bg-[#E8F5E9]"
                  onClick={onRecalculate}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {formData.age && (
                <div className="rounded-xl bg-[#FAFAFA] p-3 text-center">
                  <div className="text-lg font-bold text-[#2A1A1A]">{formData.age}</div>
                  <div className="text-xs text-[#6B7280]">Age</div>
                </div>
              )}
              <div className="rounded-xl bg-[#FAFAFA] p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-lg font-bold text-[#2A1A1A]">{formData.dependents}</span>
                </div>
                <div className="text-xs text-[#6B7280]">Dependents</div>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] p-3 text-center">
                <div className="text-lg font-bold text-[#2A1A1A]">
                  {formData.incomeRange === "under-50k" ? "<$50k" : formData.incomeRange === "50-100k" ? "$50-100k" : formData.incomeRange === "100-200k" ? "$100-200k" : formData.incomeRange === "200k-plus" ? "$200k+" : "$—"}
                </div>
                <div className="text-xs text-[#6B7280]">Income</div>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Heart className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-lg font-bold text-[#2A1A1A]">{formData.riskComfort}/5</span>
                </div>
                <div className="text-xs text-[#6B7280]">Risk Comfort</div>
              </div>
              {/* Risk Score Gauge */}
              <div className="rounded-xl bg-[#FAFAFA] p-3 text-center col-span-2 sm:col-span-1">
                <div className="relative mx-auto h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={riskScore > 60 ? "#EF4444" : riskScore > 40 ? "#F59E0B" : "#2E7D32"}
                      strokeWidth="3"
                      strokeDasharray={`${riskScore}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#2A1A1A]">{riskScore}</span>
                  </div>
                </div>
                <div className="text-xs text-[#6B7280] mt-1">Risk Score</div>
              </div>
            </div>
          </Card>
        )}

        {/* Focus Card */}
        <Card className="overflow-hidden rounded-3xl border border-[#E2D5D7] bg-white p-6 shadow-lg">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7F1527]">
              Your focus
            </p>
            <h2 className="text-2xl font-semibold text-[#2A1A1A]">
              {insights.focusGoal}
            </h2>
            <p className="text-sm leading-relaxed text-[#4D3B3B]">
              {insights.statement}
            </p>

            {topPriority && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F9EDEA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#A41E34]">
                  Top priority: {topPriority.title}
                </div>

                <Button
                  className="ml-2 rounded-full bg-[#A41E34] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7F1527]"
                  onClick={() =>
                    openSowSmartChat({
                      prompt: topPriority
                        ? `How do I start ${topPriority.title.toLowerCase()}?`
                        : "What should I do first?",
                    })
                  }
                >
                  Chat about my priorities
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Emergency Readiness Calculator */}
        {formData && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2A1A1A]">Emergency Readiness</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-[#7F1527]">Financial safety net</span>
            </div>
            <EmergencyCalculator
              incomeRange={formData.incomeRange}
              coveragePreference={formData.coveragePreference}
              dependents={formData.dependents}
              riskComfort={formData.riskComfort}
              savingsRate={formData.savingsRate}
              age={formData.age}
            />
          </section>
        )}

        {/* Priority Benefits */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2A1A1A]">Priority benefits to tackle</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-[#7F1527]">Personalized for you</span>
          </div>
          <div className="space-y-4">
            {insights.priorityBenefits.map((benefit) => (
              <Card key={benefit.id} className="rounded-3xl border border-[#E2D5D7] bg-white p-5 shadow-md">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F9EDEA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#A41E34]">
                      {benefit.urgency}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7F1527]">
                      {benefit.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2A1A1A]">{benefit.title}</h3>
                    <p className="mt-2 text-sm text-[#4D3B3B] leading-relaxed">{benefit.description}</p>
                  </div>
                  <div className="rounded-2xl border border-[#F0E6E7] bg-[#FBF7F6] p-4 text-sm text-[#4D3B3B]">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7F1527]">Why it matters</span>
                    <p className="mt-2 leading-relaxed">{benefit.whyItMatters}</p>
                  </div>
                  <div className="space-y-2 text-sm text-[#4D3B3B]">
                    {benefit.actions.map((resource) => (
                      <a
                        key={resource.title}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-2 rounded-2xl border border-[#F0E6E7] bg-[#FBF7F6] p-3 transition hover:border-[#A41E34] hover:bg-white"
                      >
                        <ExternalLink className="mt-1 h-4 w-4 text-[#A41E34]" />
                        <span>
                          <span className="block font-semibold text-[#2A1A1A]">{resource.title}</span>
                          <span className="text-xs text-[#7F1527] leading-relaxed">{resource.description}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#7F1527]">Need a hand?</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-[#A41E34]/30 text-xs font-semibold text-[#A41E34] hover:border-[#A41E34]"
                      onClick={() => openSowSmartChat({ prompt: `Help me with ${benefit.title.toLowerCase()}` })}
                    >
                      Ask SowSmart about this
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button
            onClick={onSendReport}
            className="w-full rounded-full bg-[#A41E34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7F1527]"
          >
            Email my priority list to HR
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </section>

        {/* Financial Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2A1A1A]">Financial Overview</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-[#7F1527]">Visual insights</span>
          </div>
          <InsightsVisualization data={{}} />
        </section>

        {/* Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2A1A1A]">Timeline to act</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-[#7F1527]">Swipe to explore</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {insights.timeline.map((item) => (
              <Card key={item.title} className="min-w-[220px] flex-1 rounded-3xl border border-[#E2D5D7] bg-white p-5 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7F1527]">{item.period}</p>
                <h3 className="mt-3 text-base font-semibold text-[#2A1A1A]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#4D3B3B]">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Talk to Agent CTA */}
        <Card className="rounded-3xl border-2 border-[#2E7D32]/20 bg-gradient-to-r from-[#E8F5E9] to-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[#2E7D32]/10 p-3">
                <Phone className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2A1A1A]">Talk to a State Farm Agent</h2>
                <p className="text-sm text-[#4D3B3B]">Get personalized advice from a licensed local agent who knows your community.</p>
              </div>
            </div>
            <a
              href="https://www.statefarm.com/agent"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#2E7D32]/20 transition hover:bg-[#1B5E20]"
            >
              <Shield className="mr-2 h-4 w-4" />
              Find an Agent
            </a>
          </div>
        </Card>

        {/* Testimonials */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#2A1A1A]">What people are saying</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="rounded-3xl border border-[#E2D5D7] bg-white p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#2E7D32] text-[#2E7D32]" />
                  ))}
                </div>
                <p className="text-sm text-[#4D3B3B] leading-relaxed italic">"{t.text}"</p>
                <div className="mt-3 border-t border-[#F0E6E7] pt-3">
                  <p className="text-sm font-semibold text-[#2A1A1A]">{t.name}</p>
                  <p className="text-xs text-[#7F1527]">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Chat CTA */}
        <Card className="rounded-3xl border border-[#E2D5D7] bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#2A1A1A]">Keep exploring with SowSmart</h2>
              <p className="text-sm text-[#4D3B3B]">Jump back into chat for follow-up questions or share your plan.</p>
            </div>
            <Button
              className="rounded-full bg-[#A41E34] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7F1527]"
              onClick={() => openSowSmartChat({ prompt: "What should I tackle next based on my plan?" })}
            >
              Chat with SowSmart
              <MessageCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Disclaimer Footer */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-center">
          <p className="text-xs text-[#6B7280] leading-relaxed">
            <strong>Disclaimer:</strong> SowSmart provides general financial education and guidance only. 
            This is not personalized financial, insurance, or investment advice. For coverage decisions, 
            please consult with a licensed State Farm agent. Your specific situation may vary. 
            State Farm® and its logo are registered trademarks of State Farm Mutual Automobile Insurance Company.
          </p>
        </div>
      </main>

      {/* Floating "Confused? Get help" button */}
      <div className="fixed bottom-24 right-4 z-50 sm:bottom-28 sm:right-6">
        <button
          onClick={() => {
            setShowHelp(!showHelp)
            if (!showHelp) {
              openSowSmartChat({ prompt: "I'm confused about my results. Can you explain them in simpler terms?" })
            }
          }}
          className="flex items-center gap-2 rounded-full bg-[#2E7D32] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/30 transition hover:bg-[#1B5E20] hover:shadow-xl"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Confused? Get help</span>
        </button>
      </div>
    </div>
  )
}
