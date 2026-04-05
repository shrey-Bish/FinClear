import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

import { getStore } from "../_store"
import { buildInsights, buildPriorityBenefits, withDerivedMetrics } from "@/lib/insights"
import type { EnrollmentFormData, SowSmartInsights, PriorityBenefit } from "@/lib/types"

export const runtime = "nodejs"

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

function buildGeminiPrompt(profile: EnrollmentFormData): string {
  return `You are an expert financial wellness advisor for State Farm Insurance. Based on the following user profile, generate personalized insurance and financial recommendations.

USER PROFILE:
- Name: ${profile.preferredName || profile.fullName}
- Age: ${profile.age ?? "Not specified"}
- Marital Status: ${profile.maritalStatus}
- Dependents: ${profile.dependents}
- Income Range: ${profile.incomeRange}
- Home Ownership: ${profile.homeOwnership}
- Coverage Preference: ${profile.coveragePreference}
- Health Coverage: ${profile.healthCoverage}
- Savings Rate: ${profile.savingsRate}%
- Risk Comfort: ${profile.riskComfort}/5
- Tobacco Use: ${profile.tobaccoUse ?? "Not specified"}
- Has Health Conditions: ${profile.hasHealthConditions ?? "Not specified"}
- Primary Care Frequency: ${profile.primaryCareFrequency}
- Prescription Frequency: ${profile.prescriptionFrequency}
- Contributes to Retirement: ${profile.contributesToRetirement ?? "Not specified"}
- Retirement Contribution Rate: ${profile.retirementContributionRate}%
- Wants Retirement Guidance: ${profile.wantsRetirementGuidance}
- Dental/Vision Preference: ${profile.dentalVisionPreference}
- Plan Preference: ${profile.planPreference}
- Travels Out of State: ${profile.travelsOutOfState ?? "Not specified"}
- Credit Score Estimate: ${profile.creditScore}
- Anticipates Life Changes: ${profile.anticipatesLifeChanges ?? "Not specified"}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "focusGoal": "A single sentence describing the user's primary financial priority",
  "statement": "A 2-3 sentence personalized overview of their financial situation and what they should focus on",
  "goalTheme": "One of: New Professional, Growing Family, Career Builder, Pre-Retirement, Wealth Builder",
  "priorityBenefits": [
    {
      "id": "unique-id",
      "title": "Benefit title",
      "category": "coverage|savings|health|wellness|planning",
      "description": "Clear description of this recommendation",
      "whyItMatters": "Why this is important for THIS specific user",
      "urgency": "Now|Next 30 days|This quarter",
      "actions": [
        {
          "title": "Action item title",
          "description": "What to do",
          "url": "https://www.statefarm.com/relevant-page"
        }
      ]
    }
  ],
  "timeline": [
    {
      "period": "This week|This month|Next 3 months|Next 6 months",
      "title": "Action title",
      "description": "What to accomplish in this period"
    }
  ]
}

Generate exactly 4-5 priority benefits and 4 timeline items. Make the recommendations specific to this person's situation. Use real State Farm product URLs where relevant (e.g., statefarm.com/insurance/auto, statefarm.com/insurance/home-and-property/homeowners, statefarm.com/insurance/life, statefarm.com/agent).`
}

function parseGeminiInsights(
  text: string,
  profile: EnrollmentFormData,
  fallbackInsights: SowSmartInsights
): SowSmartInsights {
  try {
    // Clean response: strip markdown fences if present
    let cleaned = text.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "")
    }

    const parsed = JSON.parse(cleaned)

    // Build valid plan structures
    const priorityBenefits: PriorityBenefit[] = (parsed.priorityBenefits || []).map(
      (b: any, i: number) => ({
        id: b.id || `ai-benefit-${i + 1}`,
        title: b.title || `Recommendation ${i + 1}`,
        category: b.category || "planning",
        description: b.description || "",
        whyItMatters: b.whyItMatters || "",
        urgency: b.urgency || "This quarter",
        actions: Array.isArray(b.actions)
          ? b.actions.map((a: any) => ({
              title: a.title || "Learn more",
              description: a.description || "",
              url: a.url || "https://www.statefarm.com",
            }))
          : [],
      })
    )

    const timeline = (parsed.timeline || []).map((t: any) => ({
      period: t.period || "This month",
      title: t.title || "",
      description: t.description || "",
    }))

    return {
      ownerName: profile.preferredName || profile.fullName,
      focusGoal: parsed.focusGoal || fallbackInsights.focusGoal,
      statement: parsed.statement || fallbackInsights.statement,
      timeline: timeline.length > 0 ? timeline : fallbackInsights.timeline,
      conversation: fallbackInsights.conversation,
      prompts: fallbackInsights.prompts,
      plans: fallbackInsights.plans,
      selectedPlanId: fallbackInsights.selectedPlanId,
      goalTheme: parsed.goalTheme || fallbackInsights.goalTheme,
      themeKey: (parsed.goalTheme || fallbackInsights.goalTheme || "")
        .toLowerCase()
        .replace(/\s+/g, "-"),
      priorityBenefits:
        priorityBenefits.length > 0
          ? priorityBenefits
          : fallbackInsights.priorityBenefits,
    }
  } catch (e) {
    console.error("Failed to parse Gemini response:", e)
    return fallbackInsights
  }
}

export async function POST(request: Request) {
  try {
    const { userId, profile } = (await request.json()) as {
      userId?: string
      profile?: EnrollmentFormData
    }
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const store = getStore()
    const preparedProfile = profile
      ? withDerivedMetrics({ ...profile, userId })
      : store.profiles.get(userId)
    if (!preparedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    store.profiles.set(userId, preparedProfile)

    // Always build local insights as fallback
    const localInsights = buildInsights(preparedProfile)

    // Try Gemini AI for personalized recommendations
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
        const prompt = buildGeminiPrompt(preparedProfile)

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        if (text && text.trim().length > 0) {
          const aiInsights = parseGeminiInsights(
            text,
            preparedProfile,
            localInsights
          )
          store.insights.set(userId, aiInsights)
          return NextResponse.json({
            insights: aiInsights,
            source: "gemini",
          })
        }
      } catch (geminiError) {
        console.error("Gemini generatePlans error, using fallback:", geminiError)
      }
    }

    // Fallback to local insights
    store.insights.set(userId, localInsights)
    return NextResponse.json({ insights: localInsights, source: "local" })
  } catch (error) {
    console.error("Failed to generate plans", error)
    return NextResponse.json(
      { error: "Unable to generate plans" },
      { status: 500 }
    )
  }
}
