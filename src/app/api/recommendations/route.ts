import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

import { formatKnowledgeContext, retrieveRelevantKnowledge } from "@/lib/rag/knowledge-base"
import {
  formatOnboardingKnowledge,
  retrieveOnboardingKnowledge,
  summarizeQuestionSchema,
} from "@/lib/rag/onboarding-knowledge"

export const runtime = "nodejs"

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

type RecommendationRequest = {
  profile?: Record<string, any>
}

type RecommendationResponse = {
  recommendationTitle: string
  recommendationSummary: string
  reason: string
  policyExplanation: string
  peerChoices: string
  sectionConfidence: {
    recommendation: number
    reason: number
    policy: number
    peerChoices: number
  }
  sourceTitles: string[]
  provider: "gemini" | "fallback"
}

type GeminiRecommendationDraft = {
  recommendationTitle?: unknown
  recommendationSummary?: unknown
  reason?: unknown
  policyExplanation?: unknown
  peerChoices?: unknown
  sectionConfidence?: {
    recommendation?: unknown
    reason?: unknown
    policy?: unknown
    peerChoices?: unknown
  }
}

function profileToQuery(profile: Record<string, any>): string {
  const parts = [
    profile.insuranceType ? `insurance type ${profile.insuranceType}` : "",
    profile.housingStatus ? `housing ${profile.housingStatus}` : "",
    profile.hasCar ? `has car ${profile.hasCar}` : "",
    profile.carType ? `car type ${profile.carType}` : "",
    profile.biggestWorry ? `biggest worry ${profile.biggestWorry}` : "",
    profile.budget ? `budget ${profile.budget}` : "",
    profile.existingCoverage ? `existing coverage ${profile.existingCoverage}` : "",
    profile.ageRange ? `age range ${profile.ageRange}` : "",
  ].filter(Boolean)

  return parts.join(" | ") || "new user insurance recommendation"
}

function buildFallback(profile: Record<string, any>): RecommendationResponse {
  const firstName = profile.firstName || "there"
  const insuranceType = profile.insuranceType || "unsure"
  const isRenter = String(profile.housingStatus || "").includes("rent")
  const hasCar = profile.hasCar === "yes" || profile.hasCar === "planning" || insuranceType === "auto"

  let title = "Start with Renters + Auto Essentials"
  let summary = `${firstName}, based on your profile, begin with lean core protection and expand once your budget allows.`

  if (insuranceType === "life") {
    title = "Term Life + Core Protection Mix"
    summary = `${firstName}, your answers suggest adding term life while keeping practical property/auto essentials.`
  } else if (insuranceType === "renters" || isRenter) {
    title = "Renters-First Protection Plan"
    summary = `${firstName}, your profile strongly fits a renters-first plan with optional auto add-on.`
  } else if (hasCar) {
    title = "Auto-First Protection Plan"
    summary = `${firstName}, your profile suggests auto-first coverage with balanced deductibles and liability protection.`
  }

  return {
    recommendationTitle: title,
    recommendationSummary: summary,
    reason:
      "This recommendation is based on your selected insurance intent, housing and driving situation, budget range, and your top concern. These signals usually identify the most practical starting policy.",
    policyExplanation:
      "Your suggested policy combination prioritizes foundational protection first: liability and property coverage for common financial shocks, with options to add stronger limits or additional policies as your budget grows.",
    peerChoices:
      "Users in similar profiles commonly pick one core policy first, then add a second policy after 1-3 months. Renters profiles often start with renters insurance; active drivers typically prioritize auto liability plus uninsured motorist.",
    sectionConfidence: {
      recommendation: 72,
      reason: 74,
      policy: 70,
      peerChoices: 62,
    },
    sourceTitles: ["Fallback logic from onboarding profile"],
    provider: "fallback",
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function extractJsonObject(rawText: string): string {
  const cleanedFence = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  const firstBrace = cleanedFence.indexOf("{")
  const lastBrace = cleanedFence.lastIndexOf("}")

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Model response did not contain a JSON object")
  }

  return cleanedFence.slice(firstBrace, lastBrace + 1)
}

function toConfidence(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)))
  }
  return fallback
}

