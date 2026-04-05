/**
 * State Farm Financial Wellness Knowledge Base
 * RAG content sourced from real State Farm policies and financial guidance
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
  // AUTO INSURANCE — Real State Farm Products
  // ============================================
  {
    id: "sf-auto-liability",
    category: "Auto Insurance",
    title: "State Farm Auto Liability Coverage",
    content: `Liability coverage is required in most states and is the foundation of any auto policy. It protects you financially if you cause an accident.

Bodily Injury Liability: Covers medical expenses, pain and suffering, and lost wages for people you injure in an at-fault accident. It also covers your legal defense costs if you're sued.

Property Damage Liability: Covers damage you cause to another person's vehicle, fence, building, or other property.

Coverage limits are expressed as three numbers (e.g., 100/300/100):
- $100,000 per person for bodily injury
- $300,000 per accident for bodily injury
- $100,000 per accident for property damage

State Farm Recommendation: Carry limits that protect your total assets. If your net worth exceeds your policy limits, you could be personally liable for the difference. Consider a State Farm Personal Liability Umbrella Policy for extra protection.`,
    keywords: ["liability", "bodily injury", "property damage", "at fault", "accident", "auto insurance", "car insurance", "minimum coverage"]
  },
  {
    id: "sf-auto-collision-comprehensive",
    category: "Auto Insurance",
    title: "Collision & Comprehensive Coverage",
    content: `Collision Coverage: Helps pay to repair or replace your vehicle if it's damaged in a crash with another vehicle or object (tree, guardrail, pothole), or if it overturns — regardless of who is at fault. You choose a deductible ($250, $500, $1,000) that you pay before insurance kicks in.

Comprehensive Coverage: Helps pay to repair or replace your vehicle for damage from events OTHER than collisions:
- Theft or attempted theft
- Fire, hail, windstorm, flood
- Vandalism
- Hitting an animal (e.g., deer)
- Falling objects
- Glass/windshield damage

Key Decision: Higher deductible = lower premium. If your car is older and worth less than 10x your annual premium cost, you might consider dropping collision/comprehensive.

State Farm Tip: If you're financing or leasing your vehicle, your lender will likely require both collision and comprehensive coverage.`,
    keywords: ["collision", "comprehensive", "full coverage", "deductible", "theft", "vandalism", "hail", "windshield", "deer", "car damage"]
  },
  {
    id: "sf-auto-uninsured",
    category: "Auto Insurance",
    title: "Uninsured & Underinsured Motorist Coverage",
    content: `Uninsured Motorist (UM) Coverage: Protects you if you're injured by a driver who has NO insurance. It can cover:
- Medical bills
- Lost wages
- Pain and suffering

Underinsured Motorist (UIM) Coverage: Kicks in when the at-fault driver's insurance isn't enough to cover your damages.

Real-world context: About 1 in 8 drivers nationwide is uninsured. In some states, the rate is even higher.

State Farm strongly recommends this coverage. It's one of the most affordable additions to your policy and provides critical protection. Without it, you could be stuck paying thousands in medical bills out of pocket if hit by an uninsured driver.

Additional options:
- Medical Payments (Med Pay): Covers medical expenses for you and your passengers regardless of fault
- Personal Injury Protection (PIP): Required in no-fault states; covers medical expenses, lost wages, and other costs`,
    keywords: ["uninsured motorist", "underinsured", "hit and run", "no insurance", "med pay", "pip", "personal injury protection"]
  },
  {
    id: "sf-auto-additional",
    category: "Auto Insurance",
    title: "Additional Auto Coverage Options",
    content: `State Farm offers several additional auto coverages:

Emergency Roadside Service: Helps with towing, flat tire changes, battery jump-starts, lockout assistance, and fuel delivery. Available 24/7.

Rental Reimbursement: Helps cover the cost of a rental car while your vehicle is being repaired after a covered claim. Typical limits are $25-$50/day.

Rideshare Driver Coverage: If you drive for Uber, Lyft, or other rideshare services, standard auto policies may not cover you while you're logged into the app. State Farm offers rideshare coverage to fill this gap.

Gap Coverage: If your car is totaled and you owe more on your loan than the car is worth, gap coverage pays the difference.

Custom Equipment Coverage: Covers aftermarket modifications like custom wheels, sound systems, or lift kits.`,
    keywords: ["roadside", "rental car", "rideshare", "uber", "lyft", "gap coverage", "towing", "rental reimbursement"]
  },

  // ============================================
  // AUTO DISCOUNTS — Real State Farm Programs
  // ============================================
  {
    id: "sf-drive-safe-save",
    category: "Auto Discounts",
    title: "Drive Safe & Save® Program",
    content: `Drive Safe & Save® is State Farm's telematics-based discount program that rewards safe driving habits.

How it works:
1. Enroll through the State Farm mobile app or with a compatible connected vehicle
2. The app/device tracks driving behaviors: speed, braking, acceleration, phone usage, time of day
3. You receive an immediate enrollment discount
4. Additional savings based on your actual driving data — up to 30% off your auto premium

What's tracked:
- Hard braking events
- Rapid acceleration
- Phone usage while driving
- Time of day (late night driving)
- Total miles driven

Privacy: State Farm uses driving data ONLY for discount purposes. You can opt out at any time.

Who should enroll: Anyone who considers themselves a safe, low-mileage driver. Even the enrollment discount saves money immediately.`,
    keywords: ["drive safe save", "telematics", "safe driving", "app", "driving habits", "discount program", "usage based"]
  },
  {
    id: "sf-auto-discounts-all",
    category: "Auto Discounts",
    title: "All State Farm Auto Insurance Discounts",
    content: `State Farm offers extensive auto insurance discounts (availability varies by state):

Driver-Based:
- Safe Driver: Clean record for 3-5 years (no at-fault accidents or violations)
- Good Student: Full-time students under 25 with B average or better — up to 25% savings
- Steer Clear®: Safe driving program for drivers under 25
- Driver Training: Young drivers who complete approved driver education courses
- Student Away at School: Students under 25 living 100+ miles from home without their car

Vehicle-Based:
- Vehicle Safety Features: Airbags, anti-lock brakes, daytime running lights
- Anti-Theft Device: Alarms, tracking systems, VIN etching
- Passive Restraint: Automatic seatbelts, airbag systems
- New Car: Vehicles less than 3 years old may qualify

Loyalty & Bundling:
- Multi-Policy Bundle: Combine auto + home/renters/life — save up to 17%
- Multi-Car: Insure 2+ vehicles — save up to 20%
- Loyalty Discount: Long-term State Farm customers
- Paid-in-Full: Pay your entire premium upfront
- Paperless: Enroll in e-statements and online billing

Military:
- Military discount for active duty, reserve, and veterans`,
    keywords: ["discount", "save money", "good student", "multi car", "bundle", "steer clear", "safe driver", "military"]
  },

  // ============================================
  // HOMEOWNERS INSURANCE — Real State Farm Products
  // ============================================
  {
    id: "sf-homeowners-policy",
    category: "Home Insurance",
    title: "State Farm Homeowners Insurance Policies",
    content: `State Farm offers several homeowners policy types:

HO-03 (Special Form) — Most Common:
- All-risk coverage for dwelling and other structures (covers everything UNLESS specifically excluded)
- Named-perils coverage for personal property
- Includes liability and medical payments coverage

HO-05 (Comprehensive Form) — Premium Protection:
- All-risk coverage for BOTH dwelling AND personal property
- Broadest coverage available
- Ideal for homeowners wanting maximum protection

HO-08 (Modified Form):
- For older or unique homes where rebuilding cost exceeds market value
- Named-perils coverage on actual cash value basis

All policies include these coverage areas:
- Dwelling: Your home's structure and attached structures (garage, deck)
- Other Structures: Detached garage, shed, fence
- Personal Property: Furniture, electronics, clothing, appliances
- Loss of Use: Hotel, meals, and living expenses if your home is uninhabitable
- Personal Liability: Legal defense and damages if someone is injured on your property
- Medical Payments: Limited medical coverage for injured guests (regardless of fault)

State Farm also offers Inflation Coverage to automatically adjust your dwelling limit with rising construction costs.`,
    keywords: ["homeowners", "home insurance", "dwelling", "personal property", "liability", "ho-03", "ho-05", "house insurance"]
  },
  {
    id: "sf-home-exclusions",
    category: "Home Insurance",
    title: "What Homeowners Insurance Does NOT Cover",
    content: `Standard State Farm homeowners policies do NOT cover:

Flood Damage: Requires a separate flood insurance policy. State Farm can help you purchase flood insurance through the National Flood Insurance Program (NFIP) or private carriers.

Earthquakes: Requires a separate earthquake policy or endorsement. Important in CA, OR, WA, and other seismic zones.

Normal Wear & Tear: Gradual deterioration, maintenance issues, and aging are your responsibility as a homeowner.

Sewer/Water Backup: NOT covered by standard policies, but State Farm offers a Water Backup and Sump Discharge endorsement you can add.

High-Value Items: Standard policies have limited coverage for:
- Jewelry: Typically capped at $1,000-$2,500
- Fine art, collectibles, silverware
- Business equipment used at home
- Solution: Add a State Farm Personal Articles Policy for scheduled coverage at agreed-upon value with no deductible

Intentional Damage: Any damage you cause on purpose is never covered.

Dog Bites: Some breeds may be excluded from liability coverage depending on your state.

Recommended add-ons: Water backup coverage, Personal Articles Policy, and an umbrella policy for extra liability protection.`,
    keywords: ["flood", "earthquake", "exclusion", "not covered", "water backup", "jewelry", "personal articles", "sewer"]
  },
  {
    id: "sf-renters-insurance",
    category: "Home Insurance",
    title: "State Farm Renters Insurance",
    content: `Your landlord's insurance covers the building — NOT your belongings. Renters insurance from State Farm protects what's yours.

What's Covered:
- Personal Property: Furniture, electronics, clothing, kitchen items — protected against fire, theft, vandalism, smoke damage, windstorm, and more
- Personal Liability: If someone is injured in your apartment or you accidentally damage someone else's property — covers legal defense and damages (typically $100,000-$300,000)
- Loss of Use: If your rental becomes uninhabitable due to a covered loss, helps pay for temporary housing, meals, and other extra expenses
- Medical Payments to Others: Covers limited medical bills for guests injured in your home regardless of fault

Cost: State Farm renters insurance averages $15-$30/month for $30,000+ in personal property coverage. One of the most affordable insurance products available.

Pro Tips:
1. Create a home inventory with photos and receipts — store in the cloud
2. Choose replacement cost coverage (pays to replace items at today's prices) over actual cash value (factors in depreciation)
3. Bundle renters + auto insurance with State Farm for multi-policy savings of up to 17%
4. Your policy covers your belongings EVERYWHERE — including theft from your car or while traveling`,
    keywords: ["renters insurance", "apartment", "tenant", "landlord", "personal belongings", "renter", "renting", "lease"]
  },

  // ============================================
  // LIFE INSURANCE — Real State Farm Products
  // ============================================
  {
    id: "sf-term-life",
    category: "Life Insurance",
    title: "State Farm Term Life Insurance Products",
    content: `State Farm offers several term life insurance options:

Select Term: The most popular option
- Available in 10, 20, or 30-year terms
- Guaranteed level premiums for the entire initial term
- Can be renewed annually after the term expires (up to age 95) at higher rates
- Convertible to permanent insurance without a medical exam

Return of Premium Term:
- Available in 20 or 30-year terms
- If you outlive the term, ALL your premiums are returned to you
- Higher premiums than Select Term, but you get your money back if you don't use it
- A good option if you want coverage but don't want to "waste" premium dollars

Instant Answer Term:
- Up to $50,000 in coverage
- Simplified application — no medical exam required
- Quick approval process
- Designed for final expenses or small debts

Mortgage Term:
- 15 or 30-year options (matched to your mortgage)
- Coverage decreases over time as your mortgage balance goes down
- Specifically designed to pay off your remaining mortgage if you pass away

How much do you need? Common guidelines:
- 10-12x your annual income
- Plus outstanding debts (mortgage, student loans, car loans)
- Plus future expenses (children's college tuition)
- Minus existing savings and assets`,
    keywords: ["term life", "life insurance", "death benefit", "beneficiary", "select term", "return of premium", "20 year", "30 year", "coverage amount"]
  },
  {
    id: "sf-permanent-life",
    category: "Life Insurance",
    title: "State Farm Whole & Universal Life Insurance",
    content: `State Farm permanent life insurance options provide lifetime coverage plus cash value:

Whole Life Insurance:
- Guaranteed level premiums that never increase
- Guaranteed death benefit for your beneficiaries
- Cash value accumulates tax-deferred over time
- May earn non-guaranteed dividends
- Variations:
  • Traditional Whole Life: Premiums paid for life or until paid-up age
  • Limited Pay Life: Premiums paid over 10, 15, or 20 years — then policy is fully paid up
  • Guaranteed Issue Whole Life: $10,000-$15,000 coverage with no medical exam or health questions — designed for final expenses

Universal Life Insurance:
- Flexible premiums — adjust payment amounts as your finances change
- Adjustable death benefit — increase or decrease as needs change
- Account value earns interest (rate may change monthly, but never below guaranteed minimum)
- More flexibility than whole life, same permanent protection
- Variations:
  • Survivorship Universal Life: Covers two people, pays on LAST death (estate planning)
  • Joint Universal Life: Covers two people, pays on FIRST death

Popular Riders Available:
- Children's Term Rider: Term coverage for your kids, convertible to permanent at age 25
- Guaranteed Insurability Option: Buy more coverage later without a medical exam
- Flexible Care Benefit: Access death benefit early if you become chronically ill
- Accidental Death Benefit: Extra payout if death is due to an accident
- Disability Waiver: Waives premiums during total disability`,
    keywords: ["whole life", "universal life", "permanent life", "cash value", "dividends", "estate planning", "riders", "guaranteed issue"]
  },

  // ============================================
  // HEALTH & SUPPLEMENTAL — Real Products
  // ============================================
  {
    id: "sf-health-supplemental",
    category: "Health Insurance",
    title: "State Farm Health & Supplemental Insurance",
    content: `State Farm offers supplemental health and accident coverage to fill gaps in primary health insurance:

Supplemental Health Insurance:
- Pays cash benefits directly to you when you're hospitalized or have a covered medical event
- Use the money for anything: medical bills, mortgage, groceries, childcare
- Doesn't replace primary health insurance — works alongside it

Hospital Indemnity Insurance:
- Pays a set daily benefit for each day you're hospitalized
- Helps cover deductibles, coinsurance, and non-medical costs during a hospital stay
- No network restrictions — pays regardless of which hospital you use

Accident Insurance:
- Provides cash benefits for accidental injuries
- Covers treatment costs like X-rays, ER visits, ambulance rides, physical therapy
- Especially valuable for active families and those with high-deductible health plans

Disability Insurance:
- Short-term disability: Covers weeks to months of income loss
- Long-term disability: Covers months to years (or until retirement)
- Typically replaces 50-70% of pre-disability income
- Own-occupation vs. any-occupation definitions matter — ask your agent

Critical stat: 1 in 4 workers will experience a disability before retirement age. Protecting your income is just as important as protecting your home and car.`,
    keywords: ["health insurance", "supplemental", "hospital", "disability", "accident insurance", "income protection", "indemnity"]
  },

  // ============================================
  // FINANCIAL PLANNING
  // ============================================
  {
    id: "sf-emergency-fund",
    category: "Financial Planning",
    title: "Building Your Emergency Fund",
    content: `An emergency fund provides a financial safety net for unexpected expenses like job loss, medical emergencies, car breakdowns, or home repairs.

How much to save:
- Starter goal: $1,000 for immediate emergencies
- Standard goal: 3-6 months of essential expenses
- Enhanced goal: 6-12 months if self-employed, single income, or in an unstable industry

What counts as "essential expenses":
- Housing (rent/mortgage)
- Utilities (electric, water, gas, internet)
- Food and groceries
- Insurance premiums
- Minimum debt payments
- Transportation
- Childcare

Where to keep it:
- High-yield savings account (4-5% APY available in 2024-2025)
- Money market account
- NOT in stocks, CDs, or retirement accounts (needs to be liquid and accessible)

Building strategy:
1. Calculate your monthly essential expenses
2. Set your target (e.g., 3 months = essentials × 3)
3. Open a separate high-yield savings account (separation reduces temptation)
4. Set up automatic transfers — even $25/week adds up to $1,300/year
5. Direct windfalls to your fund: tax refunds, bonuses, gift money
6. Once funded, redirect savings to retirement or other goals

State Farm Tip: Adequate emergency savings reduces the need for insurance claims and helps you choose higher deductibles, which lowers your premiums.`,
    keywords: ["emergency fund", "savings", "job loss", "unexpected expenses", "financial safety", "rainy day", "safety net"]
  },
  {
    id: "sf-retirement-401k-ira",
    category: "Financial Planning",
    title: "Retirement Savings: 401(k) & IRA Basics",
    content: `Building retirement savings is one of the most impactful financial decisions you can make.

401(k) Plans (Employer-Sponsored):
- Traditional 401(k): Pre-tax contributions reduce taxable income now; pay taxes in retirement
- Roth 401(k): After-tax contributions; withdrawals in retirement are TAX-FREE
- 2024 contribution limits: $23,000 (under 50) / $30,500 (age 50+)
- ALWAYS contribute enough to get your full employer match — it's 100% free money
- Even a 1% increase in contribution rate can add tens of thousands over a career

IRA (Individual Retirement Account):
- Traditional IRA: Tax-deductible contributions; taxed on withdrawal; RMDs at age 73
- Roth IRA: After-tax contributions; tax-free growth AND withdrawals; no RMDs
- 2024 limits: $7,000 (under 50) / $8,000 (age 50+)
- Roth IRA income limits: $161,000 (single) / $240,000 (married filing jointly)

Strategy by Age:
- 20s-30s: Maximize Roth contributions (you're in a lower tax bracket now)
- 30s-40s: Balance traditional and Roth for tax diversification
- 40s-50s: Catch-up contributions; review asset allocation
- 50s-60s: Shift to more conservative investments; plan withdrawal strategy

Rule of thumb: Save 15% of gross income for retirement (including employer match).

State Farm also offers investment products through State Farm VP Management Corp. Talk to your agent about retirement planning options.`,
    keywords: ["401k", "retirement", "ira", "roth", "employer match", "contribution", "retirement savings", "investing"]
  },

  // ============================================
  // INSURANCE FUNDAMENTALS
  // ============================================
  {
    id: "sf-deductible-explained",
    category: "Insurance Basics",
    title: "Understanding Deductibles",
    content: `A deductible is the amount you pay out-of-pocket before your insurance starts paying. It applies to most insurance types: health, auto, home, etc.

How it works with a $1,000 deductible:
- $5,000 medical bill → You pay $1,000, insurance pays $4,000 (minus coinsurance)
- $800 medical bill → You pay the full $800 (haven't met deductible)
- $3,000 auto repair → You pay $1,000, insurance pays $2,000

The deductible trade-off:
- Higher deductible = Lower monthly premium (you accept more risk)
- Lower deductible = Higher monthly premium (insurance accepts more risk)

Choosing the right deductible:
- If you have a healthy emergency fund ($3,000+), consider a higher deductible to save on premiums
- If a $1,000 surprise expense would be devastating, keep a lower deductible
- Health insurance: preventive care (annual checkups, vaccines) is often covered BEFORE meeting your deductible

Special types:
- Annual deductible (health): Resets each calendar year
- Per-incident deductible (auto/home): Applies to each separate claim
- Family deductible (health): Aggregate for all family members

State Farm Tip: A high-deductible health plan (HDHP) paired with a Health Savings Account (HSA) can save you money through triple tax advantages while building a healthcare nest egg.`,
    keywords: ["deductible", "out of pocket", "premium", "hdhp", "high deductible", "copay", "coinsurance"]
  },
  {
    id: "sf-hmo-ppo-plans",
    category: "Health Plans",
    title: "HMO vs PPO vs EPO Health Plans",
    content: `Choosing the right health plan type affects your costs, flexibility, and provider access:

HMO (Health Maintenance Organization):
- Requires choosing a Primary Care Physician (PCP)
- Need referrals to see specialists
- Must stay in-network (except emergencies)
- Lowest premiums, most restrictions
- Best for: Budget-conscious people who don't need many specialists

PPO (Preferred Provider Organization):
- No referrals needed for specialists
- Can see out-of-network providers (at higher cost)
- Higher premiums, maximum flexibility
- Best for: People who want freedom to choose any doctor/specialist

EPO (Exclusive Provider Organization):
- No referrals needed for specialists
- Must stay in-network (no out-of-network coverage except emergencies)
- Medium premiums, moderate flexibility
- Best for: People comfortable within a network who want specialist access without referrals

HDHP (High-Deductible Health Plan):
- Higher deductible ($1,600+ individual / $3,200+ family in 2024)
- Lower premiums
- Eligible for Health Savings Account (HSA)
- HSA triple tax advantage: tax-deductible contributions, tax-free growth, tax-free medical withdrawals
- 2024 HSA limits: $4,150 individual / $8,300 family

Decision framework:
- Low healthcare use + healthy → HDHP with HSA (save money, build tax-free savings)
- Moderate use + want flexibility → PPO or EPO
- High use + chronic conditions → HMO or low-deductible PPO
- Family with kids → Consider total out-of-pocket max, not just premiums`,
    keywords: ["hmo", "ppo", "epo", "hdhp", "health plan", "referral", "specialist", "network", "hsa", "health savings"]
  },

  // ============================================
  // CLAIMS PROCESS
  // ============================================
  {
    id: "sf-claims-process",
    category: "Claims",
    title: "How to File a State Farm Insurance Claim",
    content: `State Farm offers multiple ways to file a claim, with 24/7 support:

Filing Methods:
1. State Farm Mobile App (fastest)
2. Call 1-800-SF-CLAIM (1-800-732-5246) — available 24/7
3. Contact your local State Farm agent
4. Online at statefarm.com

Auto Claims Process:
1. Ensure everyone is safe; call 911 if needed
2. Document the scene: photos of damage, road conditions, license plates
3. Exchange info with other drivers (insurance, contact info)
4. Get a police report if applicable
5. File your claim within 24-48 hours
6. State Farm assigns a claims specialist
7. Get repair estimates or use a State Farm Select Service® shop
8. Choose your repair shop — State Farm guarantees repairs at Select Service locations

Homeowners Claims:
1. Prevent further damage (temporary repairs are OK — save receipts)
2. Document ALL damage with photos and video before cleaning up
3. Make a detailed inventory of damaged/destroyed items
4. File your claim promptly
5. DO NOT discard damaged items until the adjuster inspects them
6. Your claims specialist will walk you through the process

Health Claims:
- In-network providers typically file claims for you
- Keep all Explanation of Benefits (EOB) documents
- Review medical bills for errors before paying (billing errors are common)
- You have the right to appeal denied claims

Pro tip: Keep a claims journal with dates, representative names, reference numbers, and summaries of every conversation.`,
    keywords: ["claim", "file claim", "insurance claim", "adjuster", "accident", "documentation", "police report", "select service"]
  },

  // ============================================
  // STATE FARM COMPANY — Real Facts
  // ============================================
  {
    id: "sf-about-company",
    category: "State Farm",
    title: "About State Farm Insurance",
    content: `State Farm is the largest property-casualty insurance company in the United States.

Company Facts:
- Founded: 1922 by George J. Mecherle in Bloomington, Illinois
- Headquarters: Bloomington, Illinois
- Structure: Mutual company (owned by policyholders, not shareholders)
- Customers: Over 85 million policies and accounts
- Agents: 19,000+ exclusive agents nationwide
- Motto: "Like a good neighbor, State Farm is there."®

Rankings:
- #1 auto insurer in the U.S.
- #1 home insurer in the U.S.
- Fortune 500 company (consistently ranked in top 50)

What it means to be mutual:
- No outside shareholders demanding profits
- Decisions focused on policyholder value
- Potentially lower premiums and higher service quality
- Dividends may be returned to eligible policyholders

State Farm Products:
- Auto, Home, Renters, Condo, Life Insurance
- Health & Supplemental Insurance
- Small Business Insurance
- Banking products (checking, savings, CDs, credit cards)
- Mutual Funds and Investment Products
- Identity Restoration services

24/7 Support: Claims, roadside assistance, and customer service available around the clock.
Find a local agent: statefarm.com/agent`,
    keywords: ["state farm", "good neighbor", "agent", "company", "mutual", "largest insurer", "about"]
  },
  {
    id: "sf-bundling-savings",
    category: "State Farm",
    title: "State Farm Multi-Policy Bundling Savings",
    content: `Bundling multiple policies with State Farm is one of the easiest ways to save significantly on insurance:

Popular Bundles:
- Auto + Homeowners: Save up to 17-25%
- Auto + Renters: Save up to 17-20%
- Auto + Life: Additional savings available
- Auto + Home + Life: Maximum multi-line discount

How bundling helps beyond savings:
1. Single agent: One person who knows your entire insurance picture
2. Simplified billing: Fewer payments, easier to manage
3. Streamlined claims: Your agent can coordinate across policies
4. Better coverage: Your agent can identify gaps across policies

Real example:
- Auto alone: $150/month
- Home alone: $120/month
- Bundled: $230/month (saving $40/month = $480/year)

Additional ways to stack discounts:
- Bundle PLUS multi-car PLUS Drive Safe & Save = maximum savings
- Add a life insurance policy for additional multi-line credit
- Paperless billing adds a small additional discount

Talk to your State Farm agent to build the optimal bundle for your situation. Agents can model different coverage and bundle combinations to find the best value.`,
    keywords: ["bundle", "discount", "multi-policy", "save money", "combine", "multi-line", "package"]
  },

  // ============================================
  // ENROLLMENT & BENEFITS
  // ============================================
  {
    id: "sf-open-enrollment",
    category: "Enrollment",
    title: "Open Enrollment & Life Events",
    content: `Open Enrollment is the annual window to enroll in or change health insurance and employer benefits.

Employer Plans:
- Typically October-November for January 1 coverage
- DON'T just auto-renew! Plans, premiums, and networks change annually
- Review all options and compare total cost (premiums + deductible + max out-of-pocket)
- Consider whether your doctors are still in-network

Healthcare.gov Marketplace:
- Open enrollment: November 1 – January 15 annually
- May qualify for premium subsidies based on household income
- Plan tiers: Bronze (lowest premium/highest deductible) → Silver → Gold → Platinum (highest premium/lowest deductible)

Special Enrollment Period (SEP) — You can enroll OUTSIDE open enrollment if:
- You get married or divorced
- Have a baby or adopt a child
- Lose employer-sponsored coverage
- Move to a new state or coverage area
- Turn 26 and age off parent's plan
- Lose Medicaid/CHIP eligibility

Action items for open enrollment:
1. Review last year's medical expenses to predict next year's needs
2. Check if your doctors and prescriptions are still covered
3. Compare total estimated costs, not just premiums
4. Consider HSA-eligible plans if your employer offers HSA contributions
5. Update beneficiaries on life insurance and retirement accounts
6. Review disability and supplemental insurance options`,
    keywords: ["open enrollment", "enrollment period", "qualifying event", "marketplace", "special enrollment", "benefits", "annual enrollment"]
  },

  // ============================================
  // FINANCIAL LITERACY BASICS
  // ============================================
  {
    id: "sf-budgeting-basics",
    category: "Financial Literacy",
    title: "The 50/30/20 Budgeting Rule",
    content: `The 50/30/20 rule is a simple framework for managing your monthly after-tax income:

50% — Needs (Essential Expenses):
- Housing (rent/mortgage) — aim for under 30% of gross income
- Utilities
- Groceries
- Insurance premiums
- Minimum debt payments
- Transportation
- Childcare

30% — Wants (Discretionary):
- Dining out, entertainment, subscriptions
- Shopping, hobbies, vacations
- Upgrades (better car, nicer apartment)

20% — Savings & Debt Payoff:
- Emergency fund (priority #1 until funded)
- Retirement savings (401k, IRA)
- Extra debt payments above minimums
- Other savings goals (house down payment, education)

Adjustments for different situations:
- High cost-of-living area: May need 60/20/20
- Aggressive debt payoff: Try 50/20/30 (more to savings/debt)
- High income: Consider 40/20/40 to accelerate wealth building

Getting started:
1. Track ALL spending for one month (use an app or spreadsheet)
2. Categorize each expense as need, want, or savings
3. Identify areas to reduce or redirect
4. Automate savings transfers on payday
5. Review and adjust monthly

Insurance tip: Your insurance premiums are "needs" — don't cut coverage to fund wants. Reducing coverage is the most expensive money-saving mistake people make.`,
    keywords: ["budget", "budgeting", "50 30 20", "spending", "money management", "savings rate", "financial plan", "expenses"]
  },
  {
    id: "sf-credit-score",
    category: "Financial Literacy",
    title: "How Your Credit Score Affects Insurance",
    content: `In most states, your credit-based insurance score affects your insurance premiums. Understanding and improving your score can save you hundreds annually.

What insurers look at (credit-based insurance score):
- Payment history (most important): On-time payments show responsibility
- Outstanding debt relative to credit limits (utilization)
- Length of credit history
- Mix of credit types
- Recent credit applications

How it affects insurance:
- Auto insurance: Credit score can impact premiums significantly in most states
- Homeowners insurance: Also uses credit-based scoring
- States that prohibit credit-based insurance pricing: California, Hawaii, Massachusetts, Michigan, Oregon, Washington

Improving your insurance score:
1. Pay all bills on time (set up autopay)
2. Keep credit card balances below 30% of limits (ideally below 10%)
3. Don't close old credit accounts (length of history matters)
4. Limit new credit applications
5. Check your credit reports annually for errors (annualcreditreport.com)
6. Dispute any inaccuracies immediately

Quick wins: Paying down credit card balances and fixing credit report errors can improve your score — and potentially lower your premiums — within months.`,
    keywords: ["credit score", "credit", "fico", "insurance score", "premium", "credit report", "credit card"]
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
      // Partial keyword match
      for (const word of queryWords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 3
        }
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

    // Boost for category match
    if (entry.category.toLowerCase().includes(queryLower)) {
      score += 8
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

  return `RELEVANT STATE FARM INSURANCE & FINANCIAL GUIDANCE:\n\n${formatted}\n\n---\n\n`
}
