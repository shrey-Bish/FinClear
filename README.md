# FinMate - State Farm Financial Wellness Platform

> 🏆 **State Farm Hackathon Project** - AI-Powered Financial Wellness for Underserved Communities

FinMate helps users make confident financial decisions through personalized AI guidance, insurance education, and emergency planning tools.

## 🎯 Features

- **Smart Financial Survey** - Collects user profile to personalize recommendations
- **AI Chat Assistant** - Gemini-powered financial literacy chatbot
- **Emergency Readiness Calculator** - Shows financial runway and savings goals
- **Trust Passport** - Transparent data collection with privacy controls
- **Personalized Dashboard** - Risk scores, recommendations, and action items

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
finmate/
├── src/
│   ├── app/           # Next.js pages and API routes
│   ├── components/    # React components
│   ├── lib/           # Utilities, types, hooks
│   └── styles/        # Global CSS (State Farm theme)
├── public/            # Static assets
├── PLAN.md           # Implementation plan (6 phases)
└── package.json
```

## 🎨 State Farm Theme

- Primary: `#E31837` (State Farm Red)
- Secondary: `#C41230`
- Background: `#FFFFFF`
- Text: `#1A1A1A`

## 📋 Implementation Plan

See [PLAN.md](./PLAN.md) for the 6-phase implementation roadmap.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI + Framer Motion
- **AI**: Google Gemini API
- **Storage**: localStorage (hackathon MVP)

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript checks |

## 👥 Team

Built for State Farm's Financial Wellness track at the hackathon.

---

*Disclaimer: This is an educational tool, not financial advice. Consult a licensed professional for financial decisions.*
