"use client"

type VoicePlayback = {
  stop: () => void
  finished: Promise<void>
  source: "elevenlabs" | "silent"
}

type SpeakOptions = {
  voiceId?: string
  modelId?: string
}

let activePlayback: VoicePlayback | null = null

export function prepareVoiceText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/[*_`~>#]/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function stopSowSmartVoice() {
  activePlayback?.stop()
  activePlayback = null
}

export async function speakSowSmartText(text: string, options: SpeakOptions = {}): Promise<VoicePlayback> {
  const sanitizedText = prepareVoiceText(text)

  stopSowSmartVoice()

  if (!sanitizedText || typeof window === "undefined") {
    return {
      stop: () => {},
      finished: Promise.resolve(),
      source: "silent",
    }
  }

  try {
    const response = await fetch("/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sanitizedText,
        voiceId: options.voiceId,
        modelId: options.modelId,
      }),
    })

    if (!response.ok) {
      return {
        stop: () => {},
        finished: Promise.resolve(),
        source: "silent",
      }
    }

    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob)
    const audio = new Audio(audioUrl)
    audio.preload = "auto"

    let settled = false
    const playback: VoicePlayback = {
      stop: () => {},
      finished: Promise.resolve(),
      source: "elevenlabs",
    }

    playback.finished = new Promise<void>((resolve) => {
      const finalize = () => {
        if (settled) return
        settled = true
        URL.revokeObjectURL(audioUrl)
        if (activePlayback === playback) {
          activePlayback = null
        }
        resolve()
      }

      playback.stop = () => {
        if (settled) return
        audio.pause()
        audio.currentTime = 0
        finalize()
      }

      audio.onended = finalize
      audio.onerror = finalize
    })

    activePlayback = playback

    try {
      await audio.play()
    } catch {
      playback.stop()
    }

    return playback
  } catch {
    return {
      stop: () => {},
      finished: Promise.resolve(),
      source: "silent",
    }
  }
}
