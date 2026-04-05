import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { retrieveRelevantKnowledge, formatKnowledgeContext } from "@/lib/rag/knowledge-base"
import {
  formatOnboardingKnowledge,
  retrieveOnboardingKnowledge,
  summarizeQuestionSchema,
} from "@/lib/rag/onboarding-knowledge"

export const runtime = "nodejs"

type ChatRequest = { 
  prompt: string
  userId?: string
  sessionId?: string
  context?: Record<string, unknown>
  userProfile?: Record<string, unknown>
}
type ChatOK = { message: string; provider: "gemini" | "gemini-fallback"; sources?: string[]; note?: string; suggestions?: string[] }
type ChatERR = { error: string; detail?: unknown; status?: number }

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

// Generate follow-up suggestions based on the conversation
function generateSuggestions(prompt: string, response: string): string[] {
  const promptLower = prompt.toLowerCase()
  
  // Topic-specific suggestions
  if (promptLower.includes("deductible") || promptLower.includes("premium")) {
    return [
      "What's the right deductible for my income?",
      "How do HSA accounts help with health costs?",
      "Should I choose HMO or PPO?"
    ]
  }
  if (promptLower.includes("emergency") || promptLower.includes("savings")) {
    return [
      "How much should I save each month?",
      "What's the 50/30/20 budgeting rule?",
      "How do I start an emergency fund?"
    ]
  }
  if (promptLower.includes("insurance") || promptLower.includes("coverage")) {
    return [
      "What types of insurance do I need?",
      "How does life insurance work?",
      "What is renters insurance?"
    ]
  }
  if (promptLower.includes("retirement") || promptLower.includes("401k") || promptLower.includes("ira")) {
    return [
      "What's the difference between 401k and IRA?",
      "How much should I save for retirement?",
      "Should I do Roth or Traditional?"
    ]
  }
  if (promptLower.includes("health") || promptLower.includes("medical")) {
    return [
      "What's the difference between HMO and PPO?",
      "How do I choose the right health plan?",
      "What is an HSA and should I get one?"
    ]
  }
  
  // Default suggestions for general queries
  return [
    "Help me understand my insurance options",
    "How do I build an emergency fund?",
    "What benefits should I prioritize?"
  ]
}
const SYSTEM_PROMPT = `You are SowSmart, a friendly and knowledgeable financial wellness assistant powered by State Farm. Your role is to help users understand insurance, benefits, and financial planning in simple, clear terms.

GUIDELINES:
1. Be warm, approachable, and encouraging - many users feel overwhelmed by financial decisions
2. Explain insurance and financial concepts in plain English, avoiding jargon
3. When relevant, use analogies and real-world examples
4. Always acknowledge uncertainty - if you're not 100% sure, say so
5. Encourage users to speak with a licensed State Farm agent for personalized advice
6. Focus on education and empowerment, not sales
7. Keep responses concise (2-4 paragraphs max) unless the user asks for more detail
8. If the user seems confused, offer to explain differently or break it down further

IMPORTANT DISCLAIMERS (include when giving specific advice):
- "This is general guidance, not personalized financial or insurance advice."
- "For coverage decisions, please consult with a licensed State Farm agent."
- "Your specific situation may vary - consider speaking with a financial advisor."

TOPICS YOU CAN HELP WITH:
- Health insurance (deductibles, premiums, HMO vs PPO, HSA/FSA)
- Life insurance basics (term vs whole life)
- Auto and home insurance fundamentals
- Emergency fund planning
- Retirement savings basics (401k, IRA)
- Benefits enrollment decisions
- Understanding insurance claims

TONE: Like a helpful neighbor who happens to know a lot about insurance - friendly, patient, and genuinely wanting to help.`

