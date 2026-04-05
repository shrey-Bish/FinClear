"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Menu, Mic, MessageSquare } from "lucide-react"
import { VoiceAgent } from "./VoiceAgent"

interface LandingPageProps {
  onStart: () => void
  onStartVoice?: () => void
  onLogin?: () => void
  onVoiceComplete?: (data: Record<string, any>) => void
}

export function LandingPage({ onStart, onStartVoice, onLogin, onVoiceComplete }: LandingPageProps) {
  const [showVoiceAgent, setShowVoiceAgent] = useState(false)

  const handleVoiceComplete = (data: Record<string, any>) => {
    setShowVoiceAgent(false)
    onVoiceComplete?.(data)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Voice Agent Modal */}
      <VoiceAgent 
        isOpen={showVoiceAgent} 
        onClose={() => setShowVoiceAgent(false)}
        onComplete={handleVoiceComplete}
      />
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">Renters</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Auto</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Life</a>
          <a href="#" className="hover:text-gray-900 transition-colors">How it Works</a>
        </nav>
        
        <motion.div 
          className="font-script text-2xl text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          SowSmart
        </motion.div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden md:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            My Account
          </button>
          <button
            onClick={onStart}
            className="bg-[#FF0080] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#E60073] transition-colors"
          >
            CHECK OUR PRICES
          </button>
          <button className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background illustration - simplified city/houses */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-[0.07]" viewBox="0 0 1200 600" fill="none">
            {/* Left house */}
            <rect x="50" y="350" width="120" height="150" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="50,350 110,280 170,350" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="90" y="420" width="40" height="80" stroke="currentColor" strokeWidth="2" fill="none" />
            
            {/* Car */}
            <ellipse cx="280" cy="480" rx="50" ry="20" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="250" y="440" width="60" height="40" rx="10" stroke="currentColor" strokeWidth="2" fill="none" />
            
            {/* Right house */}
            <rect x="1000" y="320" width="150" height="180" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="1000,320 1075,240 1150,320" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="1040" y="400" width="50" height="100" stroke="currentColor" strokeWidth="2" fill="none" />
            
            {/* Person on bench */}
            <rect x="1050" y="450" width="80" height="30" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="1090" cy="420" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-medium text-gray-800 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Forget everything you
            <br />
            know about insurance
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Instant everything. Incredible prices. Big heart.
          </motion.p>
          
          {/* Two CTA buttons - Chat and Voice */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={onStart}
              className="bg-[#FF0080] text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-[#E60073] transition-all shadow-lg shadow-pink-500/25 flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-5 h-5" />
              Text Chat
            </motion.button>
            
            <motion.button
              onClick={() => setShowVoiceAgent(true)}
              className="bg-gray-900 text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-gray-800 transition-all shadow-lg flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mic className="w-5 h-5" />
              Talk to Maya
            </motion.button>
          </motion.div>
          
          <motion.p
            className="mt-4 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Choose your style — same great coverage either way
          </motion.p>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-medium text-center text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Instant everything
          </motion.h2>
          <motion.p 
            className="text-center text-gray-500 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            We use AI to craft the perfect policy for you, and to pay out claims.
            <br />
            It couldn't be easier or faster.
          </motion.p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl text-gray-600">As little as</p>
              <p className="text-5xl font-semibold text-gray-800">90 seconds</p>
              <p className="text-lg text-gray-500 mt-2">to get covered</p>
            </motion.div>
            
            <motion.div 
              className="text-center md:text-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-2xl text-gray-600">Claims paid in</p>
              <p className="text-5xl font-semibold text-gray-800">3 seconds</p>
              <p className="text-lg text-gray-500 mt-2">not 3 weeks</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-medium text-center text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Incredible Prices. Monthly Subscription.
            <br />
            Bundle Discounts.
          </motion.h2>
          <motion.p 
            className="text-center text-gray-500 mb-12 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-pink-500">💎</span> Amazing savings when you bundle
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Renters", price: "$5/mo", icon: "🏠", desc: "Coverage for your stuff" },
              { name: "Auto", price: "$30/mo", icon: "🚗", desc: "Protect your ride" },
              { name: "Life", price: "$8/mo", icon: "👨‍👩‍👧", desc: "For loved ones" },
              { name: "Health", price: "$15/mo", icon: "🏥", desc: "Stay covered" },
            ].map((product, i) => (
              <motion.div
                key={product.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-pink-300 hover:shadow-lg transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={onStart}
              >
                <div className="text-4xl mb-3">{product.icon}</div>
                <h3 className="font-medium text-gray-800 text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{product.desc}</p>
                <button className="w-full bg-[#FF0080] text-white text-sm font-medium py-2.5 rounded-lg group-hover:bg-[#E60073] transition-colors">
                  CHECK OUR PRICES
                </button>
                <p className="text-xs text-gray-400 mt-2">FROM {product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-medium text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The (Almost) 5 Star Insurance
          </motion.h2>
          <motion.p 
            className="text-gray-500 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            SowSmart has earned 4.9 stars in the App store
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-1 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-12 h-12 text-[#FF0080]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Alex K.", text: "Finally, insurance that doesn't make me want to cry. Signed up in literally 2 minutes.", handle: "@alexk_22" },
              { name: "Maya S.", text: "I put off getting renters insurance for years. SowSmart made it so easy I'm mad I waited.", handle: "@mayaslife" },
              { name: "Jordan R.", text: "The chat-based signup was actually fun? Never thought I'd say that about insurance.", handle: "@jordanr" },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                className="bg-white rounded-2xl p-6 text-left shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.name}</p>
                    <p className="text-sm text-[#FF0080]">{review.handle}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-medium text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            className="text-gray-500 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            2 minutes. That's all it takes to find out what coverage you need.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={onStart}
              className="bg-[#FF0080] text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-[#E60073] transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-5 h-5" />
              Start Text Chat
            </motion.button>
            <span className="text-gray-400">or</span>
            <motion.button
              onClick={() => setShowVoiceAgent(true)}
              className="bg-gray-900 text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mic className="w-5 h-5" />
              Talk to Maya
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Floating Voice Button */}
      <motion.button
        onClick={() => setShowVoiceAgent(true)}
        className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-xl flex items-center gap-2 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Mic className="w-6 h-6" />
        <span className="hidden sm:inline pr-1">Talk to Maya</span>
      </motion.button>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-script text-xl text-gray-600 mb-2">SowSmart</p>
          <p className="text-sm text-gray-400">
            Built for State Farm Hackathon · Insurance made simple for Gen Z
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Disclaimer: This is a demo app. Not actual insurance.
          </p>
        </div>
      </footer>
    </div>
  )
}
