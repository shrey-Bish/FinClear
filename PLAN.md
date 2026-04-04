# Plan: FinMate State Farm Hackathon MVP

## TL;DR
Retheme the existing LifeLens/codelinc10 Next.js app to State Farm branding, swap AI backend to Gemini, add Emergency Readiness Calculator, and polish for demo. The repo already has Quiz, Chat, Dashboard, and Insights — we're mostly reskinning and swapping integrations.

---

## Decisions Made
- ✅ **Cut Solana/blockchain** entirely
- ✅ **localStorage** for data (already in repo) — no DynamoDB
- ✅ **Auth0 as P2** stretch goal
- ✅ **Voice (ElevenLabs) as P2** stretch goal
- ✅ **Gemini API** instead of AWS Bedrock/Claude

---

## Phase 1: Setup & State Farm Theming (Hours 1-4) — Person 1

### Steps
1. Navigate to project: `cd /Users/shrey/Downloads/FinClear/codelinc10/codelinc10`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev` (verify at http://localhost:3000)
4. **Retheme globals.css** — Replace Lincoln Financial colors with State Farm:
   - Primary: `#E31837` (State Farm red)
   - Secondary: `#C41230` (darker red)
   - Background: `#FFFFFF`
   - Text: `#1A1A1A`
   - Accent: Keep subtle orange `#FF4F00` for CTAs
5. **Update landing-screen.tsx**:
   - Replace "Lincoln Financial" with "State Farm"
   - Replace "FinMate" with "FinMate by State Farm" or keep FinMate
   - Update header logo text
   - Update footer text
6. **Add State Farm logo** (optional): Can use text-based "StateFarm" with red styling
7. **Update fonts** if desired (State Farm uses clean sans-serif, current Avenir is fine)
8. **Add "Talk to an Agent" button** to dashboard footer

### Files to Modify
- `src/styles/globals.css` — Color variables (lines 6-50)
- `src/components/landing-screen.tsx` — Branding text, colors
- `src/components/bottom-nav.tsx` — Navigation styling
- `src/components/insights-dashboard.tsx` — Dashboard theming

---

## Phase 2: Survey Flow Enhancement (Hours 1-3) — Person 2 (*parallel with Phase 1*)

### Steps
1. Review existing quiz in `DynamicQuiz.tsx` — already comprehensive
2. **Add financial wellness questions** if missing:
   - Emergency fund status
   - Monthly savings rate
   - Insurance coverage gaps
3. **Add Trust Passport modal** on quiz start:
   - Show what data is collected
   - Explain why each field matters
   - Add privacy reassurance text
4. **Update quiz section labels** to be more State Farm-aligned (insurance focus)

### Files to Modify
- `src/lib/quiz.ts` — Question definitions
- `src/components/DynamicQuiz.tsx` — Add Trust Passport modal before quiz
- `src/lib/types.ts` — Add new form fields if needed

---

## Phase 3: Swap to Gemini API (Hours 3-6) — Person 2 (*depends on Phase 2*)

### Steps
1. **Create Gemini API route** at `src/app/api/gemini/route.ts`:
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
   - Pass API key via env var `GEMINI_API_KEY`
2. **Update chat route** (`src/app/api/chat/route.ts`):
   - Replace Bedrock/Claude calls with Gemini
   - OR add Gemini as primary, keep Claude as fallback
3. **Create recommendation prompt template**:
   - Input: User profile JSON from survey
   - Output: Structured JSON with recommendations for health plan, retirement, emergency fund
4. **Update generatePlans route** to use Gemini
5. **Add financial literacy context** to chat:
   - Insurance terms glossary
   - State Farm product knowledge (generic)
   - Add disclaimer to responses

### Files to Modify
- `src/app/api/chat/route.ts` — Swap to Gemini
- `src/app/api/generatePlans/route.ts` — Use Gemini for recommendations
- `.env.local` — Add `GEMINI_API_KEY`

---

## Phase 4: Emergency Readiness Calculator (Hours 4-8) — Person 3 (*parallel with Phases 2-3*)

