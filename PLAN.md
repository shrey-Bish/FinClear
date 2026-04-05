# SowSmart - Complete Project Context for LLMs

> Use this file as context when continuing development with any LLM.

---

## 🎯 Project Overview

**SowSmart** is a Gen Z-focused insurance platform built for **State Farm's Financial Wellness Hackathon**.

**Tagline:** "Plant good financial habits early"

**Problem:** Gen Z sees State Farm as "my parents' insurance" - slow, phone-based, confusing. They're choosing digital-first competitors like Lemonade because traditional processes take 2 weeks.

**Solution:** Lemonade's speed + State Farm's expertise + AI guidance = 2-minute signup with voice/text options.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animation:** Framer Motion
- **AI:** Google Gemini API + RAG (Retrieval Augmented Generation)
- **Voice:** ElevenLabs TTS for assistant playback + browser mic capture for speech input
- **State:** React useState + localStorage (no backend DB for hackathon)

---

## 📁 Project Structure

```
SowSmart/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main app - 3-screen state machine
│   │   ├── layout.tsx            # Root layout, fonts, metadata
│   │   └── api/
│   │       ├── chat/route.ts     # Gemini + RAG chat endpoint
│   │       ├── generatePlans/    # Insurance plan generation
│   │       └── insights/         # User insights API
│   │
│   ├── components/
│   │   ├── lemonade/             # ⭐ MAIN UI COMPONENTS
│   │   │   ├── LandingPage.tsx   # Hero, products, social proof
│   │   │   ├── ChatOnboarding.tsx # 7-9 question survey (text/voice)
│   │   │   ├── InsightsPage.tsx  # Results, recommendations
│   │   │   ├── VoiceAgent.tsx    # Voice conversation modal
│   │   │   └── index.ts          # Exports
│   │   │
│   │   ├── chat-modal.tsx        # AI Q&A modal overlay
│   │   ├── chat-panel.tsx        # Chat message display
│   │   ├── chat-screen.tsx       # Full chat interface
│   │   └── ui/                   # shadcn components (button, card, etc.)
│   │
│   ├── config/
│   │   └── questions.ts          # ⭐ SHARED QUESTIONS CONFIG
│   │                             # Used by both ChatOnboarding & VoiceAgent
│   │
│   └── lib/
│       ├── rag/
│       │   └── knowledge-base.ts # 18 insurance term explanations
│       ├── storage.ts            # localStorage helpers
│       ├── types.ts              # TypeScript interfaces
│       ├── user-context.tsx      # User state context
│       └── hooks/
│           └── useHydrated.ts    # SSR hydration hook
│
├── public/                       # Static assets
├── PLAN.md                       # THIS FILE - LLM context
├── README.md                     # Quick start guide
├── SUMMARY.md                    # Detailed implementation summary
└── package.json                  # Dependencies
```

---

## 🔑 Key Files Explained

### 1. `src/app/page.tsx` - Main App Router
```
Screens: landing → onboarding → insights
State: currentScreen, userData, showChat
Storage: localStorage for persistence
```

### 2. `src/config/questions.ts` - Questions Configuration
```typescript
// All questions defined here - shared between text chat and voice
export const QUESTIONS: Question[] = [
  { id: "name", content: "...", field: "firstName", inputType: "text" },
  { id: "age", content: "...", field: "ageRange", options: [...] },
  // ... 9 total questions
]

// Helper functions
export function getQuestionContent(q, userData, useVoice)
export function getFilteredQuestions(userData) // Skips questions based on answers
```

### 3. `src/components/lemonade/ChatOnboarding.tsx` - Text Survey
```
- Mode selection screen (text vs voice)
- 7-9 dynamic questions based on answers
- Chat bubble UI with typing animation
- Progress indicator (About you → Coverage → Quote)
- Reads from questions.ts config
```

### 4. `src/components/lemonade/VoiceAgent.tsx` - Voice Conversation
```
- Full-screen modal for voice interaction
- Uses ElevenLabs for spoken prompts + SpeechRecognition for mic input
- Same questions as text chat (from questions.ts)
- Visual audio feedback (waveform animation)
- Mute/unmute Nova's voice
```

### 5. `src/components/lemonade/InsightsPage.tsx` - Results
```
- Emergency runway calculator
- State Farm product recommendations
- Bundle discount logic (15% for 2+ plans)
- Voice explanation buttons
- "Talk to Agent" CTA
```

### 6. `src/lib/rag/knowledge-base.ts` - AI Knowledge
```typescript
// 18 entries covering insurance terms
export const KNOWLEDGE_BASE = [
  { term: "deductible", explanation: "..." },
  { term: "premium", explanation: "..." },
  { term: "liability", explanation: "..." },
  // ... State Farm products, financial terms
]
```

---

## 🎨 Design System

**Colors:**
- Primary: `#FF0080` (hot pink - Lemonade-inspired)
- Background: White
- Text: Gray-800, Gray-500, Gray-400

**Fonts:**
- Logo/Script: `Pacifico` (Google Fonts)
- Body: `Inter` (Google Fonts)

**UI Patterns:**
- Chat bubbles (AI left gray, User right pink)
- Progress dots
- Cards with hover effects
- Smooth Framer Motion animations
- Floating action buttons

---

## 🔄 User Flow

