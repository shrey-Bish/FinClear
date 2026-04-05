"use client"

import { motion } from "framer-motion"
import { ArrowRight, Menu, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

interface LandingPageProps {
  onStart: () => void
  onStartVoice?: () => void
  onLogin?: () => void
}

export function LandingPage({ onStart, onStartVoice, onLogin }: LandingPageProps) {
  const router = useRouter()

  const handleStartVoice = () => {
    if (onStartVoice) {
      onStartVoice()
      return
    }
    router.push("/voice")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">Renters</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Auto</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Life</a>
          <a href="#" className="hover:text-gray-900 transition-colors">How it Works</a>
        </nav>
        
        <motion.div 
          className="font-script text-3xl text-gray-800"
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
          <button className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background illustration - Lemonade style */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="xMidYMax slice">
            {/* Left side - house and car */}
            <g stroke="#E5E5E5" strokeWidth="1.5" fill="none">
              {/* Left house */}
              <rect x="20" y="380" width="140" height="180" />
              <polygon points="20,380 90,300 160,380" />
              <rect x="60" y="480" width="50" height="80" />
              <rect x="40" y="420" width="35" height="40" />
              <circle cx="57" cy="440" r="8" />
              
              {/* Second house */}
              <rect x="180" y="420" width="100" height="140" />
              <polygon points="180,420 230,360 280,420" />
              <rect x="210" y="500" width="35" height="60" />
              
              {/* Car */}
              <ellipse cx="350" cy="540" rx="55" ry="20" />
              <rect x="310" y="495" width="80" height="45" rx="12" />
              <circle cx="325" cy="540" r="12" />
              <circle cx="375" cy="540" r="12" />
              
              {/* Street lamp */}
              <line x1="420" y1="400" x2="420" y2="560" />
              <ellipse cx="420" cy="390" rx="15" ry="10" />
            </g>
            
            {/* Right side - house and person */}
            <g stroke="#E5E5E5" strokeWidth="1.5" fill="none">
              {/* Main house */}
              <rect x="1100" y="350" width="180" height="210" />
              <polygon points="1100,350 1190,260 1280,350" />
              <rect x="1150" y="450" width="60" height="110" />
              <rect x="1120" y="380" width="45" height="50" />
              <rect x="1215" y="380" width="45" height="50" />
              
              {/* Chimney */}
              <rect x="1230" y="280" width="25" height="50" />
              
              {/* Second house */}
              <rect x="1300" y="400" width="120" height="160" />
              <polygon points="1300,400 1360,340 1420,400" />
              <rect x="1330" y="480" width="40" height="80" />
              
              {/* Bench with person */}
              <rect x="1020" y="510" width="70" height="8" />
              <rect x="1025" y="518" width="5" height="42" />
              <rect x="1080" y="518" width="5" height="42" />
              
              {/* Person sitting */}
              <circle cx="1055" cy="475" r="18" />
              <line x1="1055" y1="493" x2="1055" y2="510" />
              <line x1="1040" y1="510" x2="1070" y2="510" />
              
              {/* Dog */}
              <ellipse cx="1000" cy="545" rx="20" ry="12" />
              <circle cx="985" cy="535" r="8" />
            </g>
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-800 leading-tight italic"
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
          
          {/* CTA Button */}
          <motion.div
            className="mt-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={onStart}
              className="bg-[#FF0080] text-white text-base font-semibold px-12 py-4 rounded-lg hover:bg-[#E60073] transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              CHECK OUR PRICES
            </motion.button>
            
            <button
              onClick={handleStartVoice}
              className="mt-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF0080] transition-colors"
            >
              <Mic className="w-4 h-4" />
              Prefer to talk? Try voice mode
            </button>
          </motion.div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-serif italic text-center text-gray-800 mb-4"
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
          >
            We use AI to craft the perfect policy for you, and to handle claims.
            <br />
            It couldn&apos;t be easier or faster. no cap 🧢
          </motion.p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-3xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-gray-500">As little as</p>
              <p className="text-6xl font-semibold text-gray-800">90 seconds</p>
              <p className="text-lg text-gray-500 mt-2">to get covered</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-gray-500">Claims paid in</p>
              <p className="text-6xl font-semibold text-gray-800">3 minutes</p>
              <p className="text-lg text-gray-500 mt-2">not 3 weeks</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-serif italic text-center text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Incredible Prices. Monthly Subscription.
            <br />
            Bundle Discounts.
          </motion.h2>
          <motion.p 
            className="text-center text-gray-500 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            💎 Bundle = bigger savings. it&apos;s giving smart 💅
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Renters", price: "$5/mo", icon: "🏠", desc: "ur stuff, protected" },
              { name: "Auto", price: "$30/mo", icon: "🚗", desc: "protect ur whip" },
              { name: "Life", price: "$8/mo", icon: "💜", desc: "for ur people" },
              { name: "Health", price: "$15/mo", icon: "🏥", desc: "stay healthy bestie" },
            ].map((product, i) => (
              <motion.div
                key={product.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-[#FF0080] hover:shadow-lg transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={onStart}
              >
                <div className="text-4xl mb-3">{product.icon}</div>
                <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{product.desc}</p>
                <button className="w-full bg-[#FF0080] text-white text-sm font-medium py-2.5 rounded-lg group-hover:bg-[#E60073] transition-colors">
                  CHECK PRICES
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
            className="text-3xl md:text-4xl font-serif italic text-gray-800 mb-4"
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
            SowSmart has earned 4.9 stars from real users fr fr
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-1 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-10 h-10 text-[#FF0080]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Alex K.", text: "Finally, insurance that doesn't make me wanna cry 😭 Signed up in 2 mins", avatar: "🧑‍💻" },
              { name: "Nora S.", text: "I put off getting insurance for years. This was painless ngl", avatar: "👩‍🎨" },
              { name: "Jordan R.", text: "The chat was lowkey fun?? Never thought I'd say that about insurance lol", avatar: "🧑‍🎤" },
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
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center text-xl">
                    {review.avatar}
                  </div>
                  <p className="font-medium text-gray-800">{review.name}</p>
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
            className="text-3xl md:text-4xl font-serif italic text-gray-800 mb-4"
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
            2 minutes. That&apos;s literally it. no cap.
          </motion.p>
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={onStart}
              className="bg-[#FF0080] text-white text-base font-semibold px-12 py-4 rounded-lg hover:bg-[#E60073] transition-all shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <button
              onClick={handleStartVoice}
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF0080] transition-colors"
            >
              <Mic className="w-4 h-4" />
              Or try voice mode
            </button>
          </motion.div>
        </div>
      </section>

      {/* Floating Voice Button */}
      <motion.button
        onClick={handleStartVoice}
        className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-xl flex items-center gap-2 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Voice mode accessibility"
      >
        <Mic className="w-6 h-6" />
        <span className="hidden sm:inline pr-1">Voice</span>
      </motion.button>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-script text-xl text-gray-600 mb-2">SowSmart</p>
          <p className="text-sm text-gray-400">
            Built for State Farm Hackathon · Insurance made ez for Gen Z
          </p>
          <p className="text-xs text-gray-400 mt-2">
            ⚠️ Demo app - not actual insurance
          </p>
        </div>
      </footer>
    </div>
  )
}
