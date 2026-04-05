"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  ChevronRight,
  Info,
  Sparkles,
  PiggyBank,
  Umbrella,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Income ranges to monthly estimates (using midpoint)
const INCOME_TO_MONTHLY: Record<string, number> = {
  "under-50k": 3500,    // ~$42k/yr
  "50-100k": 6250,      // ~$75k/yr
  "100-200k": 12500,    // ~$150k/yr
  "over-200k": 20833,   // ~$250k/yr
}

// Essential expense ratios by coverage type
const EXPENSE_RATIOS: Record<string, number> = {
  "self": 0.55,           // Single - lower fixed costs
  "self-plus-spouse": 0.60, // Couple - moderate
  "self-plus-family": 0.70, // Family - higher essentials
}

// Risk adjustments
const RISK_MULTIPLIERS: Record<number, number> = {
  1: 1.3,   // Very low risk tolerance - needs bigger buffer
  2: 1.15,
  3: 1.0,   // Balanced
  4: 0.9,
  5: 0.8,   // High risk tolerance - smaller buffer acceptable
}

interface EmergencyCalculatorProps {
  incomeRange: string
  coveragePreference: string
  dependents: number
  riskComfort: number
  savingsRate: number
  age?: number | null
  onSavingsGoalChange?: (goal: number) => void
}

interface EmergencyMetrics {
  monthlyIncome: number
  monthlyEssentials: number
  currentMonthlySavings: number
  currentEmergencyFund: number // Estimated based on savings rate
  monthsOfRunway: number
  recommendedMonths: number
  recommendedFund: number
  gap: number
  monthsToGoal: number
  riskLevel: "critical" | "at-risk" | "building" | "secure" | "excellent"
  weeklyContribution: number
}

function calculateMetrics(props: EmergencyCalculatorProps): EmergencyMetrics {
  const { incomeRange, coveragePreference, dependents, riskComfort, savingsRate, age } = props

  // Monthly income estimate
  const monthlyIncome = INCOME_TO_MONTHLY[incomeRange] || 6250

  // Essential expenses based on coverage/family type
  const baseRatio = EXPENSE_RATIOS[coveragePreference] || 0.60
  const dependentAdjustment = dependents * 0.03 // +3% per dependent
  const expenseRatio = Math.min(0.85, baseRatio + dependentAdjustment)
  const monthlyEssentials = Math.round(monthlyIncome * expenseRatio)

  // Current savings
  const currentMonthlySavings = Math.round(monthlyIncome * (savingsRate / 100))

  // Estimate current emergency fund (rough: assumes 6 months of current savings pattern)
  // This would ideally come from actual user data
  const currentEmergencyFund = Math.round(currentMonthlySavings * 6)

  // Calculate current runway
  const monthsOfRunway = currentEmergencyFund > 0 
    ? Math.round((currentEmergencyFund / monthlyEssentials) * 10) / 10 
    : 0

  // Recommended months based on risk tolerance and life stage
  let baseRecommendedMonths = 3
  if (coveragePreference !== "self") baseRecommendedMonths = 4
  if (dependents >= 2) baseRecommendedMonths = 5
  if (age && age >= 50) baseRecommendedMonths += 1
  
  const riskMultiplier = RISK_MULTIPLIERS[riskComfort] || 1.0
  const recommendedMonths = Math.round(baseRecommendedMonths * riskMultiplier)

  // Recommended fund
  const recommendedFund = monthlyEssentials * recommendedMonths

  // Gap analysis
  const gap = Math.max(0, recommendedFund - currentEmergencyFund)

  // Months to reach goal (if saving consistently)
  const monthsToGoal = currentMonthlySavings > 0 
    ? Math.ceil(gap / currentMonthlySavings)
    : 999

  // Weekly contribution to reach goal in 12 months
  const weeklyContribution = gap > 0 ? Math.ceil(gap / 52) : 0

  // Risk level assessment
  let riskLevel: EmergencyMetrics["riskLevel"]
  if (monthsOfRunway < 1) riskLevel = "critical"
  else if (monthsOfRunway < 2) riskLevel = "at-risk"
  else if (monthsOfRunway < recommendedMonths * 0.7) riskLevel = "building"
  else if (monthsOfRunway < recommendedMonths) riskLevel = "secure"
  else riskLevel = "excellent"

  return {
    monthlyIncome,
    monthlyEssentials,
    currentMonthlySavings,
    currentEmergencyFund,
    monthsOfRunway,
    recommendedMonths,
    recommendedFund,
    gap,
    monthsToGoal,
    riskLevel,
    weeklyContribution,
  }
}

