export type ChatPayload = { 
  prompt: string
  userId?: string
  sessionId?: string
  context?: Record<string, unknown>
  userProfile?: {
    age?: number
    income?: string
    dependents?: number
    riskTolerance?: number
  }
}
export type ChatResponse =
  | { message: string; provider: "gemini" | "gemini-fallback"; sources?: string[]; note?: string; suggestions?: string[] }
  | { error: string; [k: string]: unknown }

export async function askSowSmart(input: ChatPayload): Promise<ChatResponse> {
  const res = await fetch("/api/chat", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(input) 
  })
  const ct = res.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    const j = await res.json()
    return res.ok ? j : ({ error: "upstream_error", status: res.status, ...j } as ChatResponse)
  }
  const t = await res.text()
  return res.ok 
    ? ({ message: t, provider: "gemini" } as ChatResponse) 
    : ({ error: t || "upstream_error", status: res.status } as ChatResponse)
}