function buildPromptWithRAG(userPrompt: string, userProfile?: ChatRequest["userProfile"]): { prompt: string; sources: string[] } {
  // Retrieve relevant knowledge
  const relevantDocs = retrieveRelevantKnowledge(userPrompt, 3)
  const onboardingDocs = retrieveOnboardingKnowledge((userProfile ?? {}) as Record<string, unknown>, 5)
  const knowledgeContext = formatKnowledgeContext(relevantDocs)
  const onboardingContext = formatOnboardingKnowledge(onboardingDocs)
  const questionSchema = summarizeQuestionSchema()
  const sources = [...relevantDocs.map((d) => d.title), ...onboardingDocs.map((d) => d.title)]

  // Build personalized context if profile available
  let profileContext = ""
  if (userProfile) {
    const parts: string[] = []
    Object.entries(userProfile).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        parts.push(`${key}: ${String(value)}`)
      }
    })
    if (parts.length > 0) {
      profileContext = `\nUSER PROFILE (use to personalize advice):\n${parts.join(", ")}\n`
    }
  }

  const fullPrompt = `${SYSTEM_PROMPT}

${knowledgeContext}

${onboardingContext}

${questionSchema}${profileContext}
USER QUESTION: ${userPrompt}

Please provide a helpful, clear response. If the knowledge base above contains relevant information, use it to inform your answer. Always be honest about limitations.`

  return { prompt: fullPrompt, sources }
}

async function callGemini(userPrompt: string, userProfile?: ChatRequest["userProfile"]): Promise<ChatOK> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw { error: "GEMINI_API_KEY not configured", status: 500 } as ChatERR
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

  const { prompt, sources } = buildPromptWithRAG(userPrompt, userProfile)

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw { error: "Gemini returned empty response", status: 500 } as ChatERR
    }

    const responseText = text.trim()
    return {
      message: responseText,
      provider: "gemini",
      sources: sources.length > 0 ? sources : undefined,
      suggestions: generateSuggestions(userPrompt, responseText)
    }
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number }
    if (error?.message?.includes("API key")) {
      throw { error: "Invalid Gemini API key", status: 401, detail: error.message } as ChatERR
    }
    throw { error: "Gemini API error", status: 500, detail: error?.message || String(err) } as ChatERR
  }
}

// Fallback to simple response if Gemini fails
function getFallbackResponse(prompt: string): ChatOK {
  const relevantDocs = retrieveRelevantKnowledge(prompt, 2)
  
  if (relevantDocs.length > 0) {
    const doc = relevantDocs[0]
    return {
      message: `Based on our knowledge base:\n\n**${doc.title}**\n\n${doc.content}\n\n---\n*For personalized advice, please speak with a State Farm agent.*`,
      provider: "gemini-fallback",
      sources: [doc.title],
      note: "AI temporarily unavailable - showing relevant knowledge base content",
      suggestions: generateSuggestions(prompt, doc.content)
    }
  }

  return {
    message: `I'm having trouble connecting to my AI service right now. Here are some things I can help you with:

• **Insurance basics** - deductibles, premiums, coverage types
• **Health plans** - HMO vs PPO, HSA accounts
• **Emergency planning** - building savings, protecting income
• **Retirement** - 401(k), IRA options

Please try asking your question again, or speak with a State Farm agent for immediate assistance.`,
    provider: "gemini-fallback",
    note: "AI service temporarily unavailable",
    suggestions: [
      "What is a deductible?",
      "How do I choose health insurance?",
      "Help me understand 401(k)"
    ]
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest
    
    if (!body?.prompt || typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: "Missing or empty 'prompt'" }, { status: 400 })
    }

    const userPrompt = body.prompt.trim()

    try {
      const response = await callGemini(userPrompt, body.userProfile)
      return NextResponse.json(response, { status: 200 })
    } catch (geminiError) {
      // Log error but provide graceful fallback
      console.error("Gemini error:", geminiError)
      const fallback = getFallbackResponse(userPrompt)
      return NextResponse.json({ 
        ...fallback, 
        geminiError: (geminiError as ChatERR)?.error || "Unknown error"
      }, { status: 200 })
    }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return NextResponse.json(
      { error: "Chat API failed", detail: error?.message || String(err) },
      { status: 500 }
    )
  }
}

