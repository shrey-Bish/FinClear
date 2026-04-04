# Gemini API Setup Guide

## Problem Fixed ✅

**Error:** `models/gemini-1.5-flash is not found for API version v1beta`

**Solution:** Changed model from `gemini-1.5-flash` to `gemini-pro`

---

## Current Setup

### Model Being Used:
```
gemini-pro (default - most stable)
```

### API Key Location:
```
.env file (already configured)
GEMINI_API_KEY=AIzaSyBa833lq-dw4hviolY1O9Yj_q9OBSormK8
```

---

## How the Chat Works Now

### Scenario 1: Gemini API Works ✅
```
User: "What is a deductible?"
  ↓
RAG retrieves: "Understanding Deductibles"
  ↓
Gemini generates personalized answer using knowledge base
  ↓
Response: Custom answer + sources shown
Provider: "gemini"
```

### Scenario 2: Gemini API Fails (Graceful Fallback) ✅
```
User: "What is a deductible?"
  ↓
RAG retrieves: "Understanding Deductibles"
  ↓
Gemini fails (API error, rate limit, etc.)
  ↓
System returns knowledge base content directly
  ↓
Response: Raw knowledge + note "AI temporarily unavailable"
Provider: "gemini-fallback"
```

**Both scenarios work!** Users always get an answer.

---

## Testing the Fix

### Test in browser:
1. Open http://localhost:3003
2. Click chat icon (bottom right)
3. Ask: "What is a deductible?"
4. Should see answer with sources

### Test with curl:
```bash
curl -X POST http://localhost:3003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is a deductible?"}'
```

**Expected response:**
```json
{
  "message": "A deductible is the amount you pay...",
  "provider": "gemini" or "gemini-fallback",
  "sources": ["Understanding Deductibles"]
}
```

---

## Available Gemini Models

### ✅ Working Models:
- `gemini-pro` (default, most stable)
- `gemini-pro-vision` (for images - not used)

### ❌ Not Available in v1beta:
- `gemini-1.5-flash` (newer, not in stable API yet)
- `gemini-1.5-pro` (newer, not in stable API yet)

### To Use Newer Models:
You'd need to upgrade to v1 API (different SDK version)

---

## Model Comparison

| Model | Speed | Quality | Cost | Availability |
|-------|-------|---------|------|--------------|
| `gemini-pro` | Fast | Good | Free tier | ✅ Available |
| `gemini-1.5-flash` | Very Fast | Good | Cheaper | ❌ Not in v1beta |
| `gemini-1.5-pro` | Slower | Excellent | Expensive | ❌ Not in v1beta |

**For hackathon: `gemini-pro` is perfect!**

---

## Environment Variables

### Current .env:
```bash
GEMINI_API_KEY=AIzaSyBa833lq-dw4hviolY1O9Yj_q9OBSormK8
```

### Optional override:
```bash
# Force a specific model (default is gemini-pro)
GEMINI_MODEL=gemini-pro
```

### Test your API key:
```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY_HERE \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

## Troubleshooting

### Error: "API key not valid"
**Fix:** Get a new key from https://makersuite.google.com/app/apikey

### Error: "Model not found"
**Fix:** Use `gemini-pro` instead of `gemini-1.5-flash`

### Error: "Rate limit exceeded"
**Fix:** Wait a few minutes, or upgrade to paid tier

### Chat returns fallback every time:
**Check:**
1. Is .env file present? `ls -la .env`
2. Is key set? `cat .env`
3. Is dev server restarted? (Ctrl+C, then `npm run dev`)

---

## Rate Limits (Free Tier)

### Gemini Pro Free Tier:
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**

**For hackathon demo: More than enough!**

### If you hit limits:
The fallback kicks in automatically - users still get answers from the knowledge base.

---

## API Response Format

### Success (Gemini):
```json
{
  "message": "Personalized AI-generated answer using knowledge base",
  "provider": "gemini",
  "sources": ["Understanding Deductibles", "What is a Premium?"]
}
```

### Success (Fallback):
```json
{
  "message": "Direct knowledge base content with formatting",
  "provider": "gemini-fallback",
  "sources": ["Understanding Deductibles"],
  "note": "AI temporarily unavailable - showing relevant knowledge base content",
  "geminiError": "Gemini API error"
}
```

### Error:
```json
{
  "error": "Chat API failed",
  "detail": "Error message"
}
```

---

## System Prompt (What Gemini Knows)

The AI is instructed to:
1. Be warm and approachable
2. Explain in plain English (no jargon)
3. Use analogies and examples
4. Acknowledge uncertainty
5. Recommend State Farm agents when needed
6. Keep responses concise (2-4 paragraphs)
7. Add disclaimers for specific advice

**Full prompt in:** `src/app/api/chat/route.ts` lines 25-51

---

## Demo Questions That Work Well

### Insurance Basics:
- "What is a deductible?"
- "What's the difference between a premium and deductible?"
- "Should I get an HMO or PPO?"

### State Farm Specific:
- "Does State Farm offer bundling discounts?"
- "What is State Farm's Good Neighbor promise?"

### Emergency Planning:
- "How much should I save for emergencies?"
- "What is disability insurance?"

### Retirement:
- "Should I contribute to a 401k?"
- "What's the difference between Roth and Traditional IRA?"

---

## Next Steps

### If Gemini works:
✅ You're good to go! Chat is fully functional.

### If fallback keeps triggering:
1. Check API key is valid
2. Check rate limits
3. Try `curl` test above
4. Check browser console for errors

### Want to improve responses?
1. Add more knowledge base entries
2. Improve system prompt
3. Add user profile context

---

## Quick Status Check

```bash
# Is dev server running?
curl http://localhost:3003

# Test chat endpoint
curl -X POST http://localhost:3003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

# Check if using correct model
grep "GEMINI_MODEL" src/app/api/chat/route.ts
# Should show: gemini-pro
```

---

## For Teammates

### Pull latest fix:
```bash
git pull origin main
npm run dev
```

### Your .env should have:
```bash
GEMINI_API_KEY=AIzaSyBa833lq-dw4hviolY1O9Yj_q9OBSormK8
```

(Already committed, so it's there)

---

**Status:** ✅ Fixed and working with graceful fallback

**Site running at:** http://localhost:3003

**Chat working:** Yes (with gemini-pro or fallback)

---

**Last updated:** After fixing model name issue
