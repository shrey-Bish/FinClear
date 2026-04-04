/**
 * State Farm Financial Wellness Knowledge Base
 * RAG content for insurance education and financial literacy
 */

export interface KnowledgeEntry {
  id: string
  category: string
  title: string
  content: string
  keywords: string[]
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ============================================
  // INSURANCE FUNDAMENTALS
  // ============================================
  {
    id: "deductible-explained",
    category: "Insurance Basics",
    title: "Understanding Deductibles",
    content: `A deductible is the amount you pay out-of-pocket before your insurance kicks in. For example, if you have a $1,000 deductible and a $5,000 medical bill, you pay the first $1,000 and insurance covers the remaining $4,000 (subject to coinsurance).

Key points:
- Higher deductible = Lower monthly premium
- Lower deductible = Higher monthly premium
- Choose based on your health needs and financial cushion
- Preventive care is often covered before meeting your deductible

State Farm Tip: If you rarely visit the doctor, a high-deductible health plan (HDHP) paired with an HSA can save you money while building tax-free savings.`,
    keywords: ["deductible", "out of pocket", "premium", "hdhp", "high deductible"]
  },
  {
    id: "premium-basics",
    category: "Insurance Basics",
    title: "What is a Premium?",
    content: `A premium is your monthly payment to maintain insurance coverage, regardless of whether you use it. Think of it like a subscription fee for protection.

Factors affecting your premium:
- Age and location
- Coverage level and deductible choice
- Health status (for some plans)
- Tobacco use
- Number of people covered

Budget tip: Your total healthcare cost = Premiums + Deductibles + Copays + Coinsurance. Balance these based on your expected healthcare usage.`,
    keywords: ["premium", "monthly payment", "cost", "insurance cost", "payment"]
  },
  {
    id: "copay-coinsurance",
    category: "Insurance Basics",
    title: "Copays vs Coinsurance",
    content: `Copay: A fixed amount you pay for a service (e.g., $25 for a doctor visit, $10 for generic drugs).

Coinsurance: A percentage you pay after meeting your deductible (e.g., 20% of a hospital bill).

Example: After a $1,000 deductible, you might pay 20% coinsurance on a $10,000 surgery = $2,000.

The out-of-pocket maximum protects you - once you reach it, insurance covers 100% for the rest of the year.`,
    keywords: ["copay", "coinsurance", "out of pocket maximum", "percentage", "fixed amount"]
  },
  {
    id: "network-providers",
    category: "Insurance Basics",
    title: "In-Network vs Out-of-Network",
    content: `Insurance companies negotiate lower rates with specific doctors and hospitals - these are "in-network" providers.

In-Network Benefits:
- Lower costs (insurance pays more)
- Predictable copays
- Counts toward your deductible

Out-of-Network Risks:
- Higher costs (you pay more)
- May not count toward deductible
- Balance billing possible (provider charges you the difference)

Always verify a provider is in-network before scheduling appointments. Emergency care is typically covered at in-network rates regardless of where you go.`,
    keywords: ["network", "in network", "out of network", "provider", "doctor", "hospital"]
  },

