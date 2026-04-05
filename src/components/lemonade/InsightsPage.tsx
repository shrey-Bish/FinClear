"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Volume2, MessageCircle, ArrowRight, Check, Phone, Shield, Car, Home, Heart, HelpCircle } from "lucide-react"
import { prepareVoiceText, speakSowSmartText, stopSowSmartVoice } from "../../lib/voice"

interface InsightsPageProps {
  userData: Record<string, any>
  onBack: () => void
  onChat: () => void
  onAgentConnect?: () => void
}

interface InsuranceRecommendation {
  type: string
  icon: React.ReactNode
  title: string
  description: string
  price: string
  originalPrice?: string
  features: string[]
  recommended: boolean
  priority: "high" | "medium" | "low"
}

export function InsightsPage({ userData, onBack, onChat, onAgentConnect }: InsightsPageProps) {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [showVoiceExplainer, setShowVoiceExplainer] = useState<string | null>(null)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  const firstName = userData.firstName || "there"
  const isRenter = userData.housingStatus?.includes("rent")
  const hasCar = userData.hasCar === "yes" || userData.hasCar === "planning"
  const ageRange = userData.ageRange || "25-34"
  const biggestWorry = userData.biggestWorry
  
  // Generate personalized State Farm recommendations
  const recommendations: InsuranceRecommendation[] = []
  
  // Renters Insurance (if renting)
  if (isRenter || userData.insuranceType === "renters") {
    recommendations.push({
      type: "renters",
      icon: <Home className="w-6 h-6" />,
      title: "Renters Insurance",
      description: "State Farm renters coverage protects your stuff from theft, fire, and liability",
      price: "$15",
      features: [
        "Personal property coverage up to $30k",
        "Liability protection ($100k+)",
        "Temporary housing if you can't live there",
        "Covers theft even away from home"
      ],
      recommended: true,
      priority: "high"
    })
  }
  
  // Auto Insurance (if has car)
  if (hasCar || userData.insuranceType === "auto") {
    const isYoungDriver = ageRange === "18-24"
    const basePrice = isYoungDriver ? 135 : 89
    
    recommendations.push({
      type: "auto",
      icon: <Car className="w-6 h-6" />,
      title: "Auto Insurance",
      description: "State Farm auto coverage with Drive Safe & Save™ discounts",
      price: `$${basePrice}`,
      originalPrice: isYoungDriver ? "$175" : undefined,
      features: [
        "Liability coverage (required by law)",
        "Collision & comprehensive",
        "Roadside assistance 24/7",
        "Drive Safe & Save™ for lower rates"
      ],
      recommended: biggestWorry === "car_accident",
      priority: hasCar ? "high" : "medium"
    })
  }
  
  // Life Insurance (if older or has family worries)
  if (userData.insuranceType === "life" || ageRange === "35-44" || ageRange === "45+") {
    recommendations.push({
      type: "life",
      icon: <Heart className="w-6 h-6" />,
      title: "Term Life Insurance",
      description: "Affordable protection for your loved ones with State Farm",
      price: "$18",
      features: [
        "Coverage from $100k to $1M+",
        "Lock in low rates while young",
        "No medical exam options available",
        "Peace of mind for your family"
      ],
      recommended: userData.insuranceType === "life",
      priority: "medium"
    })
  }
  
  // Default: add at least renters + auto if nothing specific
  if (recommendations.length === 0) {
    recommendations.push({
      type: "renters",
      icon: <Home className="w-6 h-6" />,
      title: "Renters Insurance",
      description: "Most popular for your age group",
      price: "$15",
      features: ["Personal property coverage", "Liability protection", "Temporary housing coverage"],
      recommended: true,
      priority: "high"
    })
    recommendations.push({
      type: "auto",
      icon: <Car className="w-6 h-6" />,
      title: "Auto Insurance",
      description: "Essential if you drive",
      price: "$89",
      features: ["Liability coverage", "Collision & comprehensive", "Roadside assistance"],
      recommended: false,
      priority: "medium"
    })
  }

  // Calculate emergency runway
  const incomeMultiplier: Record<string, number> = {
    "under_30k": 0.8,
    "30k_50k": 1.5,
    "50k_75k": 2.8,
    "75k_plus": 4.2
  }
  const emergencyMonths = incomeMultiplier[userData.incomeRange] || 1.5

  const togglePlan = (type: string) => {
    setSelectedPlans(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const termExplanations: Record<string, string> = {
    "emergency runway": "This is how long your savings could last if you suddenly lost your income. Financial experts recommend having 3-6 months saved up."
  }

  const handleVoiceExplain = async (term: string) => {
    const explanation = termExplanations[term] || "Playing explanation..."
    setShowVoiceExplainer(term)

    try {
      const playback = await speakSowSmartText(prepareVoiceText(explanation))
      await playback.finished
    } finally {
      setTimeout(() => setShowVoiceExplainer(null), 350)
    }
  }

  useEffect(() => {
    return () => {
      stopSowSmartVoice()
    }
  }, [])

  const calculateTotal = () => {
    const prices: Record<string, number> = { renters: 15, auto: 89, life: 18 }
    let total = selectedPlans.reduce((sum, plan) => sum + (prices[plan] || 0), 0)
    if (selectedPlans.length >= 2) total = Math.round(total * 0.85)
    return total
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-script text-xl text-gray-800">SowSmart</h1>
          <button onClick={onChat} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF0080] rounded-full" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-medium text-gray-800 mb-2">Here&apos;s your plan, {firstName}! 🎉</h2>
          <p className="text-gray-500">Based on your answers, here&apos;s what State Farm recommends.</p>
        </motion.div>

        {/* Emergency Score */}
        <motion.div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-600">Your Emergency Runway</h3>
                <button onClick={() => setExpandedTerm(expandedTerm === "emergency runway" ? null : "emergency runway")} className="p-1 hover:bg-white/50 rounded-full">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-4xl font-semibold text-gray-800 mt-1">{emergencyMonths.toFixed(1)} months</p>
              <p className="text-sm text-gray-500 mt-1">How long you could sustain without income</p>
            </div>
            <button onClick={() => handleVoiceExplain("emergency runway")} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <Volume2 className={`w-5 h-5 ${showVoiceExplainer === "emergency runway" ? 'text-[#FF0080]' : 'text-gray-400'}`} />
            </button>
          </div>
          {expandedTerm === "emergency runway" && (
            <motion.div className="mt-4 p-3 bg-white/60 rounded-lg text-sm text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {termExplanations["emergency runway"]}
            </motion.div>
          )}
          <div className="mt-4">
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${emergencyMonths >= 6 ? 'bg-green-500' : emergencyMonths >= 3 ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#FF0080] to-purple-500'}`} initial={{ width: 0 }} animate={{ width: `${Math.min(emergencyMonths / 6 * 100, 100)}%` }} transition={{ delay: 0.5, duration: 0.8 }} />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>0 mo</span>
              <span className={emergencyMonths >= 6 ? 'text-green-600 font-medium' : 'text-[#FF0080] font-medium'}>Goal: 6 months</span>
            </div>
          </div>
        </motion.div>

        {/* Voice explainer overlay */}
        {showVoiceExplainer && (
          <motion.div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-2xl shadow-lg z-50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF0080] rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">🎙️ Explaining: {showVoiceExplainer}</p>
                <p className="text-xs text-gray-400">{termExplanations[showVoiceExplainer] || "Playing explanation..."}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-800">Recommended Coverage</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>State Farm</span>
            </div>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <motion.div key={rec.type} className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${selectedPlans.includes(rec.type) ? 'border-[#FF0080] bg-pink-50/50' : 'border-gray-200 hover:border-gray-300'}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} onClick={() => togglePlan(rec.type)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPlans.includes(rec.type) ? 'bg-[#FF0080] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {rec.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-gray-800">{rec.title}</h4>
                        {rec.recommended && <span className="bg-[#FF0080] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {rec.features.map((feature, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-semibold text-gray-800">{rec.price}</p>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>
                    {rec.originalPrice && <p className="text-sm text-gray-400 line-through">{rec.originalPrice}/mo</p>}
                    <div className={`w-6 h-6 border-2 rounded-lg mt-2 flex items-center justify-center transition-colors ${selectedPlans.includes(rec.type) ? 'bg-[#FF0080] border-[#FF0080]' : 'border-gray-300'}`}>
                      {selectedPlans.includes(rec.type) && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bundle savings */}
        {selectedPlans.length > 1 && (
          <motion.div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="text-sm text-green-800">🎉 <strong>State Farm Bundle Discount!</strong> You&apos;re saving 15% by bundling {selectedPlans.length} policies</p>
          </motion.div>
        )}

        {/* Total */}
        {selectedPlans.length > 0 && (
          <motion.div className="mt-6 p-4 bg-gray-50 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estimated monthly total</p>
                <p className="text-3xl font-semibold text-gray-800">${calculateTotal()}/mo</p>
              </div>
              {selectedPlans.length >= 2 && <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">15% off</span>}
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div className="mt-8 space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <button className={`w-full py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 ${selectedPlans.length > 0 ? 'bg-[#FF0080] text-white hover:bg-[#E60073] shadow-lg shadow-pink-500/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} disabled={selectedPlans.length === 0}>
            Get My State Farm Quote <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={onAgentConnect} className="w-full py-4 rounded-xl font-medium text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Talk to a State Farm Agent
          </button>
          <p className="text-center text-xs text-gray-400">A local State Farm agent will text you within 10 minutes</p>
        </motion.div>

        {/* Questions */}
        <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <button onClick={onChat} className="inline-flex items-center gap-2 text-[#FF0080] font-medium hover:underline">
            <MessageCircle className="w-5 h-5" />
            Have questions? Chat with Nova
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div className="mt-12 text-center text-xs text-gray-400 space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <p>Prices are estimates. Final quotes provided by State Farm agents.</p>
          <p>© 2025 SowSmart — Built for State Farm Hackathon</p>
        </motion.div>
      </main>
    </div>
  )
}
