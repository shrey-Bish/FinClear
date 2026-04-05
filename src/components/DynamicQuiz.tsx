"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Shield, Eye, Lock, Database, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  COVERAGE_OPTIONS,
  EDUCATION_OPTIONS,
  HEALTH_OPTIONS,
  INCOME_OPTIONS,
  ACCOUNT_PREFERENCE_OPTIONS,
  BENEFIT_USAGE_OPTIONS,
  DENTAL_VISION_OPTIONS,
  GUIDANCE_PREFERENCE_OPTIONS,
  MARITAL_OPTIONS,
  PARTNER_COVERAGE_OPTIONS,
  PLAN_PREFERENCE_OPTIONS,
  PRIMARY_CARE_OPTIONS,
  PRESCRIPTION_OPTIONS,
  initializeQuizState,
  questionsFor,
  RESIDENCY_OPTIONS,
  updateFormValue,
  type QuizOption,
  type QuizQuestion,
  type QuizQuestionType,
} from "@/lib/quiz"
import { withDerivedMetrics } from "@/lib/insights"
import type { EnrollmentFormData } from "@/lib/types"
import { cn } from "@/lib/utils"

type Phase = "trust" | "hr" | "steps" | "summary"

// Trust Passport data collection items
const TRUST_PASSPORT_ITEMS = [
  {
    icon: Database,
    title: "Basic Information",
    description: "Name, age, location, employment status",
    why: "To personalize recommendations for your region and life stage",
    stored: "Locally on your device",
  },
  {
    icon: Shield,
    title: "Financial Profile",
    description: "Income range, dependents, risk tolerance",
    why: "To match you with appropriate insurance and savings plans",
    stored: "Locally on your device",
  },
  {
    icon: Eye,
    title: "Health Preferences",
    description: "Coverage needs, existing conditions (optional)",
    why: "To recommend suitable health and dental plans",
    stored: "Locally on your device",
  },
  {
    icon: Lock,
    title: "Goals & Priorities",
    description: "Financial goals, budget preferences",
    why: "To prioritize recommendations that matter to you",
    stored: "Locally on your device",
  },
]

interface DynamicQuizProps {
  initialData: EnrollmentFormData
  onComplete: (data: EnrollmentFormData) => Promise<void> | void
  onBack: () => void
  onUpdate?: (data: EnrollmentFormData) => void
}

const QUESTION_TYPE_LABEL: Record<QuizQuestionType, string> = {
  number: "Number",
  select: "Select",
  slider: "Slider",
  boolean: "Toggle",
  "boolean-choice": "Yes/No",
  "multi-select": "Multi select",
  textarea: "Details",
}

const HR_CARD_COPY = [
  { label: "Marital status", accessor: (data: EnrollmentFormData) => formatMaritalStatus(data.maritalStatus) },
  { label: "Education", accessor: (data: EnrollmentFormData) => formatEducationLevel(data.educationLevel) },
  { label: "Employment start", accessor: (data: EnrollmentFormData) => data.employmentStartDate },
  { label: "Citizenship", accessor: (data: EnrollmentFormData) => data.citizenship },
  { label: "Location", accessor: (data: EnrollmentFormData) => `${data.workState}, ${data.workCountry}` },
  { label: "Region", accessor: (data: EnrollmentFormData) => data.workRegion },
]

