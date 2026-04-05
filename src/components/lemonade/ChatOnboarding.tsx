"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, RotateCcw, HelpCircle, Volume2, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  options?: ChatOption[]
  inputType?: "text" | "select" | "multi-select" | "address"
  inputPlaceholder?: string
  field?: string
}

interface ChatOption {
  label: string
  value: string
  icon?: string
  badge?: string
}

interface ChatOnboardingProps {
  onComplete: (data: Record<string, any>) => void
  onBack: () => void
}

// Progress steps
const STEPS = [
  { id: "basics", label: "About you" },
  { id: "coverage", label: "Coverage" },
  { id: "quote", label: "Your quote" },
]

export function ChatOnboarding({ onComplete, onBack }: ChatOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState<Record<string, any>>({})
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Question flow
  const questions: Message[] = [
    {
      id: "welcome",
      type: "ai",
      content: "Hey! I'm Maya. 👋\n\nI'll help you find the perfect coverage in about 2 minutes. Ready?",
      options: [
        { label: "Let's do this!", value: "start" },
        { label: "Tell me more first", value: "more_info" },
      ],
      field: "ready",
    },
    {
      id: "name",
      type: "ai",
      content: "Awesome! First, what's your name?",
      inputType: "text",
      inputPlaceholder: "Your first name",
      field: "firstName",
    },
    {
      id: "insurance_type",
      type: "ai",
      content: "Nice to meet you, {firstName}! 🎉\n\nWhich insurance are you looking for?",
      options: [
        { label: "RENTERS", value: "renters", icon: "🏠" },
        { label: "AUTO", value: "auto", icon: "🚗" },
        { label: "LIFE", value: "life", icon: "👨‍👩‍👧" },
        { label: "HEALTH", value: "health", icon: "🏥" },
      ],
      field: "insuranceType",
    },
    {
      id: "age",
      type: "ai",
      content: "Got it! And how old are you?",
      options: [
        { label: "18-24", value: "18-24" },
        { label: "25-34", value: "25-34" },
        { label: "35-44", value: "35-44" },
        { label: "45+", value: "45+" },
      ],
      field: "ageRange",
    },
    {
      id: "housing",
      type: "ai",
      content: "What's your living situation?",
      options: [
        { label: "Renting an apartment", value: "renting_apartment", icon: "🏢" },
        { label: "Renting a house", value: "renting_house", icon: "🏡" },
        { label: "Living with family", value: "with_family", icon: "👨‍👩‍👧" },
        { label: "Own my place", value: "own", icon: "🏠" },
      ],
      field: "housingStatus",
    },
    {
      id: "income",
      type: "ai",
      content: "What's your approximate annual income? (This helps us find the right coverage level)",
      options: [
        { label: "Under $30k", value: "under_30k" },
        { label: "$30k - $50k", value: "30k_50k" },
        { label: "$50k - $75k", value: "50k_75k" },
        { label: "$75k+", value: "75k_plus" },
      ],
      field: "incomeRange",
    },
    {
      id: "worry",
      type: "ai",
      content: "What worries you most? (Pick the biggest one)",
      options: [
        { label: "Someone stealing my stuff", value: "theft", icon: "🔒" },
        { label: "Unexpected medical bills", value: "medical", icon: "🏥" },
        { label: "Car accident costs", value: "car_accident", icon: "🚗" },
        { label: "Not having savings", value: "savings", icon: "💰" },
      ],
      field: "biggestWorry",
    },
    {
      id: "existing_coverage",
      type: "ai",
      content: "Do you have any insurance right now?",
      options: [
        { label: "Nope, starting fresh", value: "none" },
        { label: "Yes, through my job", value: "employer" },
        { label: "Yes, through parents", value: "parents" },
        { label: "Yes, I bought my own", value: "own" },
      ],
      field: "existingCoverage",
    },
    {
      id: "complete",
      type: "ai",
      content: "Perfect! 🎯 I've got everything I need.\n\nLet me crunch some numbers and find the best coverage for you...",
      field: "complete",
    },
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start with first question
  useEffect(() => {
    const timer = setTimeout(() => {
      addAiMessage(questions[0])
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const addAiMessage = (question: Message) => {
    setIsTyping(true)
    
    // Replace placeholders in content
    let content = question.content
    Object.entries(userData).forEach(([key, value]) => {
      content = content.replace(`{${key}}`, value as string)
    })
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { ...question, content }])
    }, 800)
  }

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleOptionSelect = (option: ChatOption, field?: string) => {
    // Add user's response
    addUserMessage(option.label)
    
    // Store data
    if (field) {
      setUserData(prev => ({ ...prev, [field]: option.value }))
    }
    
    // Move to next question
    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)
    
    // Update step progress
    if (nextIndex >= 3 && nextIndex < 6) {
      setCurrentStep(1)
    } else if (nextIndex >= 6) {
      setCurrentStep(2)
    }
    
    if (nextIndex < questions.length) {
      setTimeout(() => {
        if (questions[nextIndex].field === "complete") {
          addAiMessage(questions[nextIndex])
          setTimeout(() => {
            onComplete(userData)
          }, 2000)
        } else {
          addAiMessage(questions[nextIndex])
        }
      }, 300)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const currentQuestion = questions[questionIndex]
    
    // Add user's response
    addUserMessage(inputValue)
    
    // Store data
    if (currentQuestion.field) {
      setUserData(prev => ({ ...prev, [currentQuestion.field!]: inputValue }))
    }
    
    setInputValue("")
    
    // Move to next question
    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)
    
    if (nextIndex < questions.length) {
      setTimeout(() => {
        addAiMessage(questions[nextIndex])
      }, 300)
    }
  }

  const currentQuestion = messages[messages.length - 1]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Maya Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden">
          <span className="text-2xl">👩</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <RotateCcw className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentStep ? 'text-[#FF0080]' : 'text-gray-300'}`}>
                <div className={`w-3 h-3 rounded-full ${i <= currentStep ? 'bg-[#FF0080]' : 'bg-gray-200'}`} />
                <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < currentStep ? 'bg-[#FF0080]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-lg mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                      <span className="text-sm">👩</span>
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gray-100 text-gray-800 rounded-tr-md'
                        : 'text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  {/* Options for AI messages */}
                  {message.type === 'ai' && message.options && index === messages.length - 1 && !isTyping && (
                    <motion.div 
                      className="mt-3 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {message.options.length <= 2 ? (
                        // Simple yes/no style options
                        <div className="flex flex-col gap-2">
                          {message.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleOptionSelect(option, message.field)}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-800 font-medium transition-colors"
                            >
                              {option.icon && <span>{option.icon}</span>}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        // Card style options for multiple choices
                        <div className="grid grid-cols-2 gap-2">
                          {message.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleOptionSelect(option, message.field)}
                              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 hover:border-[#FF0080] rounded-xl transition-colors group relative"
                            >
                              {option.badge && (
                                <span className="absolute -top-2 -right-2 bg-[#FF0080] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                  {option.badge}
                                </span>
                              )}
                              {option.icon && <span className="text-2xl">{option.icon}</span>}
                              <span className="text-sm font-medium text-gray-800 text-center">{option.label}</span>
                              <div className="w-5 h-5 border-2 border-gray-300 rounded group-hover:border-[#FF0080] transition-colors" />
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Text input */}
                  {message.type === 'ai' && message.inputType === 'text' && index === messages.length - 1 && !isTyping && (
                    <motion.form 
                      onSubmit={handleTextSubmit}
                      className="mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={message.inputPlaceholder}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF0080] transition-colors"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="px-6 py-3 bg-[#FF0080] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E60073] transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <span className="text-sm">👩</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice mode hint */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Confused? Tap any term to hear it explained</span>
        </div>
      </div>
    </div>
  )
}
