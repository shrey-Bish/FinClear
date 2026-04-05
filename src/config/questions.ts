/**
 * SowSmart Questions Configuration
 * 
 * This file defines all questions used in both:
 * - Text chat onboarding
 * - Voice agent conversations
 * 
 * Edit questions here to update both features automatically.
 */

export interface QuestionOption {
  label: string
  value: string
  icon?: string
  badge?: string
  description?: string
}

export interface Question {
  id: string
  content: string
  voiceContent?: string // Optional: different phrasing for voice
  options?: QuestionOption[]
  inputType?: "text" | "select" | "multi-select"
  inputPlaceholder?: string
  field: string
  skipIf?: {
    field: string
    value: string | string[]
  }
}

export const GUIDE_INTRO = {
  text: "Hey! I'm Nova. 👋\n\nI'll help you find the perfect State Farm coverage in about 2 minutes.",
  voice: "Hey! I'm Nova, your AI insurance guide. I'll help you find the perfect State Farm coverage in about 2 minutes. Let's get started!",
}

export const QUESTIONS: Question[] = [
  {
    id: "name",
    content: "First, what's your name?",
    voiceContent: "First off, what's your name?",
    inputType: "text",
    inputPlaceholder: "Your first name",
    field: "firstName",
  },
  {
    id: "age",
    content: "Nice to meet you, {firstName}! 🎉\n\nHow old are you?",
    voiceContent: "Nice to meet you, {firstName}! So, what's your age range?",
    options: [
      { label: "18-24", value: "18-24", icon: "🎓", description: "Just starting out" },
      { label: "25-34", value: "25-34", icon: "💼", description: "Building career" },
      { label: "35-44", value: "35-44", icon: "🏠", description: "Settling down" },
      { label: "45+", value: "45+", icon: "🌟", description: "Experienced" },
    ],
    field: "ageRange",
  },
  {
    id: "insurance_type",
    content: "State Farm offers tons of coverage options.\n\nWhat do you need help with today?",
    voiceContent: "State Farm has lots of coverage options. What type of insurance are you looking for?",
    options: [
      { label: "RENTERS", value: "renters", icon: "🏠", badge: "POPULAR", description: "Protect your stuff" },
      { label: "AUTO", value: "auto", icon: "🚗", description: "Coverage for your ride" },
      { label: "LIFE", value: "life", icon: "👨‍👩‍👧", description: "Protect loved ones" },
      { label: "NOT SURE", value: "unsure", icon: "🤔", description: "Help me figure it out" },
    ],
    field: "insuranceType",
  },
  {
    id: "housing",
    content: "Got it! Where do you currently live?",
    voiceContent: "Where do you currently live?",
    options: [
      { label: "Renting apartment", value: "renting_apartment", icon: "🏢" },
      { label: "Renting house", value: "renting_house", icon: "🏡" },
      { label: "Living with family", value: "with_family", icon: "👨‍👩‍👧" },
      { label: "Own my place", value: "own", icon: "🔑" },
    ],
    field: "housingStatus",
  },
  {
    id: "has_car",
    content: "Do you have a car?",
    voiceContent: "Do you own or drive a car?",
    options: [
      { label: "Yes, I drive", value: "yes", icon: "🚗" },
      { label: "No car", value: "no", icon: "🚶" },
      { label: "Planning to get one", value: "planning", icon: "📝" },
    ],
    field: "hasCar",
  },
  {
    id: "car_type",
    content: "What kind of car do you drive?",
    voiceContent: "What type of car do you have?",
    options: [
      { label: "Used/older car", value: "used", icon: "🚙", description: "Over 5 years old" },
      { label: "Newer car", value: "newer", icon: "🚘", description: "Under 5 years" },
      { label: "Financed/leased", value: "financed", icon: "💳", description: "Still paying" },
    ],
    field: "carType",
    skipIf: { field: "hasCar", value: "no" },
  },
  {
    id: "biggest_worry",
    content: "What keeps you up at night? (Insurance-wise 😄)",
    voiceContent: "What's your biggest concern when it comes to insurance?",
    options: [
      { label: "Theft/break-in", value: "theft", icon: "🔒" },
      { label: "Car accident", value: "car_accident", icon: "💥" },
      { label: "Medical bills", value: "medical", icon: "🏥" },
      { label: "No savings", value: "savings", icon: "💸" },
    ],
    field: "biggestWorry",
  },
  {
    id: "budget",
    content: "What's your monthly budget for insurance?",
    voiceContent: "How much are you looking to spend per month on insurance?",
    options: [
      { label: "Under $50", value: "under_50", description: "Keep it minimal" },
      { label: "$50-100", value: "50_100", badge: "MOST COMMON" },
      { label: "$100-200", value: "100_200", description: "Solid coverage" },
      { label: "$200+", value: "200_plus", description: "Full protection" },
    ],
    field: "budget",
  },
  {
    id: "existing",
    content: "Do you have any insurance right now?",
    voiceContent: "Do you currently have any insurance coverage?",
    options: [
      { label: "Nope, starting fresh", value: "none", icon: "✨" },
      { label: "Through my job", value: "employer", icon: "🏢" },
      { label: "Parents' plan", value: "parents", icon: "👨‍👩‍👧" },
      { label: "Have my own", value: "own", icon: "📄" },
    ],
    field: "existingCoverage",
  },
]

export const COMPLETION_MESSAGE = {
  text: "Perfect! 🎯 I've got everything I need.\n\nLet me crunch some numbers and find the best State Farm coverage for you...",
  voice: "Perfect! I've got all the info I need. Give me a moment to find the best State Farm coverage options for you.",
}

// Progress steps shown during onboarding
export const PROGRESS_STEPS = [
  { id: "mode", label: "Start" },
  { id: "basics", label: "About you" },
  { id: "coverage", label: "Coverage" },
  { id: "quote", label: "Your quote" },
]

// Helper to get question with placeholders replaced
export function getQuestionContent(question: Question, userData: Record<string, string>, useVoice = false): string {
  let content = useVoice && question.voiceContent ? question.voiceContent : question.content
  
  Object.entries(userData).forEach(([key, value]) => {
    content = content.replace(`{${key}}`, value)
  })
  
  return content
}

// Helper to filter questions based on user answers
export function getFilteredQuestions(userData: Record<string, string>): Question[] {
  return QUESTIONS.filter(q => {
    if (q.skipIf) {
      const fieldValue = userData[q.skipIf.field]
      if (Array.isArray(q.skipIf.value)) {
        return !q.skipIf.value.includes(fieldValue)
      }
      return fieldValue !== q.skipIf.value
    }
    return true
  })
}