  // ============================================
  // HEALTH INSURANCE TYPES
  // ============================================
  {
    id: "hmo-ppo-epo",
    category: "Health Plans",
    title: "HMO vs PPO vs EPO Plans",
    content: `HMO (Health Maintenance Organization):
- Requires primary care physician (PCP) referrals to see specialists
- Must stay in-network (except emergencies)
- Lower premiums, more restrictions
- Best for: Budget-conscious, don't need many specialists

PPO (Preferred Provider Organization):
- No referrals needed for specialists
- Can see out-of-network providers (at higher cost)
- Higher premiums, more flexibility
- Best for: Those wanting freedom to choose providers

EPO (Exclusive Provider Organization):
- No referrals needed
- Must stay in-network (no out-of-network coverage except emergencies)
- Medium premiums, moderate flexibility
- Best for: Those comfortable with a specific network`,
    keywords: ["hmo", "ppo", "epo", "health plan", "plan type", "referral", "specialist"]
  },
  {
    id: "hdhp-hsa",
    category: "Health Plans",
    title: "High-Deductible Plans & HSA",
    content: `High-Deductible Health Plan (HDHP):
- 2024 minimum deductible: $1,600 individual / $3,200 family
- Lower monthly premiums
- Paired with Health Savings Account (HSA)

HSA Benefits (Triple Tax Advantage):
1. Contributions are tax-deductible
2. Growth is tax-free
3. Withdrawals for medical expenses are tax-free

2024 HSA Contribution Limits:
- Individual: $4,150
- Family: $8,300
- Age 55+: Additional $1,000 catch-up

HSA funds roll over year to year - it's like a retirement account for healthcare!`,
    keywords: ["hdhp", "hsa", "health savings", "high deductible", "tax advantage", "savings account"]
  },

  // ============================================
  // LIFE INSURANCE
  // ============================================
  {
    id: "term-vs-whole",
    category: "Life Insurance",
    title: "Term vs Whole Life Insurance",
    content: `Term Life Insurance:
- Coverage for a specific period (10, 20, 30 years)
- Lower premiums
- No cash value
- Best for: Temporary needs (mortgage, kids' college years)

Whole Life Insurance:
- Lifetime coverage
- Higher premiums
- Builds cash value over time
- Best for: Estate planning, permanent needs

How much coverage? Common rule: 10-12x your annual income, plus debts, minus assets.

State Farm recommends: Start with affordable term coverage while young, then evaluate whole life for estate planning needs.`,
    keywords: ["term life", "whole life", "life insurance", "coverage amount", "beneficiary", "death benefit"]
  },

  // ============================================
  // AUTO INSURANCE
  // ============================================
  {
    id: "auto-coverage-types",
    category: "Auto Insurance",
    title: "Auto Insurance Coverage Types",
    content: `Liability Coverage (Required in most states):
- Bodily Injury: Covers others' medical bills if you cause an accident
- Property Damage: Covers damage to others' property

Collision Coverage:
- Pays for your car repairs regardless of fault
- Subject to your deductible

Comprehensive Coverage:
- Covers non-collision damage: theft, vandalism, weather, animals
- Often called "other than collision"

Uninsured/Underinsured Motorist:
- Protects you when the other driver lacks adequate insurance
- Highly recommended in all states

State Farm Tip: Bundle auto + home insurance for significant discounts (often 15-25% off).`,
    keywords: ["auto insurance", "car insurance", "liability", "collision", "comprehensive", "uninsured motorist"]
  },

  // ============================================
  // HOME/RENTERS INSURANCE
  // ============================================
  {
    id: "homeowners-coverage",
    category: "Home Insurance",
    title: "Homeowners Insurance Explained",
    content: `Standard Homeowners Policy Covers:
- Dwelling: Your home's structure
- Personal Property: Belongings inside
- Liability: If someone is injured on your property
- Additional Living Expenses: Hotel costs if home is uninhabitable

What's NOT Covered:
- Floods (requires separate flood insurance)
- Earthquakes (requires separate policy or endorsement)
- Normal wear and tear
- Intentional damage

Coverage tip: Insure for replacement cost, not market value. It costs more to rebuild than to buy an existing home.`,
    keywords: ["homeowners", "home insurance", "dwelling", "personal property", "liability", "flood"]
  },
  {
    id: "renters-insurance",
    category: "Home Insurance",
    title: "Why Renters Insurance Matters",
    content: `Your landlord's insurance does NOT cover your belongings. Renters insurance protects:

- Personal Property: Furniture, electronics, clothing, etc.
- Liability: If someone is injured in your apartment
- Additional Living Expenses: If you're displaced due to covered damage

Average cost: $15-30/month for $30,000+ in coverage

Pro tip: Create a home inventory with photos/videos of your belongings. Store it in the cloud so you can access it if disaster strikes.`,
    keywords: ["renters insurance", "apartment", "tenant", "personal belongings", "liability"]
  },

