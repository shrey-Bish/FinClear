import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch profile from Supabase
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" - that's ok for new users
    console.error("Error fetching profile:", error)
  }

  return NextResponse.json({
    email: user.email,
    profile: profile?.profile_data ?? null,
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { profile?: Record<string, any> }
  const profile = body.profile

  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Missing profile payload" }, { status: 400 })
  }

  // Fetch existing profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("profile_data")
    .eq("id", user.id)
    .single()

  const merged = { ...(existing?.profile_data || {}), ...profile }

  // Upsert profile data
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || merged.firstName || user.email?.split("@")[0],
      first_name: merged.firstName,
      age: merged.age,
      living_situation: merged.livingSituation,
      income: merged.income,
      biggest_worry: merged.biggestWorry,
      owns_car: merged.ownsCar === "yes",
      has_pets: merged.hasPets === "yes",
      profile_data: merged,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error upserting profile:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, profile: merged })
}
