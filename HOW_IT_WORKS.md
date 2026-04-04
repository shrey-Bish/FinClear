# FinMate - How It Works (Simple Guide)

## What is FinMate?
FinMate is a financial wellness app built for the State Farm hackathon. It helps people make smart decisions about insurance, emergency savings, and financial planning.

---

## 🎯 Main Goal
Help users understand:
- What insurance they need
- How much emergency savings to have
- Get AI-powered answers to financial questions

---

## 🔄 User Journey (Step-by-Step)

### Step 1: Landing Page (`src/app/page.tsx`)
**What happens:**
- User sees State Farm branding with red colors (#E31837)
- Big headline: "Like a good neighbor, your financial future is here"
- Three preview cards show what FinMate can do
- "Get Started" button to begin

**Files involved:**
- `src/components/landing-screen.tsx` - The welcome page
- `src/styles/globals.css` - State Farm colors

---

### Step 2: Trust Passport (`src/components/DynamicQuiz.tsx`)
**What happens:**
- Before asking questions, we show what data we collect
- User sees:
  - Income information (why: to size recommendations)
  - Dependents & coverage needs (why: to personalize plans)
  - Risk preferences (why: to match comfort level)
  - Goals (why: to prioritize advice)
- Privacy promise: "Your data stays on your device"
- User clicks "I understand, continue" to proceed

**Why it matters:**
- Builds trust (State Farm cares about transparency)
- Users feel in control of their data

**Files involved:**
- `src/components/DynamicQuiz.tsx` - Lines 41-67 (TRUST_PASSPORT_ITEMS)
- Phase: "trust" → Shows before survey

---

### Step 3: Financial Survey (`src/components/DynamicQuiz.tsx`)
**What happens:**
- User answers ~25 questions across 7 sections:
  1. **Coverage & Family** - Who needs protection? Spouse? Kids?
  2. **Health & Wellness** - Activity level, health conditions, doctor visits
  3. **Financial & Plan Preference** - Income range, budget, risk comfort
  4. **Life Stage** - Expecting changes? Travel plans?
  5. **Retirement** - Contributing to 401k? Want guidance?
  6. **Plan Experience** - Confident with insurance terms?
  7. **Final Preferences** - How much guidance do you want?

**Data collected:**
- Income range (e.g., $50-100k)
- Dependents count
- Risk tolerance (1-5 slider)
- Coverage preference (self, family, spouse)
- Savings rate, retirement contributions, etc.

**Files involved:**
- `src/lib/quiz.ts` - All question definitions
- `src/lib/types.ts` - Data structure (EnrollmentFormData)
- `src/lib/enrollment.ts` - Default values

**Data storage:**
- Saved to `localStorage` (no database for hackathon)
- Key: Based on user email or session

---

### Step 4: AI Analysis (`src/lib/insights.ts`)
**What happens behind the scenes:**
- System calculates:
  - Risk factor score
  - Coverage complexity (low/medium/high)
  - Activity risk modifier
- Builds personalized recommendations
- Creates priority benefits list

**Files involved:**
- `src/lib/insights.ts` - `buildInsights()` function
- Calculates metrics like "months of emergency runway"

---

### Step 5: Dashboard / Results (Currently being built)
**What user sees:**
- Recommended insurance plans
- Emergency readiness score
- Personalized financial priorities
- AI chat assistant for questions

**Files involved:**
- Dashboard components (various)
- Emergency calculator (Phase 4 - in progress)

---

## 🤖 AI Chat Assistant (Gemini + RAG)

### How it works:
1. **User asks a question** (e.g., "What's a deductible?")
2. **RAG retrieval** searches knowledge base for relevant info
3. **Gemini AI** gets:
   - User's question
   - Relevant insurance knowledge
   - User's profile (age, income, dependents, risk)
4. **AI responds** with personalized, easy-to-understand answer
5. **Sources shown** so user can verify

### Knowledge Base Topics:
- Insurance basics (deductibles, premiums, copays)
- Health plans (HMO vs PPO, HSA)
- Life insurance (term vs whole)
- Auto/home insurance
- Emergency fund planning
- Retirement (401k, IRA)
- State Farm products

**Files involved:**
- `src/lib/rag/knowledge-base.ts` - 16 insurance education entries
- `src/app/api/chat/route.ts` - Gemini API + RAG logic
- `src/components/chat-modal.tsx` - Chat UI

**Example conversation:**
```
User: "Should I get a high deductible plan?"
AI: "Based on your low risk tolerance and family coverage, 
     a lower deductible plan might be better. Here's why..."
     [Sources: Understanding Deductibles, HMO vs PPO]
```

---

## 🔑 Key Technical Features

### 1. **State Farm Theming**
- Primary color: `#E31837` (State Farm red)
- Typography: Clean, friendly
- Messaging: "Like a good neighbor" throughout

### 2. **RAG (Retrieval-Augmented Generation)**
- Keyword-based search of knowledge base
- Top 3 relevant entries injected into AI prompt
- Prevents hallucinations - AI answers from real content

### 3. **No Database (Hackathon Speed)**
- All data in `localStorage`
- No backend complexity
- Easy to demo

### 4. **Graceful Fallbacks**
- If Gemini API fails → show knowledge base content
- If user data missing → use smart defaults

---

## 📁 File Structure (Key Files)

```
finmate/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Page title, metadata
│   │   ├── page.tsx               # Landing page
│   │   └── api/
│   │       └── chat/route.ts      # Gemini API + RAG
│   ├── components/
│   │   ├── landing-screen.tsx     # Welcome screen
│   │   ├── DynamicQuiz.tsx        # Survey + Trust Passport
│   │   ├── chat-modal.tsx         # AI chat interface
│   │   └── emergency-calculator.tsx # Emergency fund tool (Phase 4)
│   ├── lib/
│   │   ├── quiz.ts                # All survey questions
│   │   ├── insights.ts            # Recommendation engine
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── chat.ts                # Chat client
│   │   └── rag/
│   │       └── knowledge-base.ts  # 16 insurance education entries
│   └── styles/
│       └── globals.css            # State Farm colors
├── .env.local                     # GEMINI_API_KEY (you create this)
└── package.json                   # Dependencies
```

---

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` with your Gemini API key:**
   ```
   GEMINI_API_KEY=your_key_here
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Go to http://localhost:3000 (or 3003 if 3000 is busy)

---

## 🎨 State Farm Branding

### Colors:
- **Primary Red:** `#E31837`
- **Hover Red:** `#C41230`
- **Background:** `#FAFAFA`
- **Text:** `#1A1A1A`
- **Borders:** `#E5E7EB`

### Key Messaging:
- "Like a good neighbor, State Farm is there"
- "Your financial future is here"
- Trust & transparency first
- Simple, plain-English explanations

---

## 🔍 Data Flow Diagram

```
Landing Page
    ↓
Trust Passport (consent to collect data)
    ↓
Survey Questions (7 sections, ~25 questions)
    ↓
Save to localStorage
    ↓
Calculate Insights (risk score, recommendations)
    ↓
Show Dashboard
    ↓
User asks AI chat questions
    ↓
RAG retrieves knowledge → Gemini answers → User gets help
```

---

## 🧪 Testing the Chat

### Try these questions:
1. "What's the difference between a deductible and premium?"
2. "Should I get term or whole life insurance?"
3. "How much should I save in an emergency fund?"
4. "What's an HSA?"
5. "Does State Farm offer bundling discounts?"

**Expected behavior:**
- AI pulls relevant knowledge
- Explains in simple terms
- Shows sources used
- Personalizes based on your survey answers

---

## ⚡ What's Done (Phases 1-3)

✅ **Phase 1:** State Farm theming (colors, branding, landing page)
✅ **Phase 2:** Trust Passport (data transparency before survey)
✅ **Phase 3:** Gemini API + RAG (AI chat with insurance knowledge)

---

## 🚧 What's Next (Phases 4-6)

⏳ **Phase 4:** Emergency Calculator (show "X months of runway if you lose your job")
⏳ **Phase 5:** Dashboard polish (make results screen beautiful)
⏳ **Phase 6:** Final testing & verification

---

## 📊 Emergency Calculator Logic (Phase 4 - In Progress)

### How it calculates:
1. **Monthly income** = Income range midpoint / 12
2. **Essential expenses** = Income × expense ratio (55-70% based on family size)
3. **Current emergency fund** = Monthly savings × 6 (estimate)
4. **Months of runway** = Current fund / Monthly essentials
5. **Recommended months** = 3-6 months (based on risk, dependents, age)
6. **Gap** = Recommended fund - Current fund
7. **Weekly savings needed** = Gap / 52 weeks

### Example:
- Income: $75k/year → $6,250/month
- Essentials: $3,750 (60% for couple)
- Current fund: $5,000
- Runway: 1.3 months → ⚠️ At Risk
- Recommended: 4 months = $15,000
- Gap: $10,000
- Save $192/week to reach goal in 1 year

---

## 🎯 Hackathon Judging Criteria Alignment

| Criteria | How FinMate Delivers |
|----------|---------------------|
| **Innovation** | RAG-powered AI chat with State Farm knowledge base |
| **Technical Execution** | Next.js, Gemini API, localStorage, TypeScript |
| **Accessibility** | Plain English, Trust Passport, simple UI |
| **Real-World Impact** | Helps underserved communities understand insurance |

---

## 💡 Key Differentiators

1. **Trust-first approach** - Show what data we collect BEFORE asking
2. **RAG prevents hallucinations** - AI answers from verified content
3. **State Farm branding** - Feels like official State Farm product
4. **Emergency calculator** - Concrete "months of runway" metric
5. **No jargon** - Explains deductibles, premiums, etc. in simple terms

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS 4
- **AI:** Google Gemini (gemini-1.5-flash)
- **RAG:** Custom keyword-based retrieval
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Storage:** localStorage (no database for speed)

---

## 📝 Environment Variables

Create `.env.local`:
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (stretch goals)
# ELEVENLABS_API_KEY=for_voice
# AUTH0_SECRET=for_authentication
```

---

## 🎓 What We Learned

1. **RAG is powerful** - AI gives better answers when grounded in real content
2. **Trust matters** - Showing data transparency upfront builds confidence
3. **Simple > Complex** - Plain English beats insurance jargon
4. **State Farm values** - "Good neighbor" = transparency, accessibility, education

---

## 📞 Support

For questions about the codebase, ask:
1. What does this component do?
2. How does the RAG system work?
3. Where is X feature implemented?

The AI chat can help explain code structure!

---

## 🎉 Demo Script

**For judges:**

1. Show landing page → "Like a good neighbor" branding
2. Click "Get Started" → Trust Passport appears
3. Complete survey → ~2 minutes
4. See dashboard → Emergency readiness score
5. Open AI chat → Ask "What's a deductible?"
6. See RAG in action → Sources shown
7. Ask "How much emergency savings?" → Personalized answer

**Key talking points:**
- Trust Passport = data transparency
- RAG = no AI hallucinations
- Emergency calculator = actionable metric
- Plain English = accessible to all

---

**Built for State Farm's Financial Wellness Track**
*Helping millions make confident financial decisions* 🎯
