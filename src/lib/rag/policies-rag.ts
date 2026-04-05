import policiesData from "../../../policies.json"

import type { EnrollmentFormData, SowSmartInsights, PriorityBenefit, PlanResource } from "@/lib/types"

interface RawPolicyDocument {
  policy_name?: string
  policy_code?: string
  policy_type?: string
  simple_description?: string
  ideal_for?: string[]
  when_to_recommend?: string[]
  simple_recommendation_script?: string
  estimated_premium_range?: string
  key_exclusions_summary?: string
}

export interface PolicyMatch {
  policy: RawPolicyDocument
  score: number
  reasons: string[]
}

function getPolicyDocuments(): RawPolicyDocument[] {
  const root = policiesData as {
    insurance_policy_documents?: RawPolicyDocument[]
  }
  return Array.isArray(root.insurance_policy_documents)
    ? root.insurance_policy_documents
    : []
}

function policyCategoryFor(type?: string): PriorityBenefit["category"] {
  switch ((type || "").toLowerCase()) {
    case "auto":
    case "homeowners":
    case "renters":
    case "umbrella":
    case "life":
    case "disability":
      return "coverage"
    case "health_supplement":
      return "health"
    default:
      return "planning"
  }
}

function policyUrlFor(type?: string): string {
  switch ((type || "").toLowerCase()) {
    case "auto":
      return "https://www.statefarm.com/insurance/auto"
    case "homeowners":
      return "https://www.statefarm.com/insurance/home-and-property/homeowners"
    case "renters":
      return "https://www.statefarm.com/insurance/home-and-property/renters"
    case "life":
      return "https://www.statefarm.com/insurance/life"
    case "umbrella":
      return "https://www.statefarm.com/insurance/liability/umbrella"
    case "disability":
      return "https://www.statefarm.com/insurance/health/disability"
    case "health_supplement":
      return "https://www.statefarm.com/insurance/health"
    default:
      return "https://www.statefarm.com/insurance"
  }
}

function buildSearchSignals(profile: EnrollmentFormData): string[] {
  const signals: string[] = []

  if (profile.homeOwnership === "own") signals.push("homeowners")
  if (profile.homeOwnership === "rent") signals.push("renters")
  if (profile.coveragePreference !== "self" || profile.dependents > 0) signals.push("life")
  if (profile.healthCoverage === "none" || profile.hasHealthConditions) signals.push("health_supplement")
  if (profile.expectedBenefitUsage === "frequently") signals.push("health_supplement")
  if (profile.disability) signals.push("disability")
  if (profile.travelsOutOfState || profile.needsInternationalCoverage) signals.push("umbrella")

  // Keep broader insurance context available
  signals.push("insurance", "coverage", "liability", "savings")

  return signals
}

function scorePolicyForProfile(
  policy: RawPolicyDocument,
  profile: EnrollmentFormData,
  signals: string[],
): PolicyMatch {
  const reasons: string[] = []
  let score = 0

  const policyType = (policy.policy_type || "").toLowerCase()
  const policyText = [
    policy.policy_name,
    policy.simple_description,
    ...(policy.ideal_for || []),
    ...(policy.when_to_recommend || []),
    policy.simple_recommendation_script,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  for (const signal of signals) {
    if (!signal) continue
    if (policyType === signal) {
      score += 14
      reasons.push(`type:${signal}`)
    }
    if (policyText.includes(signal)) {
      score += 5
      reasons.push(`text:${signal}`)
    }
  }

  if (profile.dependents > 0 && policyType === "life") {
    score += 8
    reasons.push("dependents")
  }

  if (profile.homeOwnership === "rent" && policyType === "renters") {
    score += 8
    reasons.push("renter")
  }

  if (profile.homeOwnership === "own" && policyType === "homeowners") {
    score += 8
    reasons.push("homeowner")
  }

  if ((profile.healthCoverage === "none" || profile.hasHealthConditions) && policyType === "health_supplement") {
    score += 8
    reasons.push("health-gap")
  }

  if (profile.disability && policyType === "disability") {
    score += 8
    reasons.push("income-protection")
  }

  return { policy, score, reasons: Array.from(new Set(reasons)) }
}

export function retrieveRelevantPoliciesForProfile(
  profile: EnrollmentFormData,
  topK: number = 4,
): PolicyMatch[] {
  const policies = getPolicyDocuments()
  if (!policies.length) return []

  const signals = buildSearchSignals(profile)
  return policies
    .map((policy) => scorePolicyForProfile(policy, profile, signals))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

export function formatPolicyContext(matches: PolicyMatch[]): string {
  if (!matches.length) return ""

  const text = matches
    .map((match, index) => {
      const policy = match.policy
      return `[Policy ${index + 1}]\nName: ${policy.policy_name || "Unknown"}\nCode: ${policy.policy_code || "N/A"}\nType: ${policy.policy_type || "general"}\nDescription: ${policy.simple_description || ""}\nIdeal For: ${(policy.ideal_for || []).join("; ")}\nRecommendation Script: ${policy.simple_recommendation_script || ""}\nPremium Range: ${policy.estimated_premium_range || ""}\nExclusions: ${policy.key_exclusions_summary || ""}`
    })
    .join("\n\n---\n\n")

  return `RELEVANT MATCHED POLICY DOCUMENTS:\n\n${text}\n\n---\n\n`
}

export function buildPolicyRagInsights(
  profile: EnrollmentFormData,
  fallbackInsights: SowSmartInsights,
  matches: PolicyMatch[],
): SowSmartInsights {
  if (!matches.length) return fallbackInsights

  const topMatches = matches.slice(0, 4)

  const policyBenefits: PriorityBenefit[] = topMatches.map((match, index) => {
    const policy = match.policy
    const actions: PlanResource[] = [
      {
        title: `Review ${policy.policy_name || "recommended policy"}`,
        description:
          policy.simple_recommendation_script ||
          "See coverage details and compare against your current needs.",
        url: policyUrlFor(policy.policy_type),
      },
    ]

    const urgency: PriorityBenefit["urgency"] =
      index === 0 ? "Now" : index === 1 ? "Next 30 days" : "This quarter"

    return {
      id: `policy-${policy.policy_code || policy.policy_type || index + 1}`,
      title: policy.policy_name || `Policy recommendation ${index + 1}`,
      category: policyCategoryFor(policy.policy_type),
      description: policy.simple_description || "Matched from policy knowledge base.",
      whyItMatters:
        policy.ideal_for?.[0] ||
        `Matched from your profile (${match.reasons.slice(0, 2).join(", ") || "profile fit"}).`,
      urgency,
      actions,
    }
  })

  const topPolicyName = topMatches[0]?.policy.policy_name || "priority protection"
  const policyNames = topMatches
    .map((m) => m.policy.policy_name)
    .filter((name): name is string => Boolean(name))

  const timeline = policyBenefits.slice(0, 3).map((benefit) => ({
    period: benefit.urgency,
    title: benefit.title,
    description: benefit.description,
  }))

  return {
    ...fallbackInsights,
    focusGoal: `Prioritize policy-fit guidance starting with ${topPolicyName}.`,
    statement: `SowSmart matched your survey profile with policy documents and found the strongest fit in ${policyNames.join(", ")}. Review these options first to align protection and affordability.`,
    timeline,
    priorityBenefits: policyBenefits,
    prompts: [
      `Why is ${topPolicyName} my top match?`,
      "What exclusions should I watch out for in these recommendations?",
      "Can you compare these matched policies to my current coverage?",
    ],
  }
}