export function DynamicQuiz({ initialData, onComplete, onBack, onUpdate }: DynamicQuizProps) {
  const [answers, setAnswers] = useState<EnrollmentFormData>(() => initializeQuizState(initialData))
  const [phase, setPhase] = useState<Phase>("trust")
  const [index, setIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [trustAccepted, setTrustAccepted] = useState(false)

useEffect(() => {
  const prepared = initializeQuizState(initialData)
  setAnswers(prepared)
  setPhase("trust")
  setIndex(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  useEffect(() => {
    onUpdate?.(answers)
  }, [answers, onUpdate])

  const flow = useMemo(() => questionsFor(answers), [answers])
  const current = phase === "steps" ? flow[index] : null
  const previousSection = phase === "steps" && index > 0 ? flow[index - 1]?.section ?? null : null
  const showSectionIntro = Boolean(
    phase === "steps" && current && current.section && current.section !== previousSection,
  )

  useEffect(() => {
    if (phase === "steps" && index > flow.length - 1 && flow.length > 0) {
      setIndex(flow.length - 1)
    }
  }, [flow.length, index, phase])

  const valueForQuestion = (question: QuizQuestion) => {
    const value = answers[question.id as keyof EnrollmentFormData]
    if (question.id === "activityLevel") {
      return answers.activityLevel
    }
    return value ?? null
  }

  const handleValueChange = (question: QuizQuestion, value: string | number | boolean | string[] | null) => {
    const updated = withDerivedMetrics(updateFormValue(answers, question.id, value))
    setAnswers(updated)
  }

  const goBack = () => {
    if (phase === "trust") {
      onBack()
      return
    }
    if (phase === "hr") {
      setPhase("trust")
      return
    }
    if (phase === "summary") {
      if (flow.length) {
        setPhase("steps")
        setIndex(Math.max(flow.length - 1, 0))
      } else {
        setPhase("hr")
      }
      return
    }
    if (index === 0) {
      setPhase("hr")
    } else {
      setIndex((previous) => Math.max(previous - 1, 0))
    }
  }

  const goNext = () => {
    if (phase === "trust") {
      setPhase("hr")
      return
    }
    if (phase === "hr") {
      setPhase("steps")
      setIndex(0)
      return
    }
    if (phase === "steps") {
      if (index < flow.length - 1) {
        setIndex((previous) => previous + 1)
      } else {
        setPhase("summary")
      }
    }
  }

  const isCurrentValid = (question: QuizQuestion | null) => {
    if (!question) return false
    const value = valueForQuestion(question)
    switch (question.type) {
      case "textarea":
        return typeof value === "string" && value.trim().length > 0
      case "number":
      case "slider":
        return typeof value === "number" && !Number.isNaN(value)
      case "select":
        return Boolean(value)
      case "boolean":
      case "boolean-choice":
        return value === true || value === false
      case "multi-select":
        return Array.isArray(value) && value.length > 0
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    const ready = withDerivedMetrics({ ...answers })
    setSubmitting(true)
    try {
      await onComplete(ready)
    } finally {
      setSubmitting(false)
    }
  }

  const consentChecked = answers.consentToFollowUp
  const currentIsValid = isCurrentValid(current)
  const progress = useMemo(() => {
    if (phase === "trust") return 0
    if (phase === "hr") return 5
    if (phase === "summary") return 100
    if (!flow.length) return 5
    const completed = index + (currentIsValid ? 1 : 0)
    return Math.min(100, Math.round(5 + (completed / flow.length) * 90))
  }, [currentIsValid, flow.length, index, phase])
  const progressLabel = `${Math.round(progress)}%`

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-[#FAFAFA] text-[#1A1A1A]",
        submitting && "pointer-events-none"
      )}
      aria-busy={submitting}
    >
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-3 py-4 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#2E7D32] shadow-sm transition sm:px-4 sm:text-sm disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#2E7D32] sm:text-xs">
              {phase === "trust" ? "Trust Passport" : phase === "steps" && current ? current.section : "SowSmart Survey"}
            </p>
            <p className="text-[10px] text-[#6B7280] sm:text-xs">
              {phase === "trust"
                ? "Data transparency"
                : phase === "steps" && current
                ? `Question ${index + 1} of ${flow.length} · ${QUESTION_TYPE_LABEL[current.type]}`
                : phase === "hr"
                  ? "Profile confirmation"
                  : "Review"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 pb-2 sm:px-6">
          <div
            className="h-1 flex-1 bg-[#F3F4F6]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2E7D32]">{progressLabel}</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto px-3 pb-24 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          {/* TRUST PASSPORT PHASE */}
          {phase === "trust" && (
            <motion.section
              key="trust-phase"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="scroll-mt-[84px] rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-8 sm:py-10 sm:px-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-[#2E7D32]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2E7D32]/80">Trust Passport</p>
                  </div>
                  <h1 className="mt-3 text-xl font-semibold text-[#1A1A1A] sm:text-2xl">Your data, your control</h1>
                  <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                    Before we begin, here's exactly what information we collect and why. 
                    Like a good neighbor, we believe in complete transparency.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {TRUST_PASSPORT_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition hover:border-[#2E7D32]/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
                          <Icon className="h-5 w-5 text-[#2E7D32]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1A1A1A]">{item.title}</h3>
                          <p className="mt-1 text-sm text-[#4B5563]">{item.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-xs font-medium text-[#059669]">
                              <CheckCircle2 className="h-3 w-3" />
                              {item.stored}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-[#6B7280]">
                            <strong>Why:</strong> {item.why}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-[#FEF3C7] bg-[#FFFBEB] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#D97706]" />
                  <div>
                    <p className="text-sm font-semibold text-[#92400E]">Privacy Promise</p>
                    <p className="mt-1 text-xs text-[#B45309]">
                      Your data is stored locally on your device. We don't sell or share your personal information. 
                      You can delete your data anytime from Settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <Switch
                  checked={trustAccepted}
                  onCheckedChange={setTrustAccepted}
                  className="data-[state=checked]:bg-[#2E7D32]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">I understand how my data will be used</p>
                  <p className="text-xs text-[#6B7280]">Required to continue</p>
                </div>
              </div>
            </motion.section>
          )}

          {phase === "hr" && (
            <motion.section
              key="hr-phase"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="scroll-mt-[84px] rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-8 sm:py-10 sm:px-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2E7D32]/80">Your Profile</p>
                  <h1 className="mt-3 text-xl font-semibold text-[#1A1A1A] sm:text-2xl">Welcome, {answers.preferredName || answers.fullName || "there"}</h1>
                  <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                    Review your basic information below. We'll use this to personalize your financial wellness recommendations.
                  </p>
                </div>
                <div className="hidden h-8 w-8 rounded-full border border-[#E5E7EB] sm:block" aria-hidden="true" />
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm text-sm leading-relaxed text-[#4B5563]">
                  <p>
                    <strong>Name:</strong> {answers.fullName || "Not provided"}
                  </p>
                  <p>
                    <strong>Location:</strong> {answers.workState}, {answers.workCountry}
                  </p>
                  <p>
                    <strong>Status:</strong> Active participant
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-[#4B5563] sm:grid-cols-2">
                  {HR_CARD_COPY.map((item) => (
                    <Card key={item.label} className="rounded-2xl border border-[#F3F4F6] bg-[#FAFAFA] p-4 shadow-none">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{item.accessor(answers) || "—"}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {phase === "steps" && current && (
            <motion.section
              key={current.id as string}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="scroll-mt-[84px] rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-8 sm:py-10 sm:px-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  {showSectionIntro && (
                    <div className="space-y-2">
                      <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
                        {current.section}
                      </span>
                      {current.sectionDescription && (
                        <p className="text-xs leading-relaxed text-[#6B7280] sm:max-w-sm">
                          {current.sectionDescription}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2E7D32]/80">
                    Question {index + 1}
                  </p>
                  <h1 className="text-xl font-semibold text-[#1A1A1A] sm:text-2xl">{current.title}</h1>
                  <p className="text-sm leading-relaxed text-[#4B5563]">{current.prompt}</p>
                </div>
                <div className="hidden h-9 w-9 rounded-full border border-[#E5E7EB] sm:block" aria-hidden="true" />
              </div>

              <div className="mt-8 space-y-6">
                {renderField(current, valueForQuestion(current) as string | number | boolean | string[] | null, (value) => handleValueChange(current, value))}
              </div>
            </motion.section>
          )}

          {phase === "summary" && (
            <motion.section
              key="summary-phase"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="min-h-[calc(100vh-120px)] scroll-mt-[84px] rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm sm:min-h-[calc(100vh-100px)] sm:rounded-[28px] sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2E7D32]/80">Summary</p>
                  <h1 className="mt-3 text-xl font-semibold text-[#1A1A1A] sm:text-2xl">Here’s your SowSmart profile</h1>
                  <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                    Confirm your answers and share consent so SowSmart can generate your personalized benefits plans.
                  </p>
                </div>
                <div className="hidden h-8 w-8 rounded-full border border-[#E5E7EB] sm:block" aria-hidden="true" />
              </div>

              <div className="mt-8 space-y-6 text-sm text-[#4B5563]">
                <SummarySection title="Coverage & Family">
                  <SummaryRow
                    label="Coverage focus"
                    value={getLabelForOption(COVERAGE_OPTIONS, answers.coveragePreference)}
                  />
                  <SummaryRow
                    label="Partner coverage"
                    value={getLabelForOption(PARTNER_COVERAGE_OPTIONS, answers.partnerCoverageStatus)}
                  />
                  {answers.coveragePreference === "self-plus-family" && (
                    <SummaryRow label="Dependents" value={String(answers.dependents)} />
                  )}
                  <SummaryRow
                    label="Existing plans"
                    value={getLabelForOption(HEALTH_OPTIONS, answers.healthCoverage)}
                  />
                  <SummaryRow
                    label="Continuous coverage"
                    value={formatYesNo(answers.hasContinuousCoverage)}
                  />
                </SummarySection>

                <SummarySection title="Health & Wellness">
                  <SummaryRow
                    label="Ongoing conditions"
                    value={formatYesNo(answers.hasHealthConditions)}
                  />
                  {answers.hasHealthConditions && (
                    <SummaryRow
                      label="Condition summary"
                      value={answers.healthConditionSummary || "Provided verbally"}
                    />
                  )}
                  <SummaryRow
                    label="Primary care visits"
                    value={getLabelForOption(PRIMARY_CARE_OPTIONS, answers.primaryCareFrequency)}
                  />
                  <SummaryRow
                    label="Prescription use"
                    value={getLabelForOption(PRESCRIPTION_OPTIONS, answers.prescriptionFrequency)}
                  />
                  <SummaryRow
                    label="Activity level"
                    value={`${answers.activityLevelScore}/5 (${formatActivityLevel(answers.activityLevelScore)})`}
                  />
                  <SummaryRow
                    label="Household tobacco use"
                    value={formatYesNo(answers.tobaccoUse)}
                  />
                </SummarySection>

                <SummarySection title="Financial & Plan Preference">
                  <SummaryRow
                    label="Household income"
                    value={getLabelForOption(INCOME_OPTIONS, answers.incomeRange)}
                  />
                  <SummaryRow
                    label="Benefits budget"
                    value={`${answers.benefitsBudget}% of income`}
                  />
                  <SummaryRow label="Risk comfort" value={formatRiskComfort(answers.riskComfort)} />
                  <SummaryRow
                    label="Plan priority"
                    value={getLabelForOption(PLAN_PREFERENCE_OPTIONS, answers.planPreference)}
                  />
                  <SummaryRow
                    label="HSA / FSA access"
                    value={getLabelForOption(ACCOUNT_PREFERENCE_OPTIONS, answers.taxPreferredAccount)}
                  />
                </SummarySection>

                <SummarySection title="Life Stage & Usage">
                  <SummaryRow
                    label="Life changes expected"
                    value={formatYesNo(answers.anticipatesLifeChanges)}
                  />
                  <SummaryRow
                    label="Benefit usage"
                    value={getLabelForOption(BENEFIT_USAGE_OPTIONS, answers.expectedBenefitUsage)}
                  />
                  <SummaryRow
                    label="Out-of-state travel"
                    value={formatYesNo(answers.travelsOutOfState)}
                  />
                  <SummaryRow
                    label="International coverage"
                    value={formatYesNo(answers.needsInternationalCoverage)}
                  />
                  <SummaryRow
                    label="Dental / vision"
                    value={getLabelForOption(DENTAL_VISION_OPTIONS, answers.dentalVisionPreference)}
                  />
                </SummarySection>

                <SummarySection title="Retirement & Long-Term">
                  <SummaryRow
                    label="Contributing now"
                    value={formatYesNo(answers.contributesToRetirement)}
                  />
                  {answers.contributesToRetirement && (
                    <SummaryRow
                      label="Contribution rate"
                      value={`${answers.retirementContributionRate}% of income`}
                    />
                  )}
                  {answers.contributesToRetirement !== null && (
                    <SummaryRow
                      label="Guidance requests"
                      value={formatYesNo(answers.wantsRetirementGuidance)}
                    />
                  )}
                </SummarySection>

                <SummarySection title="Plan Experience">
                  <SummaryRow
                    label="Confidence with insurance terms"
                    value={`${answers.confidenceInsuranceTerms}/5`}
                  />
                  <SummaryRow
                    label="Guidance preference"
                    value={getLabelForOption(GUIDANCE_PREFERENCE_OPTIONS, answers.guidancePreference)}
                  />
                </SummarySection>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">I agree to share this profile for plan generation</p>
                  <p className="text-xs text-[#2E7D32]">Required so SowSmart can generate recommendations and chat summaries.</p>
                </div>
                <Switch
                  checked={consentChecked}
                  disabled={submitting}
                  onCheckedChange={(checked) =>
                    setAnswers((current) => withDerivedMetrics({ ...current, consentToFollowUp: checked }))
                  }
                />
              </div>
              {submitting && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm font-semibold text-[#2E7D32]"
                >
                  Analyzing your SowSmart profile…
                </motion.p>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={submitting}
            className="rounded-full border-[#E5E7EB] px-5 py-3 text-sm font-semibold text-[#2E7D32] shadow-sm transition disabled:opacity-50"
          >
            Back
          </Button>

          {phase === "summary" ? (
            <Button
              onClick={handleSubmit}
              disabled={!consentChecked || submitting}
              className="inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B5E20] disabled:opacity-40"
            >
              {submitting ? "Analyzing…" : "Generate my insights"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : phase === "trust" ? (
            <Button
              onClick={goNext}
              disabled={!trustAccepted}
              className="inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B5E20] disabled:opacity-40"
            >
              I understand, continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={submitting || (phase === "steps" && !currentIsValid)}
              className="inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B5E20] disabled:opacity-40"
            >
              {phase === "hr" ? "Start survey" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

function renderField(
  question: QuizQuestion,
  value: string | number | boolean | string[] | null,
  onChange: (value: string | number | boolean | string[] | null) => void,
) {
  switch (question.type) {
    case "number":
      return (
        <div className="space-y-2">
          <Label className="text-sm text-[#2E7D32]">Your answer</Label>
          <Input
            type="number"
            min={question.min}
            max={question.max}
            value={typeof value === "number" ? value : value ? Number(value) : ""}
            onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
            className="h-12 rounded-2xl border-[#E5E7EB] bg-[#FAFAFA] px-4 text-base"
          />
          {question.helperText && (
            <p className="text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    case "select":
      return (
        <div className="grid gap-3">
          {question.options?.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/30",
                value === option.value
                  ? "border-transparent bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white"
                  : "border-[#E5E7EB] bg-[#FAFAFA] text-[#1A1A1A] hover:border-[#2E7D32]/40",
              )}
              aria-pressed={value === option.value}
            >
              <span>
                <span className="block font-semibold">{option.label}</span>
                {option.helper && (
                  <span className={cn("text-xs", value === option.value ? "text-white/80" : "text-[#2E7D32]")}>{option.helper}</span>
                )}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ))}
          {question.helperText && (
            <p className="text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    case "slider": {
      const numericValue = typeof value === "number" ? value : question.min ?? 0
      const minLabel = question.minLabel ?? (question.min !== undefined ? `${question.min}` : "")
      const maxLabel = question.maxLabel ?? (question.max !== undefined ? `${question.max}` : "")
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <Slider
              min={question.min ?? 0}
              max={question.max ?? 10}
              step={question.step ?? 1}
              value={[numericValue]}
              onValueChange={(numbers) => onChange(numbers[0])}
              aria-label={question.title}
            />
            {(minLabel || maxLabel) && (
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#2E7D32]/70">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-[#2E7D32]">
            {question.valueFormatter
              ? question.valueFormatter(numericValue)
              : question.id === "riskComfort"
                ? `${numericValue}/5`
                : `${numericValue}`}
          </p>
          {question.helperText && (
            <p className="text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    }
    case "boolean-choice":
      return (
        <div className="flex flex-wrap gap-3">
          {[{ label: "No", value: false }, { label: "Yes", value: true }].map((choice) => (
            <button
              key={choice.label}
              type="button"
              onClick={() => onChange(choice.value)}
              className={cn(
                "w-full rounded-full border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/30 sm:w-auto",
                value === choice.value
                  ? "border-transparent bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white"
                  : "border-[#E5E7EB] bg-[#FAFAFA] text-[#2E7D32] hover:border-[#2E7D32]/40",
              )}
              aria-pressed={value === choice.value}
            >
              {choice.label}
            </button>
          ))}
          {question.helperText && (
            <p className="w-full text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    case "multi-select":
      return (
        <div className="flex flex-wrap gap-2">
          {(question.options ?? []).map((option) => {
            const active = Array.isArray(value) && value.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!Array.isArray(value) || value === null) {
                    onChange([option.value])
                    return
                  }
                  const exists = value.includes(option.value)
                  const next = exists ? value.filter((item) => item !== option.value) : [...value, option.value]
                  onChange(next)
                }}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/30",
                  active
                    ? "border-transparent bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white"
                    : "border-[#E5E7EB] bg-[#FAFAFA] text-[#2E7D32] hover:border-[#2E7D32]/40",
                )}
                aria-pressed={active}
              >
                {option.label}
              </button>
            )
          })}
          {question.helperText && (
            <p className="w-full text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    case "textarea":
      return (
        <div className="space-y-2">
          <Label className="text-sm text-[#2E7D32]">Share details</Label>
          <Textarea
            value={typeof value === "string" ? value : ""}
            rows={4}
            placeholder={question.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="rounded-2xl border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm"
          />
          {question.helperText && (
            <p className="text-xs text-[#2E7D32]/80">{question.helperText}</p>
          )}
        </div>
      )
    default:
      return null
  }
}

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2E7D32]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#F3F4F6] bg-[#FAFAFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2E7D32]">{label}</span>
      <span className="text-sm font-semibold text-[#1A1A1A]">{value}</span>
    </div>
  )
}

function formatMaritalStatus(value: EnrollmentFormData["maritalStatus"]) {
  return getLabelForOption(MARITAL_OPTIONS, value)
}

function formatEducationLevel(value: EnrollmentFormData["educationLevel"]) {
  return getLabelForOption(EDUCATION_OPTIONS, value)
}

function getLabelForOption(options: QuizOption[], value: string) {
  const match = options.find((option) => option.value === value)
  return match ? match.label : value || "—"
}

function formatYesNo(value: boolean | null) {
  if (value === null) return "—"
  return value ? "Yes" : "No"
}

function formatRiskComfort(score: number) {
  const labels = ["Very low", "Low", "Moderate", "High", "Very high"]
  const index = Math.max(1, Math.min(5, score)) - 1
  return `${score}/5 · ${labels[index] ?? "Balanced"}`
}

function formatActivityLevel(score: number) {
  if (score >= 4) return "Very active"
  if (score <= 2) return "Sedentary"
  return "Balanced"
}