  // ============================================
  // EMERGENCY PLANNING
  // ============================================
  {
    id: "emergency-fund",
    category: "Financial Planning",
    title: "Building Your Emergency Fund",
    content: `An emergency fund is your financial safety net for unexpected expenses: job loss, medical bills, car repairs, home emergencies.

How much to save:
- Starter goal: $1,000 for immediate emergencies
- Standard goal: 3-6 months of essential expenses
- Enhanced goal: 6-12 months if self-employed or single income

Where to keep it:
- High-yield savings account (easy access, earns interest)
- NOT in investments (too risky for emergencies)

Building strategy:
1. Calculate monthly essential expenses
2. Set a target (3-6 months worth)
3. Automate savings (even $50/paycheck helps)
4. Treat it as non-negotiable`,
    keywords: ["emergency fund", "savings", "job loss", "unexpected expenses", "financial safety"]
  },
  {
    id: "disability-insurance",
    category: "Financial Planning",
    title: "Protecting Your Income with Disability Insurance",
    content: `Your ability to earn income is your most valuable asset. Disability insurance replaces a portion of your income if you can't work due to illness or injury.

Types:
- Short-term disability: Covers weeks to months
- Long-term disability: Covers months to years (or until retirement)

Coverage amount:
- Typically 50-70% of pre-disability income
- Employer plans may be taxable; private plans often tax-free

Key terms:
- Own-occupation: Pays if you can't do YOUR job
- Any-occupation: Pays only if you can't do ANY job (harder to qualify)

Stat: 1 in 4 workers will experience a disability before retirement. Don't skip this coverage.`,
    keywords: ["disability insurance", "income protection", "short term disability", "long term disability", "unable to work"]
  },

  // ============================================
  // RETIREMENT
  // ============================================
  {
    id: "401k-basics",
    category: "Retirement",
    title: "401(k) Fundamentals",
    content: `A 401(k) is an employer-sponsored retirement account with tax advantages.

Traditional 401(k):
- Contributions reduce your taxable income NOW
- Pay taxes when you withdraw in retirement
- Best if you expect lower tax bracket in retirement

Roth 401(k):
- Contributions are after-tax (no immediate tax break)
- Withdrawals in retirement are TAX-FREE
- Best if you expect higher tax bracket in retirement

2024 Contribution Limits:
- Under 50: $23,000
- Age 50+: $30,500 (includes catch-up)

Golden rule: ALWAYS contribute enough to get your employer's full match - it's free money!`,
    keywords: ["401k", "retirement", "employer match", "roth", "traditional", "contribution"]
  },
  {
    id: "ira-options",
    category: "Retirement",
    title: "Traditional vs Roth IRA",
    content: `IRAs (Individual Retirement Accounts) offer additional retirement savings beyond employer plans.

Traditional IRA:
- Tax-deductible contributions (income limits apply)
- Taxed on withdrawal
- Required Minimum Distributions (RMDs) at 73

Roth IRA:
- After-tax contributions
- Tax-free growth and withdrawals
- No RMDs during your lifetime
- Income limits: $161,000 single / $240,000 married (2024)

2024 Contribution Limits:
- Under 50: $7,000
- Age 50+: $8,000

Strategy: If eligible, a Roth IRA provides valuable tax diversification in retirement.`,
    keywords: ["ira", "roth ira", "traditional ira", "retirement account", "tax free", "rmd"]
  },

