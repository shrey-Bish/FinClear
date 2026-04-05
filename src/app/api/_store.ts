import type { ChatEntry, EnrollmentFormData, SowSmartInsights } from "@/lib/types"

export interface StoredAccount {
  id: string
  email: string
  passwordHash?: string
  provider: "credentials" | "google"
  name?: string
  image?: string
  createdAt: string
}

interface MemoryStore {
  profiles: Map<string, EnrollmentFormData>
  insights: Map<string, SowSmartInsights>
  chats: Map<string, ChatEntry[]>
  accounts: Map<string, StoredAccount>
  profilesByEmail: Map<string, Record<string, any>>
}

declare global {
  // eslint-disable-next-line no-var
  var __lifelensStore: MemoryStore | undefined
}

export function getStore(): MemoryStore {
  if (!globalThis.__lifelensStore) {
    globalThis.__lifelensStore = {
      profiles: new Map(),
      insights: new Map(),
      chats: new Map(),
      accounts: new Map(),
      profilesByEmail: new Map(),
    }
  }
  return globalThis.__lifelensStore
}
