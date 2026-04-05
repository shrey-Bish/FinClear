"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { LandingPage, ChatOnboarding, InsightsPage } from "@/components/lemonade"
import { ChatModal } from "@/components/chat-modal"
import { useHydrated } from "@/lib/hooks/useHydrated"
import {
  removeStorage,
  readStorage,
  writeStorage,
} from "@/lib/storage"
import { useUser } from "@/lib/user-context"

// Screen types for the new Lemonade-style flow
type ScreenKey = "landing" | "onboarding" | "insights"

// Storage keys
const USER_DATA_KEY = "sowsmart_user_data"
const ONBOARDING_COMPLETE_KEY = "sowsmart_onboarding_complete"

export default function Home() {
  const { login } = useUser()
  const [currentScreen, setCurrentScreen] = useState<ScreenKey>("landing")
  const [userData, setUserData] = useState<Record<string, any>>({})
  const [showChat, setShowChat] = useState(false)
  const isHydrated = useHydrated()

  // Load saved data on mount
  useEffect(() => {
    if (!isHydrated) return

    const savedUserData = readStorage<Record<string, any>>(USER_DATA_KEY, {})
    const onboardingComplete = readStorage<boolean>(ONBOARDING_COMPLETE_KEY, false)

    if (savedUserData && Object.keys(savedUserData).length > 0) {
      setUserData(savedUserData)
    }

    if (onboardingComplete) {
      setCurrentScreen("insights")
    }
  }, [isHydrated])

  // Save user data when it changes
  useEffect(() => {
    if (!isHydrated) return
    if (Object.keys(userData).length > 0) {
      writeStorage(USER_DATA_KEY, userData)
    }
  }, [userData, isHydrated])

  // Navigation helper
  const navigateTo = (screen: ScreenKey) => {
    setCurrentScreen(screen)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle start - go to onboarding
  const handleStart = () => {
    navigateTo("onboarding")
  }

  // Handle onboarding complete
  const handleOnboardingComplete = (data: Record<string, any>) => {
    setUserData(data)
    writeStorage(ONBOARDING_COMPLETE_KEY, true)
    
    // Login user
    if (data.firstName) {
      login({ name: data.firstName, createdAt: new Date().toISOString() })
    }
    
    navigateTo("insights")
  }

  // Handle back navigation
  const handleBack = () => {
    if (currentScreen === "onboarding") {
      navigateTo("landing")
    } else if (currentScreen === "insights") {
      navigateTo("onboarding")
    }
  }

  // Handle chat toggle
  const handleChat = () => {
    setShowChat(true)
  }

  // Handle agent connect (mock)
  const handleAgentConnect = () => {
    alert("A State Farm agent will text you within 10 minutes! (Demo)")
  }

  // Clear data and start fresh
  const handleClearData = () => {
    setUserData({})
    removeStorage(USER_DATA_KEY)
    removeStorage(ONBOARDING_COMPLETE_KEY)
    navigateTo("landing")
  }

  // Loading state
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="font-script text-3xl text-gray-800 mb-4">SowSmart</div>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {currentScreen === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onStart={handleStart}
              onLogin={handleStart}
            />
          </motion.div>
        )}

        {currentScreen === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatOnboarding
              onComplete={handleOnboardingComplete}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentScreen === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <InsightsPage
              userData={userData}
              onBack={handleBack}
              onChat={handleChat}
              onAgentConnect={handleAgentConnect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <ChatModal
        baseContext={{ app: "SowSmart", userData }}
        focusGoal={userData.biggestWorry}
        persona="Gen Z Insurance Helper"
        userId={userData.firstName || "guest"}
      />
    </>
  )
}
