import { NextResponse } from "next/server"
import { ElevenLabsClient, ElevenLabsError } from "@elevenlabs/elevenlabs-js"

export const runtime = "nodejs"

type VoiceRequest = {
  text?: string
  voiceId?: string
  modelId?: string
}

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"
const DEFAULT_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2"

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 503 })
    }

    const body = (await request.json()) as VoiceRequest
    const text = typeof body.text === "string" ? body.text.trim() : ""

    if (!text) {
      return NextResponse.json({ error: "Missing or empty 'text'" }, { status: 400 })
    }

    if (text.length > 1600) {
      return NextResponse.json({ error: "Text too long for voice synthesis" }, { status: 400 })
    }

    const voiceId = body.voiceId?.trim() || DEFAULT_VOICE_ID
    const modelId = body.modelId?.trim() || DEFAULT_MODEL_ID

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.45,
        similarityBoost: 0.85,
        style: 0.2,
        useSpeakerBoost: true,
      },
    })

    const audio = Buffer.from(await new Response(audioStream).arrayBuffer())
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      const status = error.statusCode ?? 500
      const detail =
        typeof error.body === "string"
          ? error.body
          : error.body
            ? JSON.stringify(error.body)
            : error.message
      const isPaymentRequired = status === 402
      return NextResponse.json(
        {
          error: isPaymentRequired
            ? "ElevenLabs payment required"
            : "ElevenLabs synthesis failed",
          detail: detail || `HTTP ${status}`,
          hint: isPaymentRequired
            ? "Check your ElevenLabs plan, credits, and API key permissions. Webhooks are not required for TTS playback."
            : undefined,
        },
        { status }
      )
    }

    const detail = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Voice API failed", detail }, { status: 500 })
  }
}