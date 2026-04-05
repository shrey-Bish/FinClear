"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, HelpCircle, Volume2, VolumeX, Mic, MessageSquare } from "lucide-react"
import { 
  QUESTIONS, 
  MAYA_INTRO, 
  COMPLETION_MESSAGE, 
  PROGRESS_STEPS,
  getQuestionContent, 
  getFilteredQuestions as getFilteredQuestionsFromConfig,
  type Question 
} from "@/config/questions"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  options?: Array<{
    label: string
    value: string
    icon?: string
    badge?: string
    description?: string
  }>
  inputType?: "text" | "select" | "multi-select"
  inputPlaceholder?: string
  field?: string
}

interface ChatOnboardingProps {
  onComplete: (data: Record<string, any>) => void
  onBack: () => void
}

export function ChatOnboarding({ onComplete, onBack }: ChatOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState<Record<string, any>>({})
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [voiceMode, setVoiceMode] = useState(false)
  const [modeSelected, setModeSelected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Convert config questions to chat messages
  const questionToMessage = (q: Question, data: Record<string, string>): Message => {
    const content = questionIndex === 0 
      ? `${MAYA_INTRO.text}\n\n${getQuestionContent(q, data, voiceMode)}`
      : getQuestionContent(q, data, voiceMode)
    
    return {
      id: q.id,
      type: "ai",
      content,
      options: q.options,
      inputType: q.inputType,
      inputPlaceholder: q.inputPlaceholder,
      field: q.field,
    }
  }

  // Filter questions based on user answers
  const getFilteredQuestions = () => {
    return getFilteredQuestionsFromConfig(userData)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start with mode selection
  useEffect(() => {
    if (!modeSelected) return
    const timer = setTimeout(() => {
      const filteredQs = getFilteredQuestions()
      if (filteredQs.length > 0) {
        addAiMessage(questionToMessage(filteredQs[0], userData))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [modeSelected])

  const addAiMessage = (message: Message) => {
    setIsTyping(true)
    
    const delay = voiceMode ? 1200 : 800 // Longer delay for voice mode feel
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, message])
      
      // In voice mode, use Web Speech API to read the message
      if (voiceMode && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(message.content.replace(/[👋🎉🎯😄]/g, ''))
        utterance.rate = 1.0
        utterance.pitch = 1.1
        window.speechSynthesis.speak(utterance)
      }
    }, delay)
  }

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleOptionSelect = (option: { label: string; value: string }, field?: string) => {
    addUserMessage(option.label)
    
    const newUserData = field 
      ? { ...userData, [field]: option.value }
      : userData
    
    if (field) {
      setUserData(newUserData)
    }
    
    const filteredQuestions = getFilteredQuestionsFromConfig(newUserData)
    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)
    
    // Update step progress
    if (nextIndex >= 2 && nextIndex < 5) {
      setCurrentStep(2)
    } else if (nextIndex >= 5) {
      setCurrentStep(3)
    }
    
    if (nextIndex < filteredQuestions.length) {
      setTimeout(() => {
        const nextQuestion = filteredQuestions[nextIndex]
        // Check if this is the last question
        if (nextIndex === filteredQuestions.length - 1) {
          // Show completion message after the last question
          addAiMessage(questionToMessage(nextQuestion, newUserData))
          setTimeout(() => {
            const completeMessage: Message = {
              id: "complete",
              type: "ai",
              content: COMPLETION_MESSAGE.text,
              field: "complete",
            }
            addAiMessage(completeMessage)
            setTimeout(() => {
              onComplete({ ...newUserData, voiceMode })
            }, 2000)
          }, 1500)
        } else {
          addAiMessage(questionToMessage(nextQuestion, newUserData))
        }
      }, 300)
    } else {
      // Complete - no more questions
      const completeMessage: Message = {
        id: "complete",
        type: "ai",
        content: COMPLETION_MESSAGE.text,
        field: "complete",
      }
      addAiMessage(completeMessage)
      setTimeout(() => {
        onComplete({ ...newUserData, voiceMode })
      }, 2000)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const filteredQs = getFilteredQuestions()
    const currentQuestion = filteredQs[questionIndex]
    
    addUserMessage(inputValue)
    
    const newUserData = currentQuestion?.field 
      ? { ...userData, [currentQuestion.field]: inputValue }
      : userData
    
    if (currentQuestion?.field) {
      setUserData(newUserData)
    }
    
    setInputValue("")
    setCurrentStep(1)
    
    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)
    
    const updatedFilteredQs = getFilteredQuestionsFromConfig(newUserData)
    
    if (nextIndex < updatedFilteredQs.length) {
      setTimeout(() => {
        addAiMessage(questionToMessage(updatedFilteredQs[nextIndex], newUserData))
      }, 300)
    } else {
      // Complete
      const completeMessage: Message = {
        id: "complete",
        type: "ai",
        content: COMPLETION_MESSAGE.text,
        field: "complete",
      }
      addAiMessage(completeMessage)
      setTimeout(() => {
        onComplete({ ...newUserData, voiceMode })
      }, 2000)
    }
  }

  const handleModeSelect = (mode: "text" | "voice") => {
    setVoiceMode(mode === "voice")
    setModeSelected(true)
    setCurrentStep(1)
  }

  // Mode selection screen
  if (!modeSelected) {
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
          
          <div className="font-script text-xl text-gray-800">SowSmart</div>
          
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <span className="text-4xl">👩</span>
          </motion.div>

          <motion.h1 
            className="text-2xl md:text-3xl font-medium text-gray-800 text-center mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hey there! I'm Maya 👋
          </motion.h1>
          
          <motion.p 
            className="text-gray-500 text-center mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your AI insurance guide. Ready to find your perfect State Farm coverage in 2 minutes?
          </motion.p>

          <motion.div 
            className="w-full max-w-sm space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-gray-500 text-center mb-4">How would you like to chat?</p>
            
            <button
              onClick={() => handleModeSelect("text")}
              className="w-full flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-[#FF0080] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                <MessageSquare className="w-6 h-6 text-gray-600 group-hover:text-[#FF0080]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Text Chat</p>
                <p className="text-sm text-gray-500">Type your answers</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-[#FF0080] text-white text-xs font-medium rounded-full">
                FASTER
              </div>
            </button>

            <button
              onClick={() => handleModeSelect("voice")}
              className="w-full flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-[#FF0080] transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                <Volume2 className="w-6 h-6 text-gray-600 group-hover:text-[#FF0080]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Voice Mode</p>
                <p className="text-sm text-gray-500">Maya reads questions aloud</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                ACCESSIBLE
              </div>
            </button>
          </motion.div>

          <motion.p 
            className="text-xs text-gray-400 mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Don't worry — you can switch modes anytime
          </motion.p>
        </main>
      </div>
    )
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
          <button 
            onClick={() => setVoiceMode(!voiceMode)}
            className={`p-2 rounded-full transition-colors ${voiceMode ? 'bg-pink-100 text-[#FF0080]' : 'hover:bg-gray-100 text-gray-400'}`}
            title={voiceMode ? "Voice mode on" : "Voice mode off"}
          >
            {voiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          {PROGRESS_STEPS.slice(1).map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${i + 1 <= currentStep ? 'text-[#FF0080]' : 'text-gray-300'}`}>
                <div className={`w-3 h-3 rounded-full ${i + 1 <= currentStep ? 'bg-[#FF0080]' : 'bg-gray-200'}`} />
                <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
              </div>
              {i < PROGRESS_STEPS.length - 2 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i + 1 < currentStep ? 'bg-[#FF0080]' : 'bg-gray-200'}`} />
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
                        ? 'bg-[#FF0080] text-white rounded-tr-md'
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
                      {message.options.length <= 3 ? (
                        <div className="flex flex-col gap-2">
                          {message.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleOptionSelect(option, message.field)}
                              className="flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-gray-200 hover:border-[#FF0080] rounded-xl text-gray-800 font-medium transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                {option.icon && <span className="text-xl">{option.icon}</span>}
                                <div className="text-left">
                                  <span className="block">{option.label}</span>
                                  {option.description && (
                                    <span className="text-xs text-gray-400">{option.description}</span>
                                  )}
                                </div>
                              </div>
                              {option.badge && (
                                <span className="bg-[#FF0080] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                  {option.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
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
                              {option.description && (
                                <span className="text-xs text-gray-400 text-center">{option.description}</span>
                              )}
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
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice mode hint */}
      {voiceMode && (
        <div className="px-4 py-3 border-t border-gray-100 bg-pink-50">
          <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-[#FF0080] text-sm">
            <Volume2 className="w-4 h-4" />
            <span>Voice mode active — Maya will read questions aloud</span>
          </div>
        </div>
      )}
    </div>
  )
}
