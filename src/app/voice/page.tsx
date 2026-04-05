"use client"

import { useRouter } from "next/navigation"

import { VoiceAgent } from "@/components/lemonade/VoiceAgent"
import { useUser } from "@/lib/user-context"

const USER_DATA_KEY = "sowsmart_user_data"
const ONBOARDING_COMPLETE_KEY = "sowsmart_onboarding_complete"

export default function VoicePage() {
  const router = useRouter()
  const { login } = useUser()

  const handleClose = () => {
    router.push("/")
  }

  const handleComplete = (data: Record<string, any>) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(data))
      window.localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true")
    }

    if (data.firstName) {
      login({ name: data.firstName, createdAt: new Date().toISOString() })
    }

    router.push("/")
  }

  return <VoiceAgent isOpen={true} onClose={handleClose} onComplete={handleComplete} />
}