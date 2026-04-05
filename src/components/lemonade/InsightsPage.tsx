"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Volume2, MessageCircle, ArrowRight, Check, Info, Phone } from "lucide-react"

interface InsightsPageProps {
  userData: Record<string, any>
  onBack: () => void
  onChat: () => void
  onAgentConnect?: () => void
}

interface InsuranceRecommendation {
  type: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  recommended: boolean
}

export function InsightsPage({ userData, onBack, onChat, onAgentConnect }: InsightsPageProps) {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [showVoiceExplainer, setShowVoiceExplainer] = useState<string | null>(null)

  const firstName = userData.firstName || "there"
  
  // Generate recommendations based on user data
  const recommendations: InsuranceRecommendation[] = [
    {
      type: "renters",
      icon: "🏠",
      title: "Renters Insurance",
      description: "Protect your stuff from theft, fire, and accidents",
      price: "$12/mo",
      features: [
        "Up to $30k coverage for belongings",
        "Liability protection",
        "Temporary housing if needed"
      ],
      recommended: userData.housingStatus?.includes("rent") || userData.insuranceType === "renters",
    },
    {
      type: "auto",
      icon: "🚗",
      title: "Auto Insurance", 
      description: "Coverage for your car and peace of mind on the road",
      price: "$89/mo",
      features: [
        "Collision & comprehensive",
        "Liability coverage",
        "Roadside assistance"
      ],
      recommended: userData.biggestWorry === "car_accident" || userData.insuranceType === "auto",
    },
    {
      type: "health",
      icon: "🏥",
      title: "Health Coverage",
      description: "Don't let medical bills catch you off guard",
      price: "$156/mo",
      features: [
        "Doctor visits covered",
        "Prescription discounts",
        "Emergency care"
      ],
      recommended: userData.biggestWorry === "medical" || userData.insuranceType === "health",
    },
  ]

  const emergencyMonths = userData.incomeRange === "under_30k" ? 1.2 
    : userData.incomeRange === "30k_50k" ? 2.1
    : userData.incomeRange === "50k_75k" ? 3.4
    : 4.8

  const togglePlan = (type: string) => {
    setSelectedPlans(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleVoiceExplain = (term: string) => {
    setShowVoiceExplainer(term)
    // In a real app, this would trigger ElevenLabs TTS
    setTimeout(() => setShowVoiceExplainer(null), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="font-script text-xl text-gray-800">SowSmart</h1>
          
          <button 
            onClick={onChat}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF0080] rounded-full" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Greeting */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-medium text-gray-800 mb-2">
            Here's what we found, {firstName}! 🎉
          </h2>
          <p className="text-gray-500">
            Based on your answers, here's the coverage that makes sense for you.
          </p>
        </motion.div>

        {/* Emergency Score */}
        <motion.div 
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Your Emergency Runway</h3>
              <p className="text-4xl font-semibold text-gray-800">
                {emergencyMonths.toFixed(1)} months
              </p>
              <p className="text-sm text-gray-500 mt-1">
                How long you could sustain without income
              </p>
            </div>
            <button 
              onClick={() => handleVoiceExplain("emergency runway")}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <Volume2 className={`w-5 h-5 ${showVoiceExplainer === "emergency runway" ? 'text-[#FF0080]' : 'text-gray-400'}`} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#FF0080] to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(emergencyMonths / 6 * 100, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>0 mo</span>
              <span className="text-[#FF0080] font-medium">Goal: 6 months</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Save an extra $200/month to reach 6 months runway in {Math.ceil((6 - emergencyMonths) / 0.5)} months
            </p>
          </div>
        </motion.div>

        {/* Voice explainer overlay */}
        {showVoiceExplainer && (
          <motion.div 
            className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-2xl shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF0080] rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">🎙️ Explaining: {showVoiceExplainer}</p>
                <p className="text-xs text-gray-400">This is how long your savings would last if you lost your income...</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-medium text-gray-800 mb-4">Recommended Coverage</h3>
          
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.type}
                className={`border rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedPlans.includes(rec.type) 
                    ? 'border-[#FF0080] bg-pink-50/50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => togglePlan(rec.type)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{rec.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">{rec.title}</h4>
                        {rec.recommended && (
                          <span className="bg-[#FF0080] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                      
                      <ul className="mt-3 space-y-1">
                        {rec.features.map((feature, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-800">{rec.price}</p>
                    <div className={`w-6 h-6 border-2 rounded-md mt-2 flex items-center justify-center transition-colors ${
                      selectedPlans.includes(rec.type)
                        ? 'bg-[#FF0080] border-[#FF0080]'
                        : 'border-gray-300'
                    }`}>
                      {selectedPlans.includes(rec.type) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bundle savings */}
        {selectedPlans.length > 1 && (
          <motion.div 
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-sm text-green-800">
              🎉 <strong>Bundle & Save!</strong> You're saving $18/month by bundling {selectedPlans.length} policies
            </p>
          </motion.div>
        )}

        {/* Peer comparison */}
        <motion.div 
          className="mt-8 p-5 bg-gray-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="font-medium text-gray-800 mb-3">People like you choose:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Renters Insurance</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-[#FF0080] rounded-full" />
                </div>
                <span className="text-sm font-medium text-gray-800">78%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto Insurance</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-[#FF0080] rounded-full" />
                </div>
                <span className="text-sm font-medium text-gray-800">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Health Coverage</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-[#FF0080] rounded-full" />
                </div>
                <span className="text-sm font-medium text-gray-800">45%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Based on 1,200+ users in your age group and living situation
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="mt-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 ${
              selectedPlans.length > 0
                ? 'bg-[#FF0080] text-white hover:bg-[#E60073]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={selectedPlans.length === 0}
          >
            Get My Quote <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onAgentConnect}
            className="w-full py-4 rounded-xl font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Talk to a State Farm Agent
          </button>
          
          <p className="text-center text-xs text-gray-400">
            An agent will text you within 10 minutes
          </p>
        </motion.div>

        {/* Questions */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button 
            onClick={onChat}
            className="inline-flex items-center gap-2 text-[#FF0080] font-medium hover:underline"
          >
            <MessageCircle className="w-5 h-5" />
            Have questions? Chat with Maya
          </button>
        </motion.div>
      </main>
    </div>
  )
}
