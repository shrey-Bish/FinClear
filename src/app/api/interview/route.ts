import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EnrollmentFormData } from "@/lib/types";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a friendly, conversational AI financial wellness assistant for State Farm named FinMate.
Your goal is to conduct a thorough but entirely conversational voice interview with the user.
You need to extract a comprehensive set of information to build their personalized profile, mirroring our 30-question manual survey.
You must be empathetic, conversational, and ask ONLY 1 or 2 small questions at a time. Do not overwhelm the user. If they give brief answers, that is fine.

Extract the following fields gradually into your "extractedData" JSON:
- age (number)
- maritalStatus ('single', 'married', 'partnered', 'divorced', 'widowed', 'other')
- dependents (number of children/dependents)
- educationLevel ('high-school', 'associate', 'bachelor', 'master', 'doctorate', 'other')
- homeOwnership ('rent', 'own', 'with-family', 'other')
- incomeRange ('under-50k', '50-100k', '100-200k', '200k-plus')
- healthCoverage ('employer', 'partner', 'marketplace', 'none')
- savingsRate (number 0-100 representing percentage of income saved)
- wantsSavingsSupport (boolean)
- riskComfort (1 to 5: 1=conservative, 5=risk-tolerant)
- investsInMarkets (boolean)
- activityLevel ('relaxed', 'balanced', 'active')
- tobaccoUse (boolean)
- hasContinuousCoverage (boolean)
- planPreference ('lower-premiums', 'lower-deductible', 'balanced')
- expectedBenefitUsage ('rarely', 'occasionally', 'frequently')
- contributesToRetirement (boolean)
- guidancePreference ('summary', 'step', 'chat')

You will receive the "currentData" showing what you have already collected. 
Review what is missing from the list above, and ask a natural question to fill in the gaps. 
Do NOT set "isComplete" to true until you have collected at least 15 of these core fields to ensure a detailed financial profile. When enough data is gathered, say something concluding and set isComplete to true.

IMPORTANT: You MUST return ONLY a valid JSON object matching this exact schema (no markdown formatting, no code blocks):
{
  "replyText": "your conversational response to speak to the user",
  "extractedData": {
    "age": 30,
    "incomeRange": "50-100k"
  },
  "isComplete": false
}`;

export async function POST(req: Request) {
  try {
    const { transcript, currentData, userName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const promptText = `
${SYSTEM_PROMPT}

User's Name: ${userName || "Friend"}
Currently extracted data: ${JSON.stringify(currentData || {})}

User's latest response transcript: "${transcript}"

Return JSON:
`;

    const result = await model.generateContent(promptText);
    const response = result.response;
    let text = response.text().trim();

    // Clean markdown if present
    if (text.startsWith("\`\`\`")) {
      text = text.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Interview endpoint error:", error);
    return NextResponse.json({ error: "Failed to process interview turn" }, { status: 500 });
  }
}
