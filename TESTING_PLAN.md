# SowSmart - Comprehensive Testing Plan

## How to Use This Document
1. Test each feature in order
2. Mark status: ✅ Pass | 🟡 Partial | ❌ Fail/Missing
3. Note gaps in "Issues Found" column
4. Prioritize fixes based on hackathon judging criteria

---

## Phase 1: Secure Onboarding (Trust First)

### Test Case 1.1: Landing Page Load
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Open app | Landing page displays (not quiz) | ☐ | |
| Check branding | Shows "SowSmart" with 🌱 icon | ☐ | |
| Check tagline | "Plant Good Financial Habits Early" visible | ☐ | |
| Check colors | Green theme (#2E7D32), not red | ☐ | |
| Check hero text | "Grow your financial future with confidence" | ☐ | |
| Check preview cards | 3 cards: Insurance, Emergency, Chat | ☐ | |
| Check stats | 92%, <2 min, 5k+ stats visible (desktop) | ☐ | |
| Check FAQ | About section + 5 FAQs present | ☐ | |

**Expected Features:**
- Clean landing with State Farm alignment
- Clear value proposition
- Trust signals (stats, testimonials)

**Gaps to Check:**
- [ ] Are testimonials missing?
- [ ] Is State Farm attribution clear?

---

### Test Case 1.2: Trust Passport
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Click "Start growing" | Quiz begins with Trust Passport | ☐ | |
| See data items | Shows 4+ data categories collected | ☐ | |
| Read explanations | Each item has "Why we need this" text | ☐ | |
| Check toggle | "I understand and accept" toggle works | ☐ | |
| Try to continue | Can't proceed without accepting | ☐ | |
| Accept and continue | Moves to actual survey questions | ☐ | |

**Expected Features:**
- Clear data transparency before any input
- User must actively consent
- Shows what, why, and how data is used

**Gaps to Check:**
- [ ] Does it explain local storage vs cloud?
- [ ] Privacy policy link present?
- [ ] Can user toggle controls (granular)?

---

## Phase 2: Smart Financial Survey

### Test Case 2.1: Survey Flow
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Start survey | First section: "Coverage & Family" | ☐ | |
| Answer questions | Can select/input all field types | ☐ | |
| Check progress bar | Shows X of Y questions completed | ☐ | |
| Navigate back | "Back" button works | ☐ | |
| Skip optional | Can skip non-required questions | ☐ | |
| Check validation | Required fields block "Continue" | ☐ | |
| Complete survey | Reaches summary screen | ☐ | |

**Sections to Test:**
1. Coverage & Family (who needs protection)
2. Health & Wellness Profile
3. Financial & Plan Preference
4. Life Stage & Usage
5. Retirement & Long-Term Benefits
6. Plan Experience & Consent

**Gaps to Check:**
- [ ] Are State Farm-specific questions present?
  - [ ] Auto insurance questions (vehicle, driving history)
  - [ ] Home insurance questions (property type, location)
  - [ ] Life insurance questions (income protection)
  - [ ] Renters insurance option
- [ ] Subtopic placement clear and logical?
- [ ] Upload PDF feature for existing policies?

---

### Test Case 2.2: Survey Question Types
| Question Type | Works? | Status | Issues |
|---------------|--------|--------|--------|
| Text input | Full name, email | ☐ | |
| Number input | Age, dependents | ☐ | |
| Select dropdown | Income range, marital status | ☐ | |
| Slider | Risk comfort, activity level | ☐ | |
| Boolean (Yes/No) | Has health conditions | ☐ | |
| Multi-select | Activity types | ☐ | |
| Textarea | Health summary | ☐ | |
| Conditional questions | Show/hide based on answers | ☐ | |

---

## Phase 3: AI Recommendations Engine

### Test Case 3.1: Plan Generation
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Complete survey | Click "Generate My Plan" | ☐ | |
| Loading state | Shows "Generating..." message | ☐ | |
| Wait time | Takes <10 seconds | ☐ | |
| Dashboard appears | Shows Insights Dashboard | ☐ | |
| Recommendations shown | At least 3 personalized suggestions | ☐ | |
| Check relevance | Recommendations match survey inputs | ☐ | |

**Expected Recommendations:**
- Health plan type (low vs high deductible)
- Retirement contribution %
- Emergency fund priority
- Insurance coverage levels

**Gaps to Check:**
- [ ] Are recommendations specific and actionable?
- [ ] Do they reference State Farm products?
- [ ] Confidence scores shown?
- [ ] "Why this recommendation?" explanations?

---

### Test Case 3.2: RAG Knowledge Base
| Test | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Check data source | RAG uses knowledge-base.ts entries | ☐ | |
| Count entries | At least 15+ knowledge entries | ☐ | |
| Topics covered | Insurance, retirement, emergency, SF | ☐ | |
| Keyword matching | Retrieves relevant context | ☐ | |

**RAG Content Check:**
- [ ] Insurance basics (deductible, premium, coverage)
- [ ] Health plans (HMO, PPO, HSA)
- [ ] Auto insurance
- [ ] Home insurance
- [ ] Life insurance
- [ ] Emergency planning
- [ ] Retirement (401k, IRA)
- [ ] State Farm specific info

---

## Phase 4: Conversational Financial Assistant

### Test Case 4.1: Chat Functionality
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Open chat | Click chat icon or "Ask a question" | ☐ | |
| See welcome | Shows "Hi, I'm SowSmart assistant" | ☐ | |
| Type question | "What is a deductible?" | ☐ | |
| Get response | Receives clear, simple explanation | ☐ | |
| Check source | Uses RAG context from knowledge base | ☐ | |
| Follow-up | "Why not high deductible plan?" | ☐ | |
| Context awareness | Remembers previous conversation | ☐ | |
| Suggest questions | Shows 3 suggested next questions | ☐ | |

**Test Questions:**
1. "What is a deductible?"
2. "Should I get life insurance?"
3. "How much emergency fund do I need?"
4. "What's the difference between term and whole life?"
5. "How does auto insurance deductible work?"

**Gaps to Check:**
- [ ] Does it handle off-topic questions gracefully?
- [ ] Disclaimers shown ("not financial advice")?
- [ ] "Talk to Agent" escalation option?
- [ ] Multi-language support?

---

### Test Case 4.2: Gemini API Integration
| Test | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Check env var | GEMINI_API_KEY is set | ☐ | |
| Make API call | Chat hits /api/chat route | ☐ | |
| Use correct model | Uses `gemini-pro` (not 1.5-flash) | ☐ | |
| Inject RAG context | Prompt includes top 3 KB entries | ☐ | |
| Graceful fallback | If Gemini fails, uses KB directly | ☐ | |
| Response time | <3 seconds for typical question | ☐ | |

---

## Phase 5: Drop-off Detection (Deferred/Manual)

### Test Case 5.1: User Confusion Detection
| Feature | Status | Notes |
|---------|--------|-------|
| Hover tracking | ❌ Not implemented | Marked as stretch goal |
| Manual help | ☐ Check if present | "Confused? Tap for help" |
| Tooltips | ☐ | Question mark icons with explanations |
| Simplified mode | ❌ | No adaptive UI simplification |

**Original Expectation:** Detect when user hovers without clicking, trigger help.

**Implemented:** Manual help triggers only.

---

## Phase 6: Voice + Accessibility Mode

### Test Case 6.1: Voice Integration
| Feature | Expected | Status | Issues Found |
|---------|----------|--------|--------------|
| ElevenLabs TTS | Read recommendations aloud | ❌ | Not implemented (stretch) |
| Voice toggle | Button to enable/disable | ❌ | Missing |
| Multi-language | Spanish audio support | ❌ | Missing |

**Status:** Deferred as stretch goal.

**Accessibility Alternatives:**
- [ ] Screen reader friendly?
- [ ] Keyboard navigation works?
- [ ] High contrast mode?
- [ ] Font size adjustable?

---

## Phase 7: Emergency Readiness Planner

### Test Case 7.1: Emergency Calculator
| Step | Expected | Status | Issues Found |
|------|----------|--------|--------------|
| Navigate to calc | Find Emergency Calculator in dashboard | ☐ | Component exists but not integrated |
| Input monthly income | Enter $5000 | ☐ | |
| Input monthly expenses | Enter $3500 | ☐ | |
| Input savings | Enter $10,000 | ☐ | |
| See runway | Shows "2.9 months" | ☐ | |
| See risk level | Shows "At Risk" (if <3 months) | ☐ | |
| See recommendations | "Save $XXX/month to reach 6 months" | ☐ | |
| Visual gauge | Progress bar shows current vs goal | ☐ | |

**Expected Calculations:**
- Runway = Savings / Monthly Expenses
- Risk Levels:
  - <1 month: Critical
  - 1-3 months: At Risk
  - 3-6 months: Building
  - 6+ months: Protected
- Savings goal: 6 months expenses

**Gaps to Check:**
- [ ] Is it visible on dashboard?
- [ ] Can user update inputs easily?
- [ ] Does it persist data?

---

### Test Case 7.2: Solana/Blockchain (Cut)
| Feature | Status | Reason |
|---------|--------|--------|
| Emergency wallet | ❌ Removed | Feedback: buzzword stuffing |
| Micro-savings | ❌ Removed | Out of scope for 15 hours |

---

## Phase 8: Final Dashboard

### Test Case 8.1: Dashboard Components
| Component | Expected | Status | Issues Found |
|-----------|----------|--------|--------------|
| Profile summary card | Name, age, coverage type | ☐ | |
| AI Recommendations | Top 3-5 suggestions | ☐ | |
| Emergency readiness | Months of runway + gauge | ☐ | |
| Risk score | Visualization (chart/gauge) | ☐ | |
| Quick actions | "Chat", "Recalculate", "Update Profile" | ☐ | |
| Testimonials | 2-3 user quotes | ☐ | |
| "Talk to Agent" CTA | Button linking to State Farm | ☐ | |

**Gaps to Check:**
- [ ] Profile summary card exists?
- [ ] Risk score visualization exists?
- [ ] Testimonials section?
- [ ] Agent handoff button?

---

### Test Case 8.2: Navigation
| Feature | Expected | Status | Issues Found |
|---------|----------|--------|--------------|
| Bottom nav visible | Shows 5 tabs: Insights, Timeline, Learn, Upload, Profile | ☐ | |
| Navigate to Timeline | Shows life events/milestones | ☐ | |
| Navigate to Learn | Shows financial literacy resources | ☐ | |
| Navigate to Upload | Can upload policy documents | ☐ | |
| Navigate to Profile | Can edit personal info | ☐ | |
| Back to Insights | Returns to main dashboard | ☐ | |

---

## Phase 9: Data & Privacy

### Test Case 9.1: Data Storage
| Feature | Expected | Status | Issues Found |
|---------|----------|--------|--------------|
| Uses localStorage | Data persists in browser | ☐ | |
| No cloud storage | Data stays on device | ☐ | |
| Clear data option | User can delete profile | ☐ | |
| No tracking | No Google Analytics, etc. | ☐ | |

---

### Test Case 9.2: Disclaimers
| Location | Expected Text | Status |
|----------|---------------|--------|
| Landing page | "Educational tool, not financial advice" | ☐ |
| Chat responses | "Consult a licensed professional" | ☐ |
| Recommendations | "Not a substitute for licensed agent" | ☐ |

---

## State Farm Alignment Tests

### Test Case SF-1: Product Mentions
| Product Type | Mentioned? | Where? | Status |
|--------------|------------|--------|--------|
| Auto Insurance | ☐ | Survey, KB, Chat | |
| Home Insurance | ☐ | Survey, KB, Chat | |
| Life Insurance | ☐ | Survey, KB, Chat | |
| Renters Insurance | ☐ | Survey, KB | |
| Health Insurance | ☐ | Survey, KB, Chat | |
| Retirement Planning | ☐ | Survey, KB | |

---

### Test Case SF-2: Branding
| Element | Expected | Status |
|---------|----------|--------|
| No direct SF logo | Avoid trademark issues | ☐ |
| "Built for State Farm Hackathon" | Footer text | ☐ |
| "Talk to Agent" link | Points to statefarm.com | ☐ |
| Alignment with SF values | Trust, transparency, planning | ☐ |

---

## Critical Bug Tests

### Test Case BUG-1: Build & Deployment
| Test | Expected | Status |
|------|----------|--------|
| `npm install` | No errors | ☐ |
| `npm run dev` | Starts on port 3000 | ☐ |
| `npm run build` | Builds successfully | ☐ |
| `npm run start` | Production mode works | ☐ |
| Mobile view | Responsive on iPhone/Android | ☐ |
| Desktop view | Responsive on 1920x1080 | ☐ |

---

### Test Case BUG-2: Error Handling
| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| No Gemini API key | Shows fallback response | ☐ |
| Gemini API fails | Uses KB directly, no crash | ☐ |
| Invalid form input | Shows validation error | ☐ |
| Network offline | Shows "Check connection" | ☐ |
| Empty localStorage | Creates fresh profile | ☐ |

---

## Performance Tests

### Test Case PERF-1: Speed
| Metric | Target | Status |
|--------|--------|--------|
| Landing page load | <2 seconds | ☐ |
| Survey page transition | <500ms | ☐ |
| Plan generation | <10 seconds | ☐ |
| Chat response | <3 seconds | ☐ |
| Dashboard render | <1 second | ☐ |

---

## Judging Criteria Tests

### Innovation
- [ ] Trust Passport (data transparency) - unique?
- [ ] RAG-enhanced AI responses - novel approach?
- [ ] Emergency calculator integration - useful?
- [ ] Growth theme ("sow smart") - memorable?

### Technical Execution
- [ ] Clean code architecture
- [ ] Proper TypeScript typing
- [ ] Error handling comprehensive
- [ ] Build passes without warnings
- [ ] No console errors in browser

### Accessibility
- [ ] Mobile-first design
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Simple language (8th grade reading level)

### Real-World Impact
- [ ] Addresses financial literacy gap
- [ ] Helps underserved communities
- [ ] Actionable recommendations
- [ ] Clear path to State Farm products
- [ ] Emergency planning emphasis

---

## Gap Summary Template

After testing, fill this out:

### Critical Gaps (Must Fix)
1. 
2. 
3. 

### Important Gaps (Should Fix)
1. 
2. 
3. 

### Nice-to-Have Gaps (Time Permitting)
1. 
2. 
3. 

### Working Well (Highlight in Demo)
1. 
2. 
3. 

---

## Testing Checklist Progress

**Total Test Cases:** 15 major sections
**Completed:** 0
**In Progress:** 0
**Blocked:** 0

**Estimated Time:** 2-3 hours for full manual testing

---

## Quick Test Command Reference

```bash
# Development
cd finmate
npm run dev

# Production build
npm run build
npm run start

# Type check
npm run typecheck

# Check for errors
# Open browser console (F12)
# Check Network tab for API calls
# Check localStorage in Application tab
```

---

## Notes Section
(Add testing observations here)