### Steps
1. **Create new component** `src/components/emergency-calculator.tsx`:
   - Inputs: Monthly income, Monthly expenses, Current savings
   - Calculation: `runwayMonths = savings / expenses`
   - Visual: Progress bar + months display
   - Recommendations based on runway
2. **Add to dashboard** as a prominent card/section
3. **Create savings goal feature**:
   - Target: 6 months expenses
   - Calculate monthly savings needed
   - Show timeline to goal
4. **Style to match State Farm theme**

### Calculator Logic
```
If runwayMonths < 1: "Critical - Focus on building emergency fund immediately"
If runwayMonths < 3: "At Risk - Aim for 3 months coverage"
If runwayMonths < 6: "Building - Good progress, target 6 months"
If runwayMonths >= 6: "Protected - Strong financial cushion"
```

### Files to Create/Modify
- `src/components/emergency-calculator.tsx` — NEW
- `src/components/insights-dashboard.tsx` — Add calculator section
- `src/lib/types.ts` — Add emergency fund types

---

## Phase 5: Dashboard Polish (Hours 8-12) — All (*depends on Phases 2-4*)

### Steps
1. **Consolidate dashboard view** with:
   - Profile summary card
   - AI Recommendations summary
   - Emergency readiness score (visual gauge)
   - Quick actions: "Chat with AI", "Recalculate", "Update Profile"
2. **Add risk score visualization** (already exists in insights-visualization.tsx)
3. **Add "Confused? Get help" floating button** (triggers simplified explanations or chat)
4. **Add "Talk to a State Farm Agent" CTA** with link to statefarm.com/agent
5. **Add testimonials section** with mock reviews

### Files to Modify
- `src/components/insights-dashboard.tsx`
- `src/components/personalized-dashboard.tsx`
- `src/app/page.tsx` — Main app orchestration

---

## Phase 6: Polish & Stretch Goals (Hours 12-15) — All

### P1 Polish
1. Loading states and error handling
2. Mobile responsiveness check
3. Add prominent disclaimers: "Educational purposes only, not financial advice"
4. Final demo flow rehearsal

### P2 Stretch - Auth0 (if time)
1. Install: `npm install @auth0/nextjs-auth0`
2. Create API routes: `/api/auth/[...auth0]`
3. Wrap app in Auth0Provider
4. Replace fake login modal with Auth0

### P2 Stretch - Voice (if time)
1. Add ElevenLabs TTS for reading recommendations
2. Add toggle button "Read aloud"

---

## Verification Checklist

1. [ ] `npm run dev` starts without errors
2. [ ] Landing page shows State Farm branding (red theme)
3. [ ] Survey saves to localStorage (check DevTools > Application > Local Storage)
4. [ ] Chat sends to Gemini and returns response
5. [ ] Emergency calculator shows correct runway calculation
6. [ ] Dashboard displays all sections
7. [ ] `npm run build` succeeds (production ready)
8. [ ] Demo flow: Landing → Survey → Recommendations → Chat → Dashboard works end-to-end

---

## Team Assignment Summary

| Person | Hours 1-4 | Hours 4-8 | Hours 8-12 | Hours 12-15 |
|--------|-----------|-----------|------------|-------------|
| **1** | Theming + Branding | Continue styling | Dashboard UI | Polish |
| **2** | Survey + Trust Passport | Gemini API integration | Dashboard logic | Auth0 (stretch) |
| **3** | Project setup, explore | Emergency Calculator | Dashboard integration | Voice (stretch) |

---

## Environment Variables Needed

```
GEMINI_API_KEY=your_gemini_api_key
# Optional stretch:
AUTH0_SECRET=
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/styles/globals.css` | Theme colors (lines 6-50) |
| `src/components/landing-screen.tsx` | Landing page branding |
| `src/components/DynamicQuiz.tsx` | Survey flow |
| `src/components/chat-panel.tsx` | Chat interface |
| `src/components/insights-dashboard.tsx` | Main dashboard |
| `src/app/api/chat/route.ts` | Chat API (swap to Gemini) |
| `src/lib/quiz.ts` | Quiz question definitions |
| `src/lib/storage.ts` | localStorage helpers |
