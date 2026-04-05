# SowSmart - Feature Reality Check

Map every expected feature from original plan to current reality.

**How to use:** 
1. Go through each feature scenario
2. Test if it exists/works
3. Mark: ✅ Works | 🟡 Partial | ❌ Missing | 🔧 Broken
4. Add notes in "Reality" column

---

## 🟢 PHASE 1: Secure Onboarding (Trust First)

### Landing Page
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 1.1 | App opens to landing page (not quiz) | ☐ | |
| 1.2 | Shows "SowSmart" branding with plant/growth icon | ☐ | |
| 1.3 | Tagline: "Plant Good Financial Habits Early" | ☐ | |
| 1.4 | Hero text: Financial wellness messaging | ☐ | |
| 1.5 | Two CTAs: "Start growing" + "Try demo" | ☐ | |
| 1.6 | Preview cards showing 3 features | ☐ | Should show: Insurance, Emergency, Chat |
| 1.7 | Stats section: 92%, <2min, 5k+ users | ☐ | Desktop only |
| 1.8 | About section explaining SowSmart | ☐ | |
| 1.9 | FAQ section with 5+ questions | ☐ | |
| 1.10 | Login/Signup modals work | ☐ | Demo: demo@sowsmart.com / demo123 |
| 1.11 | Footer: "Built for State Farm Hackathon" | ☐ | |
| 1.12 | Disclaimer: "Educational tool, not advice" | ☐ | |
| 1.13 | Green theme (#2E7D32), NO red State Farm colors | ☐ | |
| 1.14 | NO references to FinMate/FinClear/LifeLens | ☐ | |

### Trust Passport (Before Survey)
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 1.15 | Clicking "Start" shows Trust Passport first | ☐ | NOT survey questions |
| 1.16 | Title: "Trust Passport" or similar | ☐ | |
| 1.17 | Lists data categories collected (4+ items) | ☐ | Salary, dependents, health, goals |
| 1.18 | Each item explains WHY it's needed | ☐ | "We use this to..." |
| 1.19 | Shows how data is used | ☐ | |
| 1.20 | Toggle control: "I understand and accept" | ☐ | |
| 1.21 | Can't continue without accepting | ☐ | Button should be disabled |
| 1.22 | After accepting, moves to actual survey | ☐ | |
| 1.23 | Mentions local storage (not cloud) | ☐ | Privacy consideration |

**Expected Impact:** Build trust before collecting data, State Farm alignment: transparency

---

## 🟡 PHASE 2: Smart Financial Survey

### Survey Structure
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 2.1 | Survey has multiple sections (5-7 sections) | ☐ | |
| 2.2 | Section 1: Coverage & Family | ☐ | Who needs protection |
| 2.3 | Section 2: Health & Wellness | ☐ | Health routines, conditions |
| 2.4 | Section 3: Financial & Plan Preference | ☐ | Income, budget, risk |
| 2.5 | Section 4: Life Stage & Usage | ☐ | Life changes, travel |
| 2.6 | Section 5: Retirement & Long-term | ☐ | 401k, IRA contributions |
| 2.7 | Section 6: Plan Experience & Consent | ☐ | Insurance confidence |
| 2.8 | Progress bar shows X of Y questions | ☐ | |
| 2.9 | "Back" button works, returns to prev question | ☐ | |
| 2.10 | "Continue" button advances to next | ☐ | |
| 2.11 | Can skip optional questions | ☐ | |
| 2.12 | Required questions block progress | ☐ | |
| 2.13 | Final screen: Summary of answers | ☐ | |
| 2.14 | Button: "Generate My Plan" or similar | ☐ | |

### State Farm-Specific Questions (HIGH PRIORITY)
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 2.15 | **AUTO INSURANCE:** Do you own a vehicle? | ☐ | **CRITICAL for SF alignment** |
| 2.16 | **AUTO:** Vehicle year/make/model | ☐ | |
| 2.17 | **AUTO:** Driving history (accidents, tickets) | ☐ | |
| 2.18 | **AUTO:** Annual mileage | ☐ | |
| 2.19 | **HOME:** Property ownership status | ☐ | Own vs Rent |
| 2.20 | **HOME:** Property type (house, condo, apt) | ☐ | |
| 2.21 | **HOME:** Location/zip code | ☐ | For risk assessment |
| 2.22 | **HOME:** Property value estimate | ☐ | |
| 2.23 | **RENTERS:** Renters insurance interest | ☐ | |
| 2.24 | **LIFE:** Life insurance coverage amount | ☐ | Income replacement |
| 2.25 | **LIFE:** Beneficiaries/family dependents | ☐ | |
| 2.26 | **LIFE:** Term vs whole life preference | ☐ | |

### Question Input Types
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 2.27 | Text input fields work | ☐ | Name, email |
| 2.28 | Number inputs work | ☐ | Age, dependents |
| 2.29 | Dropdowns/Select work | ☐ | Income, marital status |
| 2.30 | Sliders work | ☐ | Risk comfort 1-5 |
| 2.31 | Yes/No toggles work | ☐ | Health conditions |
| 2.32 | Multi-select checkboxes work | ☐ | Activity types |
| 2.33 | Text areas work | ☐ | Health summary |
| 2.34 | Conditional questions show/hide | ☐ | Based on previous answers |

### Additional Expected Features
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 2.35 | Upload PDF for existing policy | ☐ | Parse existing coverage |
| 2.36 | Data stored in localStorage | ☐ | Check DevTools > Application |
| 2.37 | Can revisit/edit after completion | ☐ | Profile settings |

**Expected Impact:** Comprehensive data for personalized recommendations

---

## 🔵 PHASE 3: AI Recommendations Engine

### Plan Generation
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 3.1 | Clicking "Generate" shows loading state | ☐ | "Generating insights..." |
| 3.2 | Loading takes <10 seconds | ☐ | |
| 3.3 | Dashboard appears after generation | ☐ | |
| 3.4 | Shows 3-5 personalized recommendations | ☐ | |
| 3.5 | **REC 1:** Health plan recommendation | ☐ | Low vs high deductible based on risk |
| 3.6 | **REC 2:** Retirement contribution % | ☐ | Based on income, age, goals |
| 3.7 | **REC 3:** Emergency fund priority | ☐ | Months of expenses to save |
| 3.8 | **REC 4:** Auto insurance coverage level | ☐ | Liability, collision, comprehensive |
| 3.9 | **REC 5:** Home/renters insurance | ☐ | Based on property ownership |
| 3.10 | **REC 6:** Life insurance amount | ☐ | Income replacement calc |
| 3.11 | Each recommendation has "Why?" explanation | ☐ | Reasoning visible |
| 3.12 | References user's survey inputs | ☐ | "Based on your X answer..." |
| 3.13 | Mentions State Farm products/terms | ☐ | Generic OK, specific better |
| 3.14 | Shows confidence scores | ☐ | Optional but good |

### RAG Knowledge Base
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 3.15 | Knowledge base exists at `src/lib/rag/knowledge-base.ts` | ☐ | |
| 3.16 | Has 15+ knowledge entries | ☐ | |
| 3.17 | **TOPIC:** Insurance basics (deductible, premium) | ☐ | |
| 3.18 | **TOPIC:** Health plans (HMO, PPO, HSA, HDHP) | ☐ | |
| 3.19 | **TOPIC:** Auto insurance (liability, collision) | ☐ | |
| 3.20 | **TOPIC:** Home insurance (dwelling, personal property) | ☐ | |
| 3.21 | **TOPIC:** Life insurance (term, whole, universal) | ☐ | |
| 3.22 | **TOPIC:** Emergency fund planning | ☐ | |
| 3.23 | **TOPIC:** Retirement (401k, IRA, Roth) | ☐ | |
| 3.24 | **TOPIC:** State Farm specific info | ☐ | Company values, products |
| 3.25 | RAG retrieves relevant entries for queries | ☐ | Keyword matching works |

**Expected Impact:** Intelligent, context-aware recommendations using financial knowledge

---

## 🟣 PHASE 4: Conversational Financial Assistant

### Chat Interface
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 4.1 | Chat icon/button visible | ☐ | Bottom nav or floating |
| 4.2 | Clicking opens chat modal/panel | ☐ | |
| 4.3 | Shows welcome message | ☐ | "Hi, I'm your SowSmart assistant" |
| 4.4 | Text input field works | ☐ | Can type questions |
| 4.5 | Send button or Enter key submits | ☐ | |
| 4.6 | Shows typing indicator while processing | ☐ | "Thinking..." |
| 4.7 | Receives response in <3 seconds | ☐ | |
| 4.8 | Response is clear and simple | ☐ | 8th grade reading level |
| 4.9 | Can ask follow-up questions | ☐ | |
| 4.10 | Conversation history persists in session | ☐ | Scrollable |

### Chat Content Quality
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 4.11 | **TEST Q1:** "What is a deductible?" | ☐ | Should explain in simple terms |
| 4.12 | **TEST Q2:** "Why not high deductible plan?" | ☐ | Should compare low vs high |
| 4.13 | **TEST Q3:** "How much life insurance do I need?" | ☐ | Should use income replacement |
| 4.14 | **TEST Q4:** "What's collision coverage?" | ☐ | Auto insurance specific |
| 4.15 | **TEST Q5:** "How does HSA work?" | ☐ | Health savings account |
| 4.16 | Responses use RAG context | ☐ | Check if KB entries are referenced |
| 4.17 | Suggests 3 next questions | ☐ | "You might also want to ask..." |
| 4.18 | Handles off-topic gracefully | ☐ | "Let's focus on financial wellness" |
| 4.19 | Shows disclaimers | ☐ | "Not financial advice, consult pro" |
| 4.20 | "Talk to Agent" escalation option | ☐ | Link or button |

### Gemini API Integration
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 4.21 | API route: `/api/chat` | ☐ | |
| 4.22 | Uses Gemini model: `gemini-pro` | ☐ | NOT gemini-1.5-flash |
| 4.23 | Injects RAG context into prompt | ☐ | Top 3 relevant KB entries |
| 4.24 | System prompt sets SowSmart personality | ☐ | Friendly financial assistant |
| 4.25 | Graceful fallback if Gemini fails | ☐ | Returns KB content directly |
| 4.26 | GEMINI_API_KEY required in .env | ☐ | |
| 4.27 | Console shows no API errors | ☐ | Check browser DevTools |

**Expected Impact:** Financial literacy through conversational AI, key differentiator

---

## 🔴 PHASE 5: Drop-off Detection (DEFERRED)

### User Confusion Detection
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 5.1 | Tracks hover without click (friction) | ☐ | Likely NOT implemented (stretch) |
| 5.2 | Detects user stuck on question | ☐ | Time-based tracking |
| 5.3 | Popup: "Are you confused?" | ☐ | |
| 5.4 | Hover over term shows explanation tooltip | ☐ | Manual help alternative |
| 5.5 | "Need help?" button always visible | ☐ | Floating button |

### Recovery Actions
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 5.6 | Simplifies UI when confusion detected | ☐ | Adaptive interface |
| 5.7 | Shows comparison chart | ☐ | Visual explanation |
| 5.8 | Activates voice mode | ☐ | Read explanation aloud |

**Original Expectation:** Automatically detect and help confused users  
**Likely Reality:** Manual help only (click for explanation)

---

## 🟤 PHASE 6: Voice + Accessibility Mode (STRETCH)

### Voice Integration
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 6.1 | ElevenLabs TTS integration | ☐ | Likely NOT implemented |
| 6.2 | "Read aloud" toggle button | ☐ | |
| 6.3 | AI speaks recommendations | ☐ | |
| 6.4 | Voice works in Spanish | ☐ | Multi-language |
| 6.5 | Voice fallback if API fails | ☐ | |

### Accessibility Features
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 6.6 | Simplified bullet points mode | ☐ | Alternative view |
| 6.7 | Simpler word choices | ☐ | 6th grade level |
| 6.8 | High contrast mode | ☐ | |
| 6.9 | Font size adjustable | ☐ | |
| 6.10 | Screen reader compatible | ☐ | Test with VoiceOver/JAWS |
| 6.11 | Keyboard navigation works | ☐ | Tab through interface |
| 6.12 | Focus indicators visible | ☐ | |

**Expected Impact:** Help underserved communities, accessibility scoring  
**Likely Reality:** Basic accessibility only (mobile-responsive, simple language)

---

## 🟢 PHASE 7: Emergency Readiness Planner

### Emergency Calculator
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 7.1 | Calculator visible in dashboard | ☐ | **Likely NOT integrated yet** |
| 7.2 | Input: Monthly income | ☐ | Number field |
| 7.3 | Input: Monthly expenses | ☐ | Number field |
| 7.4 | Input: Current savings | ☐ | Number field |
| 7.5 | Auto-calculates runway months | ☐ | Savings / Expenses |
| 7.6 | Shows result: "X.X months" | ☐ | Example: "2.9 months" |
| 7.7 | Risk level indicator | ☐ | Color-coded |
| 7.8 | **<1 month:** "Critical" (red) | ☐ | |
| 7.9 | **1-3 months:** "At Risk" (orange) | ☐ | |
| 7.10 | **3-6 months:** "Building" (yellow) | ☐ | |
| 7.11 | **6+ months:** "Protected" (green) | ☐ | |
| 7.12 | Visual gauge/progress bar | ☐ | Shows current vs goal |
| 7.13 | Recommendations: "Save $XXX/month" | ☐ | To reach 6 months |
| 7.14 | Timeline to goal: "X months" | ☐ | |
| 7.15 | Example scenario: "If you lose job..." | ☐ | Messaging |

### Component Location
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 7.16 | File exists: `src/components/emergency-calculator.tsx` | ☐ | Component is built |
| 7.17 | Imported in `insights-dashboard.tsx` | ☐ | Check imports |
| 7.18 | Rendered in dashboard UI | ☐ | Visible to user |
| 7.19 | Data persists after refresh | ☐ | localStorage |

### Solana/Blockchain (REMOVED)
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 7.20 | Emergency wallet | ❌ Removed | Feedback: buzzword stuffing |
| 7.21 | Micro-savings logic | ❌ Removed | Out of scope |
| 7.22 | "Activate wallet" button | ❌ Removed | |

**Expected Impact:** "Plan for the unexpected" - core State Farm theme  
**Critical Check:** Is calculator integrated or just built?

---

## 🟣 PHASE 8: Final Dashboard

### Dashboard Components
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 8.1 | Profile summary card | ☐ | Name, age, coverage type |
| 8.2 | Shows user's name from survey | ☐ | |
| 8.3 | Shows coverage type selected | ☐ | Self, Family, etc |
| 8.4 | AI Recommendations section | ☐ | Top 3-5 suggestions |
| 8.5 | Emergency readiness section | ☐ | Months + gauge |
| 8.6 | Risk score visualization | ☐ | Chart or gauge |
| 8.7 | Risk score explanation | ☐ | What does score mean |
| 8.8 | Quick actions section | ☐ | Buttons/links |
| 8.9 | **ACTION:** "Chat with AI" | ☐ | Opens chat |
| 8.10 | **ACTION:** "Recalculate Plans" | ☐ | Re-runs generation |
| 8.11 | **ACTION:** "Update Profile" | ☐ | Edit survey answers |
| 8.12 | **ACTION:** "Talk to Agent" | ☐ | **CRITICAL - SF alignment** |
| 8.13 | Testimonials section | ☐ | 2-3 user quotes |
| 8.14 | Testimonial format: Quote + Name + Context | ☐ | |
| 8.15 | Footer links | ☐ | Privacy, Terms, etc |

### Navigation (Bottom Nav)
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 8.16 | Bottom nav visible on all screens | ☐ | Fixed position |
| 8.17 | **TAB 1:** Insights (dashboard icon) | ☐ | Main recommendations |
| 8.18 | **TAB 2:** Timeline (clock icon) | ☐ | Life events |
| 8.19 | **TAB 3:** Learn (book icon) | ☐ | Financial resources |
| 8.20 | **TAB 4:** Upload (upload icon) | ☐ | Policy documents |
| 8.21 | **TAB 5:** Profile (user icon) | ☐ | Edit personal info |
| 8.22 | Active tab highlighted | ☐ | Visual indicator |
| 8.23 | Smooth transitions between screens | ☐ | Animations |

### Individual Screens
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| 8.24 | **Timeline:** Shows life milestones | ☐ | Marriage, kids, retirement |
| 8.25 | **Learn:** Financial literacy articles | ☐ | State Farm resources |
| 8.26 | **Learn:** Glossary of terms | ☐ | Deductible, premium, etc |
| 8.27 | **Learn:** Video content | ☐ | Optional |
| 8.28 | **Upload:** File picker for PDFs | ☐ | |
| 8.29 | **Upload:** Parses policy documents | ☐ | Extract coverage info |
| 8.30 | **Profile:** Edit all survey answers | ☐ | |
| 8.31 | **Profile:** Clear all data button | ☐ | Privacy |

**Expected Impact:** Comprehensive financial wellness dashboard

---

## 🏢 STATE FARM ALIGNMENT

### Product Coverage
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| SF.1 | Auto insurance mentioned | ☐ | Survey, KB, Chat, Dashboard |
| SF.2 | Home insurance mentioned | ☐ | Survey, KB, Chat, Dashboard |
| SF.3 | Renters insurance mentioned | ☐ | Survey, KB, Chat, Dashboard |
| SF.4 | Life insurance mentioned | ☐ | Survey, KB, Chat, Dashboard |
| SF.5 | Health insurance mentioned | ☐ | Already present |
| SF.6 | Retirement planning mentioned | ☐ | Already present |
| SF.7 | Umbrella insurance mentioned | ☐ | Optional |

### Branding & Attribution
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| SF.8 | NO State Farm logo used | ☐ | Avoid trademark issues |
| SF.9 | "Built for State Farm Hackathon" | ☐ | Footer attribution |
| SF.10 | "Powered by State Farm" | ☐ | Optional |
| SF.11 | Generic SF references OK | ☐ | "Like a good neighbor" |
| SF.12 | Link to statefarm.com/agent | ☐ | Agent handoff |
| SF.13 | State Farm colors NOT used | ☐ | Use own brand (SowSmart green) |

### Core Values Alignment
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| SF.14 | **Trust:** Data transparency shown | ☐ | Trust Passport |
| SF.15 | **Planning:** Emergency readiness emphasized | ☐ | Calculator prominent |
| SF.16 | **Protection:** Insurance education clear | ☐ | RAG knowledge |
| SF.17 | **Community:** Underserved focus mentioned | ☐ | About section |
| SF.18 | **Accessibility:** Simple language used | ☐ | 8th grade level |

**Critical:** Agent handoff must exist for SF alignment

---

## 🔧 TECHNICAL REQUIREMENTS

### Build & Deploy
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.1 | `npm install` runs without errors | ☐ | |
| T.2 | `npm run dev` starts server | ☐ | Default port 3000 |
| T.3 | `npm run build` succeeds | ☐ | Production ready |
| T.4 | `npm run start` serves production | ☐ | |
| T.5 | TypeScript type check passes | ☐ | `npm run typecheck` |
| T.6 | No console errors on load | ☐ | F12 > Console |
| T.7 | No 404s in Network tab | ☐ | F12 > Network |

### Environment Variables
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.8 | `.env` file exists | ☐ | |
| T.9 | `GEMINI_API_KEY` is set | ☐ | Required for chat |
| T.10 | `.env.example` provided | ☐ | For team setup |

### Data Storage
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.11 | Uses localStorage (not database) | ☐ | DevTools > Application |
| T.12 | Survey data persists after refresh | ☐ | |
| T.13 | Can clear data from Profile settings | ☐ | |
| T.14 | No cloud storage / external APIs for data | ☐ | Privacy |

### Error Handling
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.15 | If no API key, shows fallback response | ☐ | Test by removing key |
| T.16 | If Gemini fails, uses KB directly | ☐ | Graceful degradation |
| T.17 | Invalid form inputs show errors | ☐ | Validation messages |
| T.18 | Offline shows "Check connection" | ☐ | Network error handling |
| T.19 | Missing data shows placeholder | ☐ | Not crash |

### Performance
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.20 | Landing page loads in <2 seconds | ☐ | |
| T.21 | Survey transitions in <500ms | ☐ | |
| T.22 | Plan generation in <10 seconds | ☐ | |
| T.23 | Chat response in <3 seconds | ☐ | |
| T.24 | Dashboard renders in <1 second | ☐ | |

### Mobile & Responsive
| # | Expected Feature | Reality Status | Notes |
|---|------------------|----------------|-------|
| T.25 | Mobile view (iPhone 12 Pro) | ☐ | DevTools device mode |
| T.26 | Tablet view (iPad) | ☐ | |
| T.27 | Desktop view (1920x1080) | ☐ | |
| T.28 | Text readable at all sizes | ☐ | No overflow |
| T.29 | Buttons tappable (44px min) | ☐ | Touch targets |
| T.30 | Bottom nav doesn't block content | ☐ | Padding |

---

## 📊 JUDGING CRITERIA MAPPING

### Innovation (25%)
| # | Feature | Reality Status | Demo Highlight? |
|---|---------|----------------|-----------------|
| J.1 | Trust Passport (unique approach) | ☐ | YES - Lead with this |
| J.2 | RAG-enhanced AI (not generic chatbot) | ☐ | YES - Show knowledge |
| J.3 | Emergency readiness focus | ☐ | YES - SF alignment |
| J.4 | Growth branding (memorable) | ☐ | Optional |

### Technical Execution (25%)
| # | Feature | Reality Status | Demo Highlight? |
|---|---------|----------------|-----------------|
| J.5 | Clean architecture | ☐ | Mention if asked |
| J.6 | TypeScript throughout | ☐ | |
| J.7 | Proper error handling | ☐ | Show fallback |
| J.8 | Build passes | ☐ | Must work |
| J.9 | No runtime errors | ☐ | Must work |

### Accessibility (25%)
| # | Feature | Reality Status | Demo Highlight? |
|---|---------|----------------|-----------------|
| J.10 | Mobile-first design | ☐ | Show on phone |
| J.11 | Simple language (8th grade) | ☐ | Mention |
| J.12 | Keyboard navigation | ☐ | Optional demo |
| J.13 | High contrast | ☐ | Visual |
| J.14 | Underserved communities focus | ☐ | YES - Mention in intro |

### Real-World Impact (25%)
| # | Feature | Reality Status | Demo Highlight? |
|---|---------|----------------|-----------------|
| J.15 | Addresses financial literacy gap | ☐ | YES - Opening |
| J.16 | Actionable recommendations | ☐ | YES - Show dashboard |
| J.17 | Emergency planning emphasis | ☐ | YES - Calculator |
| J.18 | Clear path to SF products | ☐ | Show agent handoff |
| J.19 | Helps plan for unexpected | ☐ | YES - Core theme |

---

## ✅ GAP SUMMARY

After testing, complete this:

### 🔴 CRITICAL GAPS (Must Fix Before Demo)
_Demo will fail without these_

1. [ ] _____________________
2. [ ] _____________________
3. [ ] _____________________

### 🟠 HIGH PRIORITY GAPS (Missing Core Features)
_Expected features not implemented_

1. [ ] _____________________
2. [ ] _____________________
3. [ ] _____________________
4. [ ] _____________________
5. [ ] _____________________

### 🟡 MEDIUM PRIORITY GAPS (Polish Issues)
_Works but needs improvement_

1. [ ] _____________________
2. [ ] _____________________
3. [ ] _____________________

### 🟢 LOW PRIORITY GAPS (Stretch Features)
_Nice to have, not essential_

1. [ ] _____________________
2. [ ] _____________________

---

## 🎯 EXPECTED MAJOR GAPS (Pre-Testing)

Based on development, expect these gaps:

| Gap | Priority | Location | Fix Time Estimate |
|-----|----------|----------|-------------------|
| Emergency Calc not integrated | 🔴 HIGH | Phase 7 | 30 mins |
| Auto/Home insurance questions | 🔴 HIGH | Phase 2 | 45 mins |
| "Talk to Agent" button | 🔴 HIGH | Phase 8 | 15 mins |
| Testimonials section | 🟠 MED | Phase 8 | 30 mins |
| Profile summary card | 🟠 MED | Phase 8 | 20 mins |
| Risk score visualization | 🟡 MED | Phase 8 | 45 mins |
| Upload PDF parsing | 🟡 MED | Phase 8 | 2 hours |
| Voice mode | 🟢 LOW | Phase 6 | 3+ hours |
| Auth0 login | 🟢 LOW | Phase 1 | 2 hours |
| Multi-language | 🟢 LOW | Phase 6 | 3+ hours |

---

## 📝 TESTING SESSION LOG

**Date:** _______________  
**Tester:** _______________  
**Time Started:** _______________  
**Time Ended:** _______________

### Progress Tracker
```
Phase 1 (Onboarding):     ☐ Not Started | ☐ Testing | ☐ Complete
Phase 2 (Survey):         ☐ Not Started | ☐ Testing | ☐ Complete
Phase 3 (AI Recs):        ☐ Not Started | ☐ Testing | ☐ Complete
Phase 4 (Chat):           ☐ Not Started | ☐ Testing | ☐ Complete
Phase 5 (Drop-off):       ☐ Not Started | ☐ Testing | ☐ Complete
Phase 6 (Voice):          ☐ Not Started | ☐ Testing | ☐ Complete
Phase 7 (Emergency):      ☐ Not Started | ☐ Testing | ☐ Complete
Phase 8 (Dashboard):      ☐ Not Started | ☐ Testing | ☐ Complete
SF Alignment:             ☐ Not Started | ☐ Testing | ☐ Complete
Technical:                ☐ Not Started | ☐ Testing | ☐ Complete
```

### Notes
_Add observations, bugs, ideas here_

---

## 🚀 RECOMMENDED TESTING ORDER

**30-Minute Quick Test:**
1. Technical (T.1-T.7) - 5 min - Verify build works
2. Phase 1 (1.1-1.23) - 5 min - Landing + Trust Passport
3. Phase 2 (2.1-2.14) - 5 min - Survey flow (skip specific questions)
4. Phase 3 (3.1-3.14) - 5 min - Dashboard recommendations
5. Phase 4 (4.1-4.20) - 5 min - Chat test
6. SF Alignment (SF.1-SF.18) - 3 min - Product mentions
7. Fill Gap Summary - 2 min

**2-Hour Comprehensive Test:**
- Test all features systematically
- Fill every checkbox
- Document all gaps with screenshots
- Prioritize fixes

**Team Parallel Test (3 people × 30 min):**
- Person 1: Phases 1-3
- Person 2: Phases 4, 7, 8
- Person 3: SF + Technical
- Merge findings

---

## 💡 TESTING TIPS

1. **Start with build:** If `npm run build` fails, fix that first
2. **Use browser DevTools:** Console + Network tabs show issues
3. **Take screenshots:** Document bugs visually
4. **Test edge cases:** Empty inputs, long text, special characters
5. **Test on real device:** iPhone Safari behaves differently than desktop
6. **Check localStorage:** Application tab in DevTools
7. **Test offline:** Disconnect network, check error handling
8. **Test with/without API key:** Verify fallback works

---

**Total Features to Check:** 310+  
**Estimated Time:** 30 min (quick) to 3 hours (comprehensive)  
**Priority:** Focus on 🔴 CRITICAL and SF Alignment first