const RISK_COLORS: Record<EmergencyMetrics["riskLevel"], { bg: string; text: string; border: string; icon: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500" },
  "at-risk": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-500" },
  building: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "text-yellow-600" },
  secure: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-500" },
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-500" },
}

const RISK_LABELS: Record<EmergencyMetrics["riskLevel"], string> = {
  critical: "Needs Immediate Attention",
  "at-risk": "Building Foundation",
  building: "Making Progress",
  secure: "Well Protected",
  excellent: "Excellent Position",
}

const RISK_MESSAGES: Record<EmergencyMetrics["riskLevel"], string> = {
  critical: "You're vulnerable to unexpected expenses. Even a small emergency could create financial stress. Let's build a buffer together.",
  "at-risk": "You have some cushion, but job loss or a major expense could be challenging. Strengthening this fund is a priority.",
  building: "You're on the right track! Keep going - you're building real financial security.",
  secure: "Great work! You have solid protection against most emergencies. Consider maintaining this level.",
  excellent: "Outstanding! You're well-prepared for the unexpected. You might even consider investing excess savings.",
}

export function EmergencyCalculator(props: EmergencyCalculatorProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [customSavingsRate, setCustomSavingsRate] = useState<number | null>(null)

  const metrics = useMemo(() => {
    const effectiveSavingsRate = customSavingsRate ?? props.savingsRate
    return calculateMetrics({ ...props, savingsRate: effectiveSavingsRate })
  }, [props, customSavingsRate])

  const colors = RISK_COLORS[metrics.riskLevel]
  const progressPercent = Math.min(100, (metrics.monthsOfRunway / metrics.recommendedMonths) * 100)

  // Notify parent of goal
  useEffect(() => {
    props.onSavingsGoalChange?.(metrics.recommendedFund)
  }, [metrics.recommendedFund, props.onSavingsGoalChange])

  return (
    <div className="w-full space-y-6">
      {/* Main Emergency Readiness Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-3xl border-2 p-6 shadow-sm",
          colors.bg,
          colors.border
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-2xl p-3", colors.bg)}>
              <Umbrella className={cn("h-6 w-6", colors.icon)} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Emergency Readiness</h3>
              <p className={cn("text-sm font-medium", colors.text)}>{RISK_LABELS[metrics.riskLevel]}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#1A1A1A]">
              {metrics.monthsOfRunway.toFixed(1)}
            </div>
            <div className="text-xs text-[#6B7280]">months runway</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#6B7280]">Current</span>
            <span className="text-[#6B7280]">Goal: {metrics.recommendedMonths} months</span>
          </div>
          <div className="h-3 rounded-full bg-white/80 border border-[#E5E7EB] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                metrics.riskLevel === "excellent" ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                metrics.riskLevel === "secure" ? "bg-gradient-to-r from-green-400 to-green-500" :
                metrics.riskLevel === "building" ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
                metrics.riskLevel === "at-risk" ? "bg-gradient-to-r from-orange-400 to-orange-500" :
                "bg-gradient-to-r from-red-400 to-red-500"
              )}
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-[#4B5563] mb-4">
          {RISK_MESSAGES[metrics.riskLevel]}
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/60 p-3 border border-white/80">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-xs text-[#6B7280]">Estimated Fund</span>
            </div>
            <div className="text-lg font-bold text-[#1A1A1A]">
              ${metrics.currentEmergencyFund.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-white/60 p-3 border border-white/80">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-[#2E7D32]" />
              <span className="text-xs text-[#6B7280]">Target Goal</span>
            </div>
            <div className="text-lg font-bold text-[#1A1A1A]">
              ${metrics.recommendedFund.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Show Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2E7D32] hover:text-[#1B5E20] transition"
        >
          {showDetails ? "Hide" : "Show"} calculation details
          <ChevronRight className={cn("h-4 w-4 transition-transform", showDetails && "rotate-90")} />
        </button>

        {/* Details Breakdown */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Estimated monthly income</span>
                  <span className="font-medium">${metrics.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Essential monthly expenses</span>
                  <span className="font-medium">${metrics.monthlyEssentials.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Current monthly savings</span>
                  <span className="font-medium">${metrics.currentMonthlySavings.toLocaleString()}</span>
                </div>
                {metrics.gap > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Gap to goal</span>
                    <span className="font-medium text-[#2E7D32]">${metrics.gap.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Card - Only show if there's a gap */}
      {metrics.gap > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-[#2E7D32]/10 p-3">
              <Sparkles className="h-5 w-5 text-[#2E7D32]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1A1A1A]">Your Path to Security</h4>
              <p className="text-sm text-[#6B7280]">Simple steps to reach your goal</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Weekly savings suggestion */}
            <div className="rounded-2xl bg-[#FAFAFA] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Save per week to reach goal in 1 year</span>
                <span className="text-lg font-bold text-[#2E7D32]">
                  ${metrics.weeklyContribution.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-[#6B7280]">
                That's about ${Math.round(metrics.weeklyContribution / 7)} per day, or {Math.round(metrics.weeklyContribution * 4)} per month
              </div>
            </div>

            {/* Quick tips */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">Automate your savings</div>
                  <div className="text-xs text-[#6B7280]">Set up automatic transfers to a separate high-yield savings account</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">Start small, build momentum</div>
                  <div className="text-xs text-[#6B7280]">Even $25/week adds up to $1,300/year - every bit counts</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">Keep it accessible</div>
                  <div className="text-xs text-[#6B7280]">Your emergency fund should be liquid - not in stocks or CDs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Talk to Agent CTA */}
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2E7D32] py-3 px-6 text-sm font-semibold text-white hover:bg-[#1B5E20] transition shadow-sm">
              <Shield className="h-4 w-4" />
              Talk to a State Farm Agent
            </button>
            <p className="text-center text-xs text-[#6B7280] mt-2">
              Get personalized advice on protecting your family's financial future
            </p>
          </div>
        </motion.div>
      )}

      {/* Success Card - Show if goal met */}
      {metrics.riskLevel === "excellent" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-emerald-800">You're Well Prepared!</h4>
          </div>
          <p className="text-sm text-emerald-700 mb-4">
            Your emergency fund exceeds recommendations. Consider putting extra savings toward:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              Retirement investments (401k, IRA)
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <PiggyBank className="h-4 w-4" />
              Short-term goals (vacation, home improvement)
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <Shield className="h-4 w-4" />
              Additional insurance coverage review
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-[#6B7280]">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Estimates are based on your survey responses and general financial guidelines. 
          For personalized advice, please consult with a State Farm agent or financial advisor.
        </p>
      </div>
    </div>
  )
}

// Standalone "What If" scenario card
export function EmergencyScenarioCard({ 
  scenario, 
  monthsOfRunway,
  monthlyEssentials 
}: { 
  scenario: "job-loss" | "medical" | "car-repair" | "home-repair"
  monthsOfRunway: number
  monthlyEssentials: number
}) {
  const scenarios = {
    "job-loss": {
      icon: Calendar,
      title: "Job Loss",
      description: "If you lost your income today",
      impact: `${monthsOfRunway.toFixed(1)} months of coverage`,
    },
    "medical": {
      icon: Shield,
      title: "Medical Emergency",
      description: "Unexpected $5,000 medical bill",
      impact: monthsOfRunway > 0 
        ? `${Math.max(0, monthsOfRunway - (5000 / monthlyEssentials)).toFixed(1)} months remaining`
        : "Would require debt",
    },
    "car-repair": {
      icon: AlertTriangle,
      title: "Car Repair",
      description: "Major $2,000 car repair needed",
      impact: monthsOfRunway > 0
        ? `${Math.max(0, monthsOfRunway - (2000 / monthlyEssentials)).toFixed(1)} months remaining`
        : "Would require debt",
    },
    "home-repair": {
      icon: Umbrella,
      title: "Home Repair",
      description: "Emergency $3,500 home repair",
      impact: monthsOfRunway > 0
        ? `${Math.max(0, monthsOfRunway - (3500 / monthlyEssentials)).toFixed(1)} months remaining`
        : "Would require debt",
    },
  }

  const s = scenarios[scenario]
  const Icon = s.icon

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5 text-[#2E7D32]" />
        <span className="font-medium text-[#1A1A1A]">{s.title}</span>
      </div>
      <p className="text-xs text-[#6B7280] mb-2">{s.description}</p>
      <p className="text-sm font-semibold text-[#1A1A1A]">{s.impact}</p>
    </div>
  )
}