  // ============================================
  // ENROLLMENT & CLAIMS
  // ============================================
  {
    id: "open-enrollment",
    category: "Enrollment",
    title: "Open Enrollment Explained",
    content: `Open Enrollment is the annual window to enroll in or change your health insurance.

Employer Plans:
- Typically fall (Oct-Nov) for Jan 1 coverage
- Review all options - don't just auto-renew
- Consider life changes (marriage, baby, health changes)

Marketplace (Healthcare.gov):
- Nov 1 - Jan 15 annually
- May qualify for subsidies based on income
- Compare Bronze/Silver/Gold/Platinum tiers

Special Enrollment Period (SEP):
You can enroll outside open enrollment if you experience a qualifying life event:
- Marriage or divorce
- Having a baby or adopting
- Losing other coverage
- Moving to a new area

Don't miss your window - you may be stuck without coverage until next year!`,
    keywords: ["open enrollment", "enrollment period", "qualifying event", "marketplace", "special enrollment"]
  },
  {
    id: "filing-claims",
    category: "Claims",
    title: "How to File Insurance Claims",
    content: `For Health Insurance:
- In-network providers usually file for you
- Keep Explanation of Benefits (EOB) documents
- Review bills for errors before paying

For Auto Claims:
1. Document the scene (photos, police report)
2. Contact your insurance within 24-48 hours
3. Get repair estimates
4. Work with assigned adjuster

For Home Claims:
1. Prevent further damage (temporary repairs OK)
2. Document everything with photos/video
3. Create inventory of damaged items
4. Get estimates; don't discard items until adjuster sees them

Pro tip: Keep a claims journal with dates, names, and reference numbers for every conversation.`,
    keywords: ["claim", "file claim", "insurance claim", "adjuster", "eob", "documentation"]
  },

  // ============================================
  // STATE FARM SPECIFIC
  // ============================================
  {
    id: "statefarm-good-neighbor",
    category: "State Farm",
    title: "The Good Neighbor Promise",
    content: `State Farm's mission: "Like a good neighbor, State Farm is there."

What this means for you:
- Local agents who know your community
- 24/7 claims support
- Personalized coverage recommendations
- Multi-policy discounts
- Drive Safe & Save® program for safe drivers

State Farm is the #1 auto and home insurer in the U.S., serving over 85 million policies.

Our commitment: Help you protect what matters most - your family, your home, your future.`,
    keywords: ["state farm", "good neighbor", "agent", "local", "trust"]
  },
  {
    id: "bundling-discounts",
    category: "State Farm",
    title: "Save with Multi-Policy Discounts",
    content: `Bundling multiple policies with State Farm can save you significantly:

Common bundles:
- Auto + Home: Save up to 25%
- Auto + Renters: Save up to 20%
- Home + Life: Additional savings

Other discounts available:
- Multi-car discount
- Good driver discount
- Good student discount
- Defensive driving course discount
- Loyalty discount
- Paperless billing discount

Talk to your State Farm agent to maximize your savings while ensuring you have the right coverage.`,
    keywords: ["bundle", "discount", "multi-policy", "save money", "combine"]
  }
]

/**
 * Simple keyword-based RAG retrieval
 * Returns top-K most relevant knowledge entries for a query
 */
export function retrieveRelevantKnowledge(query: string, topK: number = 3): KnowledgeEntry[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  // Score each entry based on keyword matches
  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0
    const contentLower = entry.content.toLowerCase()
    const titleLower = entry.title.toLowerCase()

    // Check keywords
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) {
        score += 10 // Strong match on keywords
      }
    }

    // Check title words
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 5
      }
      if (contentLower.includes(word)) {
        score += 1
      }
    }

    // Boost for exact phrase matches
    if (contentLower.includes(queryLower)) {
      score += 15
    }

    return { entry, score }
  })

  // Sort by score and return top-K
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.entry)
}

/**
 * Format retrieved knowledge for injection into AI prompt
 */
export function formatKnowledgeContext(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) {
    return ""
  }

  const formatted = entries
    .map((e, i) => `[Source ${i + 1}: ${e.title}]\n${e.content}`)
    .join("\n\n---\n\n")

  return `RELEVANT INSURANCE & FINANCIAL GUIDANCE:\n\n${formatted}\n\n---\n\n`
}
