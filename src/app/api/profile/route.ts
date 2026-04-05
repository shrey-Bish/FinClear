import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { getStore } from "@/app/api/_store"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const store = getStore()
  return NextResponse.json({
    email,
    profile: store.profilesByEmail.get(email) ?? null,
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { profile?: Record<string, any> }
  const profile = body.profile

  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Missing profile payload" }, { status: 400 })
  }

  const store = getStore()
  const existing = store.profilesByEmail.get(email) || {}
  const merged = { ...existing, ...profile }
  store.profilesByEmail.set(email, merged)

  return NextResponse.json({ ok: true, profile: merged })
}
