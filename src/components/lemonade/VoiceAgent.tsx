"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from "lucide-react"
import { QUESTIONS, MAYA_INTRO, COMPLETION_MESSAGE, getQuestionContent, getFilteredQuestions, type Question } from "@/config/questions"

interface VoiceAgentProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: Record<string, any>) => void
}

type AgentState = "idle" | "listening" | "speaking" | "processing"

export function VoiceAgent({ isOpen, onClose, onComplete }: VoiceAgentProps) {
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1) // -1 = intro
  const [userData, setUserData] = useState<Record<string, string>>({})
  const [transcript, setTranscript] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([])
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll messages into view
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const text = result[0].transcript
        setTranscript(text)
        
        if (result.isFinal) {
          handleUserResponse(text)
        }
      }

      recognitionRef.current.onend = () => {
        if (agentState === "listening") {
          setAgentState("processing")
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        if (event.error !== "no-speech") {
          setAgentState("idle")
        }
      }
    }

    return () => {
      recognitionRef.current?.abort()
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Start the conversation when connected
  useEffect(() => {
    if (isConnected && currentQuestionIndex === -1) {
      speakAndAddMessage(MAYA_INTRO.voice)
    }
  }, [isConnected])

  const speakAndAddMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: "ai", text }])
    setAgentState("speaking")
    
    if (typeof window !== "undefined" && "speechSynthesis" in window && !isMuted) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.1
      utterance.volume = 1
      
      // Try to use a female voice
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes("samantha") || 
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman")
      ) || voices.find(v => v.lang.startsWith("en"))
      
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
      
      utterance.onend = () => {
        setAgentState("listening")
        startListening()
      }
      
      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } else {
      // If muted or no TTS, just wait a bit then start listening
      setTimeout(() => {
        setAgentState("listening")
        startListening()
      }, 1500)
    }
  }, [isMuted])

  const startListening = useCallback(() => {
    if (recognitionRef.current && agentState !== "speaking") {
      setTranscript("")
      try {
        recognitionRef.current.start()
        setAgentState("listening")
      } catch (e) {
        // Already started
      }
    }
  }, [agentState])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const handleUserResponse = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: "user", text }])
    setTranscript("")
    setAgentState("processing")

    const filteredQuestions = getFilteredQuestions(userData)
    
    // Handle intro -> first question
    if (currentQuestionIndex === -1) {
      setTimeout(() => {
        setCurrentQuestionIndex(0)
        const firstQ = filteredQuestions[0]
        const content = getQuestionContent(firstQ, userData, true)
        speakAndAddMessage(content)
      }, 500)
      return
    }

    // Save user response
    const currentQuestion = filteredQuestions[currentQuestionIndex]
    if (currentQuestion) {
      // Try to match response to options
      let value = text
      if (currentQuestion.options) {
        const matchedOption = currentQuestion.options.find(opt => 
          text.toLowerCase().includes(opt.label.toLowerCase()) ||
          text.toLowerCase().includes(opt.value.toLowerCase())
        )
        if (matchedOption) {
          value = matchedOption.value
        }
      }
      
      setUserData(prev => ({ ...prev, [currentQuestion.field]: value }))
    }

    // Move to next question
    const nextIndex = currentQuestionIndex + 1
    const updatedUserData = { ...userData, [currentQuestion?.field || ""]: text }
    const updatedFilteredQuestions = getFilteredQuestions(updatedUserData)

    setTimeout(() => {
      if (nextIndex >= updatedFilteredQuestions.length) {
        // Complete
        speakAndAddMessage(COMPLETION_MESSAGE.voice)
        setTimeout(() => {
          onComplete({ ...updatedUserData, voiceMode: true })
        }, 3000)
      } else {
        setCurrentQuestionIndex(nextIndex)
        const nextQ = updatedFilteredQuestions[nextIndex]
        const content = getQuestionContent(nextQ, updatedUserData, true)
        speakAndAddMessage(content)
      }
    }, 500)
  }, [currentQuestionIndex, userData, speakAndAddMessage, onComplete])

  const handleConnect = () => {
    setIsConnected(true)
    setCurrentQuestionIndex(-1)
    setMessages([])
    setUserData({})
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAgentState("idle")
    recognitionRef.current?.stop()
    window.speechSynthesis?.cancel()
    setCurrentQuestionIndex(-1)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      window.speechSynthesis?.cancel()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <span className="text-xl">👩</span>
              </div>
              <div>
                <h3 className="font-medium text-white">Maya</h3>
                <p className="text-xs text-gray-400">
                  {isConnected ? (
                    agentState === "speaking" ? "Speaking..." : 
                    agentState === "listening" ? "Listening..." : 
                    agentState === "processing" ? "Thinking..." : 
                    "Connected"
                  ) : "Ready to connect"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {!isConnected ? (
              /* Connection Screen */
              <div className="text-center py-8">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 mx-auto mb-6 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-5xl">👩</span>
                </motion.div>
                
                <h2 className="text-xl font-medium text-white mb-2">Talk to Maya</h2>
                <p className="text-gray-400 text-sm mb-8">
                  Have a voice conversation to find your perfect coverage
                </p>

                <button
                  onClick={handleConnect}
                  className="bg-[#FF0080] hover:bg-[#E60073] text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 mx-auto transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Start Conversation
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Uses your device's microphone and speaker
                </p>
              </div>
            ) : (
              /* Active Call Screen */
              <div>
                {/* Messages */}
                <div className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-[#FF0080] text-white rounded-tr-md"
                            : "bg-gray-700 text-gray-100 rounded-tl-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Current transcript */}
                {transcript && (
                  <div className="bg-gray-700/50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-300 italic">{transcript}</p>
                  </div>
                )}

                {/* Voice Visualizer */}
                <div className="flex justify-center items-center gap-1 h-16 mb-4">
                  {agentState === "speaking" && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-[#FF0080] rounded-full"
                          animate={{
                            height: [20, 40 + Math.random() * 20, 20],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.4 + Math.random() * 0.2,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </>
                  )}
                  {agentState === "listening" && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-green-400 rounded-full"
                          animate={{
                            height: [10, 25 + Math.random() * 15, 10],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.3 + Math.random() * 0.2,
                            delay: i * 0.08,
                          }}
                        />
                      ))}
                    </>
                  )}
                  {agentState === "processing" && (
                    <motion.div
                      className="w-8 h-8 border-2 border-gray-500 border-t-[#FF0080] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  )}
                  {agentState === "idle" && (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Status */}
                <p className="text-center text-sm text-gray-400 mb-6">
                  {agentState === "speaking" && "Maya is speaking..."}
                  {agentState === "listening" && "Listening to you..."}
                  {agentState === "processing" && "Processing..."}
                  {agentState === "idle" && "Ready"}
                </p>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-colors ${
                      isMuted ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    title={isMuted ? "Unmute Maya" : "Mute Maya"}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={handleDisconnect}
                    className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    title="End conversation"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  <button
                    onClick={agentState === "listening" ? stopListening : startListening}
                    disabled={agentState === "speaking" || agentState === "processing"}
                    className={`p-4 rounded-full transition-colors ${
                      agentState === "listening" 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                    }`}
                    title={agentState === "listening" ? "Stop listening" : "Start listening"}
                  >
                    {agentState === "listening" ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 text-center">
              Powered by Web Speech API • State Farm Hackathon
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
