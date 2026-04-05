# SowSmart | Insurance Made Simple for Gen Z

> 🌱 **Plant Good Financial Habits Early**

AI-powered insurance platform built for State Farm's Financial Wellness Hackathon. Helps Gen Z get covered in 2 minutes instead of 2 weeks.

---

## 🎯 The Problem

Gen Z sees State Farm as "my parents' insurance" - slow, phone-based, confusing. They're choosing digital-first competitors like Lemonade because traditional processes take 2 weeks.

## 💡 Our Solution

**SowSmart** = Lemonade's speed + State Farm's expertise + AI guidance

**The Flow:**
1. Choose your mode → Text chat (fast) or Voice mode (accessible)
2. 2-minute survey → Maya (AI) asks 7-9 personalized questions
3. Instant recommendations → State Farm coverage tailored to your life
4. Voice explanations → Tap any term to hear it explained
5. Agent handoff → Connect with local State Farm agent

---

## ✨ Key Features

- 🎙️ **Dual Mode**: Text or Voice chat
- 🤖 **AI-Powered**: Gemini + RAG knowledge base
- 📊 **Financial Wellness**: Emergency runway calculator
- 🏢 **State Farm Integration**: Real products, agent handoff
- ⚡ **2-Minute Signup**: Like Lemonade, not like traditional insurance

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Add your GEMINI_API_KEY
# Optional: add ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID for voice playback
npm run dev
```

Open http://localhost:3000

---

## 📁 Structure

```
src/
├── components/lemonade/    # Main UI
│   ├── LandingPage.tsx     # Hero
│   ├── ChatOnboarding.tsx  # Survey
│   └── InsightsPage.tsx    # Results
├── app/api/chat/          # Gemini + RAG
└── lib/rag/              # 18 insurance terms
```

---

## 🎨 Design

- **Pink** `#FF0080` - Lemonade-inspired
- **Fonts**: Pacifico (script) + Inter (body)
- **UX**: Chat bubbles, smooth animations

---

## 🎯 State Farm Questions

1. Name, Age, Insurance Type
2. Housing (renting/own)
3. Car ownership
4. Biggest worry
5. Budget, Existing coverage

Dynamic questions based on answers.

---

## 🤖 RAG Knowledge

18 entries: Deductible, Premium, Liability, Comprehensive, HSA, State Farm products, etc.

---

## 📊 Demo Script (30 sec)

1. Problem: Gen Z choosing Lemonade
2. Solution: 2-min signup + AI explanations
3. Demo: Click through survey
4. Differentiation: State Farm agents + speed

---

## 🏆 Winning Points

| Feature | Lemonade | SowSmart |
|---------|----------|----------|
| Speed | ✅ 90 sec | ✅ 2 min |
| Voice Mode | ❌ | ✅ |
| Explanations | ❌ | ✅ AI tutor |
| Agent Handoff | ❌ | ✅ State Farm |

---

**Built for State Farm Hackathon 2025**

🌱 Plant good financial habits early.