```
1. LANDING PAGE
   ├── Hero: "Forget everything you know about insurance"
  ├── Two CTAs: "Text Chat" | "Talk to Nova"
   ├── Product cards (Renters, Auto, Life, Health)
   └── Social proof (4.9 stars, reviews)

2A. TEXT CHAT (ChatOnboarding.tsx)
    ├── Mode selection screen
    ├── Question 1: Name (text input)
    ├── Question 2: Age range (options)
    ├── Question 3: Insurance type
    ├── Question 4: Housing status
    ├── Question 5: Has car?
    ├── Question 6: Car type (conditional - only if has car)
    ├── Question 7: Biggest worry
    ├── Question 8: Budget
    ├── Question 9: Existing coverage
    └── Complete → Insights

2B. VOICE AGENT (VoiceAgent.tsx)
    ├── "Start Conversation" button
    ├── Nova speaks questions aloud
    ├── User responds via microphone
    ├── Same questions as text chat
    └── Complete → Insights

3. INSIGHTS PAGE
   ├── Emergency runway (months of savings)
   ├── Recommended coverage cards
   ├── Bundle discount calculation
   ├── Voice explanation buttons
   └── "Talk to State Farm Agent" CTA
```

---

## 🤖 AI Integration

### Gemini API (`src/app/api/chat/route.ts`)
```typescript
// POST /api/chat
// Body: { message: string, context: object }
// Uses RAG to enhance responses with knowledge base
```

### RAG Flow:
1. User asks question
2. Search knowledge base for relevant terms
3. Inject context into Gemini prompt
4. Return simplified explanation

---

## 📊 Data Model

### User Data (localStorage)
```typescript
interface UserData {
  firstName: string
  ageRange: "18-24" | "25-34" | "35-44" | "45+"
  insuranceType: "renters" | "auto" | "life" | "unsure"
  housingStatus: "renting_apartment" | "renting_house" | "with_family" | "own"
  hasCar: "yes" | "no" | "planning"
  carType?: "used" | "newer" | "financed"
  biggestWorry: "theft" | "car_accident" | "medical" | "savings"
  budget: "under_50" | "50_100" | "100_200" | "200_plus"
  existingCoverage: "none" | "employer" | "parents" | "own"
  voiceMode: boolean
}
```

### Storage Keys
- `sowsmart_user_data` - User survey answers
- `sowsmart_onboarding_complete` - Boolean flag

---

## 🚀 Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## 🔧 Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional (future)
ELEVENLABS_API_KEY=your_elevenlabs_key
```

---

## ✅ Completed Features

- [x] Lemonade-style landing page
- [x] Text chat onboarding (7-9 questions)
- [x] Voice agent modal with ElevenLabs TTS
- [x] Shared questions config (questions.ts)
- [x] Dynamic question filtering (skip car type if no car)
- [x] Progress indicators
- [x] Insights page with recommendations
- [x] Emergency runway calculator
- [x] Bundle discount logic
- [x] RAG knowledge base (18 terms)
- [x] Gemini chat integration
- [x] localStorage persistence
- [x] Mobile-responsive design

---

## 🔜 TODO / Future Features

- [ ] ElevenLabs TTS integration (better voice quality)
- [ ] Real speech-to-text (currently using browser API)
- [ ] Auth0 login
- [ ] DynamoDB persistence
- [ ] More State Farm products
- [ ] Comparison charts
- [ ] Email quote feature
- [ ] Agent scheduling integration

---

## 🎯 Hackathon Judging Criteria

1. **Innovation** - Voice/text dual mode (industry first)
2. **Technical Execution** - Clean code, TypeScript, modern stack
3. **Accessibility** - Voice mode, simple language
4. **Real-World Impact** - Helps Gen Z get covered fast

---

## 🐛 Known Issues

1. Voice recognition accuracy varies by browser/accent
2. SpeechSynthesis voice quality is basic (needs ElevenLabs)
3. No error handling for API failures (demo app)
4. Mobile voice input needs testing

---

## 💡 Development Tips

### Adding New Questions
Edit `src/config/questions.ts`:
```typescript
{
  id: "new_question",
  content: "Your question text?",
  voiceContent: "Optional different phrasing for voice",
  options: [
    { label: "Option 1", value: "opt1", icon: "🎯" },
    { label: "Option 2", value: "opt2" },
  ],
  field: "fieldName", // Maps to userData
  skipIf: { field: "hasCar", value: "no" }, // Optional conditional
}
```

### Adding Knowledge Base Entries
Edit `src/lib/rag/knowledge-base.ts`:
```typescript
{
  term: "new term",
  explanation: "Simple explanation for Gen Z",
  relatedTerms: ["related1", "related2"],
}
```

### Styling
- Use Tailwind classes
- Primary pink: `bg-[#FF0080]`, `text-[#FF0080]`
- Use `motion.div` for animations

---

## 📞 State Farm Alignment

| Feature | State Farm Relevance |
|---------|---------------------|
| Renters insurance | Core product |
| Auto insurance | Core product (Drive Safe & Save™) |
| Life insurance | Core product |
| Bundle discounts | Real SF offering |
| Agent handoff | SF differentiator vs Lemonade |
| Trust/transparency | SF brand values |

---

## 🏆 Demo Script (2 minutes)

1. **Problem** (15s): "Gen Z is choosing Lemonade because State Farm takes 2 weeks"
2. **Solution** (15s): "SowSmart: 2-min signup with AI guidance"
3. **Demo** (60s):
   - Show landing page
  - Click "Talk to Nova" (voice) OR "Text Chat"
   - Answer 3-4 questions quickly
   - Show results page
   - Click voice explanation
   - Show agent CTA
4. **Differentiation** (30s): "Only platform with voice + State Farm expertise"

---

## 📝 Git Info

- **Branch:** `feature/genz-lemonade-revamp`
- **Main files changed:** 39 files, -8000 lines (cleanup), +2500 lines (new features)

---

*Last updated: April 2025*
*For State Farm Financial Wellness Hackathon*