function parseGeminiJson(rawText: string): Omit<RecommendationResponse, "sourceTitles" | "provider"> {
  const jsonText = extractJsonObject(rawText)
  const parsed = JSON.parse(jsonText) as GeminiRecommendationDraft

  const recommendationTitle = cleanText(
    typeof parsed.recommendationTitle === "string" ? parsed.recommendationTitle : "Personalized Protection Plan"
  )
  const recommendationSummary = cleanText(
    typeof parsed.recommendationSummary === "string"
      ? parsed.recommendationSummary
      : "Based on your answers, start with the most practical core policy and expand coverage in stages."
  )
  const reason = cleanText(
    typeof parsed.reason === "string"
      ? parsed.reason
      : "This is selected from your coverage intent, budget, risk concern, and lifestyle profile."
  )
  const policyExplanation = cleanText(
    typeof parsed.policyExplanation === "string"
      ? parsed.policyExplanation
      : "The policy prioritizes essential protection first, then optional enhancements as affordability allows."
  )
  const peerChoices = cleanText(
    typeof parsed.peerChoices === "string"
      ? parsed.peerChoices
      : "Similar users often begin with one core policy and add another after improving budget confidence."
  )

  return {
    recommendationTitle,
    recommendationSummary,
    reason,
    policyExplanation,
    peerChoices,
    sectionConfidence: {
      recommendation: toConfidence(parsed.sectionConfidence?.recommendation, 82),
      reason: toConfidence(parsed.sectionConfidence?.reason, 80),
      policy: toConfidence(parsed.sectionConfidence?.policy, 78),
      peerChoices: toConfidence(parsed.sectionConfidence?.peerChoices, 72),
    },
  }
}

async function callGemini(profile: Record<string, any>): Promise<RecommendationResponse> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

  const query = profileToQuery(profile)
  const ragDocs = retrieveRelevantKnowledge(query, 6)
  const onboardingDocs = retrieveOnboardingKnowledge(profile, 8)

  const ragContext = formatKnowledgeContext(ragDocs)
  const onboardingContext = formatOnboardingKnowledge(onboardingDocs)
  const questionSchema = summarizeQuestionSchema()

  const prompt = `You are a financial insurance recommendation assistant for SowSmart.

TASK:
Create a recommendation screen response using this exact section flow:
1) Recommendation based on user input (include user name)
2) Reason for choosing that recommendation
3) Explain the policy in simple terms
4) What users generally pick in similar situation (heuristic, not guaranteed)

OUTPUT RULES:
- Return STRICT JSON only (no markdown)
- Keep each field concise and practical
- Do not invent exact legal/state-specific guarantees
- Mention State Farm context naturally
- If data is uncertain, be transparent
- sectionConfidence values must be integers from 0 to 100

JSON SCHEMA:
{
  "recommendationTitle": "string",
  "recommendationSummary": "string",
  "reason": "string",
  "policyExplanation": "string",
  "peerChoices": "string",
  "sectionConfidence": {
    "recommendation": "number 0-100",
    "reason": "number 0-100",
    "policy": "number 0-100",
    "peerChoices": "number 0-100"
  }
}

USER PROFILE:
${JSON.stringify(profile, null, 2)}

QUESTION SCHEMA:
${questionSchema}

RAG KNOWLEDGE:
${ragContext}

ONBOARDING KNOWLEDGE:
${onboardingContext}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  const parsed = parseGeminiJson(text)

  const sourceTitles = Array.from(
    new Set([...ragDocs.map((d) => d.title), ...onboardingDocs.map((d) => d.title)])
  ).slice(0, 10)

  return {
    recommendationTitle: parsed.recommendationTitle,
    recommendationSummary: parsed.recommendationSummary,
    reason: parsed.reason,
    policyExplanation: parsed.policyExplanation,
    peerChoices: parsed.peerChoices,
    sectionConfidence: parsed.sectionConfidence,
    sourceTitles,
    provider: "gemini",
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendationRequest
    const profile = body.profile || {}

    if (!profile || typeof profile !== "object") {
      return NextResponse.json({ error: "Missing or invalid profile" }, { status: 400 })
    }

    try {
      const recommendation = await callGemini(profile)
      return NextResponse.json(recommendation)
    } catch (error) {
      console.error("Gemini recommendation generation failed", error)
      return NextResponse.json(buildFallback(profile))
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate recommendation",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
