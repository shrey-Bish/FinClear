import { NextResponse } from "next/server"

import { getStore } from "@/app/api/_store"
import { hashPassword } from "@/lib/auth-password"

interface RegisterBody {
  email?: string
  password?: string
  name?: string
  answers?: Record<string, any>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
    }

    const store = getStore()
    const existing = store.accounts.get(email)
    if (existing) {
      return NextResponse.json(
        {
          error: "Account already exists.",
          hasExistingAccount: true,
          existingProfile: store.profilesByEmail.get(email) ?? null,
        },
        { status: 409 }
      )
    }

    const accountId = crypto.randomUUID()
    store.accounts.set(email, {
      id: accountId,
      email,
      passwordHash: hashPassword(password),
      provider: "credentials",
      name: name || email,
      createdAt: new Date().toISOString(),
    })

    if (body.answers) {
      store.profilesByEmail.set(email, body.answers)
    }

    return NextResponse.json({ ok: true, email }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to register account", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
