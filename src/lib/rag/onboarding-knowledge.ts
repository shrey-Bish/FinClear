import { QUESTIONS } from "@/config/questions"

export interface OnboardingKnowledgeEntry {
  id: string
  field: string
  value?: string
  title: string
  content: string
  tags: string[]
}

const QUESTION_OVERVIEW: OnboardingKnowledgeEntry = {
  id: "onboarding-question-overview",
  field: "overview",
  title: "SowSmart Onboarding Signals",
  content: `The onboarding flow captures the most decision-critical insurance signals in this order:
- ageRange: early-life stage and risk profile
- insuranceType: immediate intent (renters, auto, life, unsure)
- housingStatus: ownership context and renters fit
- hasCar and carType: auto coverage necessity and deductible tuning
- biggestWorry: emotional driver (theft, accidents, medical bills, low savings)
- budget: affordability ceiling and plan tier fit
- existingCoverage: switching friction and education need
These answers should be treated as primary personalization context when generating recommendations.`,
  tags: ["questions", "onboarding", "signals", "personalization"],
}

const FIELD_KNOWLEDGE: OnboardingKnowledgeEntry[] = [
  {
    id: "age-18-24",
    field: "ageRange",
    value: "18-24",
    title: "Age 18-24 Profile",
    content:
      "Users 18-24 often prioritize low monthly cost, renters protection, and first-time auto guidance. Explain tradeoffs clearly and avoid overloading with optional add-ons.",
    tags: ["age", "young", "budget", "starter coverage"],
  },
  {
    id: "age-25-34",
    field: "ageRange",
    value: "25-34",
    title: "Age 25-34 Profile",
    content:
      "Users 25-34 commonly optimize value: balanced premiums, practical deductibles, and bundle opportunities (renters+auto). They respond well to concrete monthly estimates.",
    tags: ["age", "value", "bundle", "balanced"],
  },
  {
    id: "age-35-plus",
    field: "ageRange",
    value: "35-44",
    title: "Age 35+ Protection Profile",
    content:
      "Users 35+ are more likely to evaluate household stability and long-term protection. Introduce life insurance and stronger liability limits where relevant.",
    tags: ["age", "life insurance", "liability", "long-term"],
  },
  {
    id: "insurance-renters",
    field: "insuranceType",
    value: "renters",
    title: "Renters Intent",
    content:
      "If renters is selected, focus on personal property, liability, temporary housing, and replacement-cost framing. Keep explanation practical: theft/fire/water incidents.",
    tags: ["renters", "personal property", "liability"],
  },
  {
    id: "insurance-auto",
    field: "insuranceType",
    value: "auto",
    title: "Auto Intent",
    content:
      "If auto is selected, prioritize liability baseline, collision/comprehensive fit, uninsured motorist protection, and deductible recommendations tied to budget.",
    tags: ["auto", "liability", "collision", "deductible"],
  },
  {
    id: "insurance-life",
    field: "insuranceType",
    value: "life",
    title: "Life Intent",
    content:
      "If life is selected, explain term life first, simple coverage sizing, and when permanent life may be explored. Keep it educational and non-salesy.",
    tags: ["life", "term", "beneficiaries"],
  },
  {
    id: "housing-renting",
    field: "housingStatus",
    value: "renting_apartment",
    title: "Renting Housing Signal",
    content:
      "Renting status is a strong indicator that renters insurance is a high-fit recommendation. Mention that landlord policies do not cover tenant belongings.",
    tags: ["housing", "renting", "renters insurance"],
  },
  {
    id: "car-yes",
    field: "hasCar",
    value: "yes",
    title: "Active Driver Signal",
    content:
      "If user drives, auto insurance should be primary or secondary recommendation with minimum legal compliance and practical protection layers.",
    tags: ["car", "driver", "auto"],
  },
  {
    id: "car-planning",
    field: "hasCar",
    value: "planning",
    title: "Pre-Purchase Driver Signal",
    content:
      "If planning to get a car, provide prep guidance: expected premium range, safe-driver programs, and early discount opportunities.",
    tags: ["car", "planning", "discounts"],
  },
  {
    id: "worry-theft",
    field: "biggestWorry",
    value: "theft",
    title: "Theft Concern",
    content:
      "If theft is the biggest worry, emphasize personal property and comprehensive auto coverage plus practical prevention tips.",
    tags: ["theft", "risk", "coverage"],
  },
  {
    id: "worry-accident",
    field: "biggestWorry",
    value: "car_accident",
    title: "Accident Concern",
    content:
      "If car accident is primary concern, explain liability limits, collision, uninsured motorist, and potential medical cost exposure.",
    tags: ["accident", "liability", "uninsured motorist"],
  },
  {
    id: "worry-medical",
    field: "biggestWorry",
    value: "medical",
    title: "Medical Cost Concern",
    content:
      "If medical bills are top concern, include supplemental protection context, emergency-fund relevance, and deductible planning guidance.",
    tags: ["medical", "deductible", "supplemental"],
  },
  {
    id: "worry-savings",
    field: "biggestWorry",
    value: "savings",
    title: "Savings Concern",
    content:
      "If no savings is a concern, prioritize budget-aligned baseline coverage and suggest building a starter emergency fund before expensive add-ons.",
    tags: ["savings", "budget", "emergency fund"],
  },
  {
    id: "budget-under-50",
    field: "budget",
    value: "under_50",
    title: "Budget Under $50",
    content:
      "For under $50 monthly budget, recommend one highest-fit core policy first, explain optional upgrades later, and focus on high-value essentials.",
    tags: ["budget", "starter", "affordability"],
  },
  {
    id: "budget-50-100",
    field: "budget",
    value: "50_100",
    title: "Budget $50-100",
    content:
      "For $50-100 monthly budget, suggest one full core policy and one light add-on option, including bundle discount possibilities.",
    tags: ["budget", "balanced", "bundle"],
  },
  {
    id: "budget-100-plus",
    field: "budget",
    value: "100_200",
    title: "Budget $100+",
    content:
      "For $100+ monthly budget, recommend stronger protection tiers, better liability limits, and discussion of long-term policies where relevant.",
    tags: ["budget", "enhanced", "protection"],
  },
  {
    id: "existing-none",
    field: "existingCoverage",
    value: "none",
    title: "No Existing Coverage",
    content:
      "If user has no current insurance, simplify decisions and start with a clear 'first policy' recommendation plus a low-friction next step.",
    tags: ["beginner", "first policy", "onboarding"],
  },
  {
    id: "existing-own",
    field: "existingCoverage",
    value: "own",
    title: "Existing Personal Coverage",
    content:
      "If user already has personal coverage, recommendation should focus on optimization: gaps, deductible fit, bundling, and premium efficiency.",
    tags: ["existing coverage", "optimization", "gaps"],
  },
  {
    id: "peer-behavior",
    field: "behavior",
    title: "Peer Pattern Heuristics",
    content: `General platform patterns (heuristic guidance, not guarantees):
- Renters + age 25-34 + budget 50_100 often start with renters policy and add auto next.
- HasCar=yes + biggestWorry=car_accident often choose higher liability and uninsured motorist.
- biggestWorry=savings + budget under_50 typically pick lean core coverage first and postpone add-ons.
- insuranceType=unsure users usually benefit from a two-policy shortlist with transparent tradeoffs.
Use wording like "many users in a similar profile tend to..." and avoid presenting these as hard statistics.`,
    tags: ["peer", "benchmark", "typical choices"],
  },
]

