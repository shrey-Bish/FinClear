import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const { transcript, currentData, userName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    // Read the static MD script file
    const scriptPath = path.join(process.cwd(), "src/content/survey-questions.md");
    let scriptContent = "";
    try {
      scriptContent = fs.readFileSync(scriptPath, "utf-8");
    } catch (e) {
      console.warn("Could not load script file precisely at", scriptPath, e);
      scriptContent = "Fallback Script Missing";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const SYSTEM_PROMPT = `You are a financial wellness assistant routing a user through an exact static interview script.
Here is the script of questions organized by Category:
---
${scriptContent}
---

Your TASK is to act as a strict state machine:
1. Examine the \`currentData\` collected so far.
2. Examine the user's latest \`transcript\` answer. Extract any answers corresponding to the script's IDs into your \`extractedData\`.
3. Determine what the next question should be:
   - ALWAYS start in "General". Read top to bottom.
   - If \`insuranceType\` has been answered (e.g. they chose "Health Insurance"), you MUST immediately transition to the subset of questions under that specific Category Heading.
   - You MUST pick the EXACT "text" of the next unanswered question in the script, and return it exactly word-for-word as your \`replyText\`. DO NOT make up your own conversational text.
4. If there are no more questions left in their specific category path, set \`isComplete: true\` and output a concluding \`replyText\` thanking them.

IMPORTANT: You MUST return ONLY a valid JSON object matching this exact schema (no markdown formatting):
{
  "replyText": "The EXACT text string of the next question from the script",
  "extractedData": {
    "age": 30, // example extraction
    "insuranceType": "Health Insurance" // example extraction
  },
  "isComplete": false
}`;

    const promptText = `
${SYSTEM_PROMPT}

User's Name: ${userName || "Friend"}
Currently extracted data (STATE): ${JSON.stringify(currentData || {})}

User's latest response: "${transcript}"

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
