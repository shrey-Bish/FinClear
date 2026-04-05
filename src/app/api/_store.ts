import type { ChatEntry, EnrollmentFormData, SowSmartInsights } from "@/lib/types"

interface MemoryStore {
  profiles: Map<string, EnrollmentFormData>
  insights: Map<string, SowSmartInsights>
  chats: Map<string, ChatEntry[]>
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
    }
  }
  return globalThis.__lifelensStore
}