export function retrieveOnboardingKnowledge(profile: Record<string, unknown>, topK: number = 6): OnboardingKnowledgeEntry[] {
  const entries = [QUESTION_OVERVIEW, ...FIELD_KNOWLEDGE]
  const profilePairs = Object.entries(profile ?? {})

  const scored = entries.map((entry) => {
    let score = 0

    if (entry.field === "overview") {
      score += 2
    }

    for (const [field, value] of profilePairs) {
      const valueString = String(value)
      if (entry.field === field) {
        score += 8
        if (entry.value && entry.value === valueString) {
          score += 18
        }
      }

      const normalizedValue = valueString.toLowerCase()
      for (const tag of entry.tags) {
        const normalizedTag = tag.toLowerCase()
        if (normalizedValue.includes(normalizedTag) || normalizedTag.includes(normalizedValue)) {
          score += 3
        }
      }

      if (entry.content.toLowerCase().includes(normalizedValue) && normalizedValue.length > 2) {
        score += 2
      }
    }

    return { entry, score }
  })

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.entry)
}

export function formatOnboardingKnowledge(entries: OnboardingKnowledgeEntry[]): string {
  if (entries.length === 0) return ""

  const lines = entries.map((entry, index) => {
    return `${index + 1}. ${entry.title}\n${entry.content}`
  })

  return `Onboarding-context knowledge (derived from current questions model):\n${lines.join("\n\n")}`
}

export function summarizeQuestionSchema(): string {
  const mapped = QUESTIONS.map((q) => {
    const optionList = q.options?.map((o) => `${o.label}(${o.value})`).join(", ")
    return `- ${q.field}: ${q.content}${optionList ? ` | options: ${optionList}` : ""}`
  })

  return `Question schema used for personalization:\n${mapped.join("\n")}`
}
