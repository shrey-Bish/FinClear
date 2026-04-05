# SowSmart - Quick Test Checklist (30 mins)

Use this for rapid testing before demo. Full details in `TESTING_PLAN.md`.

---

## 🚀 Setup (2 mins)
- [ ] `cd finmate && npm install`
- [ ] `.env` has `GEMINI_API_KEY=...`
- [ ] `npm run dev` starts successfully
- [ ] Open http://localhost:3000

---

## ✅ Core Flow Test (10 mins)

### Landing Page
- [ ] Shows "SowSmart" with 🌱 icon (GREEN theme, not red)
- [ ] Tagline: "Plant Good Financial Habits Early"
- [ ] Click "Start growing" → goes to survey

### Trust Passport
- [ ] First screen shows "Trust Passport"
- [ ] Lists 4+ data categories
- [ ] Must toggle "I understand" to continue
- [ ] Click Continue → starts actual survey

### Survey
- [ ] 6 sections load: Coverage, Health, Financial, Life Stage, Retirement, Experience
- [ ] Can answer questions (text, select, slider, boolean)
- [ ] Progress bar updates
- [ ] Back button works
- [ ] Complete survey → click "Generate My Plan"

### Dashboard
- [ ] Loading screen shows (~5 seconds)
- [ ] Dashboard appears with recommendations
- [ ] Can read personalized suggestions

### Chat
- [ ] Click chat icon (bottom nav or floating button)
- [ ] Type "What is a deductible?"
- [ ] Gets response in <3 seconds
- [ ] Response uses RAG context (mentions premium, coverage)
- [ ] Shows suggested questions

---

## 🔍 Critical Feature Checks (10 mins)

### Branding
- [ ] All text says "SowSmart" (NO FinMate/FinClear/LifeLens)
- [ ] Colors are GREEN (#2E7D32), not State Farm red
- [ ] Footer: "Built for State Farm Hackathon"

### Emergency Calculator
- [ ] Navigate dashboard → Find "Emergency Readiness"
  - **If missing:** Mark as critical gap
- [ ] Input: Income $5000, Expenses $3500, Savings $10,000
- [ ] Shows: "2.9 months" runway
- [ ] Shows risk level + savings recommendation

### State Farm Alignment
- [ ] Survey has auto/home insurance questions
  - **If missing:** Mark as gap
- [ ] Chat can answer insurance questions
- [ ] "Talk to Agent" button exists
  - **If missing:** Mark as gap

### Disclaimers
- [ ] Landing page footer: "not financial advice"
- [ ] Chat responses mention "consult professional"

---

## 🐛 Bug Checks (5 mins)

### Browser Console
- [ ] Open DevTools (F12) → Console tab
- [ ] NO red errors (warnings OK)
- [ ] Network tab: API calls return 200/201

### Error Handling
- [ ] Remove `GEMINI_API_KEY` from .env
- [ ] Restart server, try chat
- [ ] Should show fallback response (not crash)
- [ ] Restore API key

### Mobile View
- [ ] DevTools → Toggle device toolbar
- [ ] View as iPhone 12 Pro
- [ ] All text readable, buttons tappable
- [ ] Bottom nav shows correctly

---

## 📊 Gap Identification (3 mins)

Mark gaps found:

### CRITICAL (Demo-Breaking)
- [ ] Landing page shows wrong screen
- [ ] Survey crashes mid-flow
- [ ] Chat doesn't respond
- [ ] Dashboard empty after quiz
- [ ] Build fails

### HIGH (Missing Core Features)
- [ ] Emergency Calculator not integrated
- [ ] No auto/home insurance questions
- [ ] No "Talk to Agent" button
- [ ] No testimonials
- [ ] Wrong branding (FinMate still visible)

### MEDIUM (Polish Issues)
- [ ] Colors not fully updated
- [ ] Survey questions not State Farm relevant
- [ ] No profile summary card
- [ ] No risk visualization
- [ ] Tooltips/help missing

### LOW (Stretch Features)
- [ ] No voice mode
- [ ] No Auth0
- [ ] No multi-language
- [ ] No upload PDF feature

---

## 🎯 Demo Prep Notes

### What Works Well (Highlight These)
1. Trust Passport - unique data transparency
2. RAG-enhanced chat - smart, context-aware
3. Clean green theme - professional, memorable
4. Simple survey - easy to complete
5. AI recommendations - personalized

### What to Skip/Gloss Over
1. Voice mode (not implemented)
2. Upload PDF (if not working)
3. Complex insurance calculations (if basic)

### Talking Points for Judges
- **Innovation:** Trust Passport builds trust upfront
- **Technical:** Gemini API + RAG for accurate responses
- **Accessibility:** Simple language, mobile-first
- **Impact:** Emergency planning helps underserved communities

---

## ⏱️ Time Breakdown

| Phase | Time | What to Do |
|-------|------|------------|
| **0-2 min** | Setup | Install, start server |
| **2-12 min** | Core flow | Landing → Survey → Dashboard → Chat |
| **12-22 min** | Feature checks | Branding, calculator, SF alignment |
| **22-27 min** | Bug checks | Console, errors, mobile |
| **27-30 min** | Document gaps | Fill gap checklist |

---

## 📝 Output Template

After testing, create this summary:

```markdown
# Test Results Summary

## ✅ Working Features (X/10)
1. [Feature name] - [Status]
2. ...

## ❌ Critical Gaps (X)
1. [Gap] - Priority: Critical
2. ...

## 🔧 Recommended Fixes (Next 2 hours)
1. [Fix #1] - Est: 30 mins
2. [Fix #2] - Est: 45 mins
3. ...

## 💡 Demo Strategy
- Lead with: [Best feature]
- Show flow: [Step 1] → [Step 2] → [Step 3]
- Avoid: [Known issues]
```

---

## Quick Commands

```bash
# Start testing
npm run dev

# Check build (do this FIRST if demo is soon)
npm run build

# Type check (find TypeScript errors)
npm run typecheck

# Clear cache if weird issues
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

**Priority Order:**
1. Run Core Flow Test (10 min)
2. Check Critical Bugs (5 min)
3. Document gaps (5 min)
4. Fix top 2-3 critical gaps (remaining time)

**Goal:** Identify what needs fixing vs what to demo as-is.
