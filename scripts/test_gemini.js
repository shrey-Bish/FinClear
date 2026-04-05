const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
  if (match) {
    apiKey = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say 'API works perfectly' if you can read this.");
    const response = await result.response;
    console.log("SUCCESS! Gemini responded:", response.text());
  } catch (err) {
    console.error("FAILED! Gemini Error:", err);
  }
}

testGemini();
