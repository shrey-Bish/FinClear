"use client"

type VoicePlayback = {
  stop: () => void
  finished: Promise<void>
  source: "elevenlabs" | "speech-synthesis" | "silent"
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

function pickFallbackVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null

  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => {
      const name = voice.name.toLowerCase()
      return name.includes("samantha") || name.includes("rachel") || name.includes("female") || name.includes("google")
    }) ?? voices.find((voice) => voice.lang.startsWith("en-")) ?? voices[0] ?? null
  )
}

export function stopSowSmartVoice() {
  activePlayback?.stop()
  activePlayback = null

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

export async function speakSowSmartText(text: string, options: SpeakOptions = {}): Promise<VoicePlayback> {
  const sanitizedText = prepareVoiceText(text)

  stopSowSmartVoice()

  if (!sanitizedText) {
    return {
      stop: () => {},
      finished: Promise.resolve(),
      source: "silent",
    }
  }

  if (typeof window !== "undefined") {
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

      if (response.ok) {
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
      }
    } catch {
      // Fall back to the browser if the ElevenLabs request is unavailable.
    }
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return {
      stop: () => {},
      finished: Promise.resolve(),
      source: "silent",
    }
  }

  const utterance = new SpeechSynthesisUtterance(sanitizedText)
  utterance.rate = 1.02
  utterance.pitch = 1.02

  const fallbackVoice = pickFallbackVoice()
  if (fallbackVoice) {
    utterance.voice = fallbackVoice
  }

  let finished = false
  const playback: VoicePlayback = {
    stop: () => {},
    finished: Promise.resolve(),
    source: "speech-synthesis",
  }

  playback.finished = new Promise<void>((resolve) => {
    const finalize = () => {
      if (finished) return
      finished = true
      if (activePlayback === playback) {
        activePlayback = null
      }
      resolve()
    }

    playback.stop = () => {
      if (finished) return
      window.speechSynthesis.cancel()
      finalize()
    }

    utterance.onend = finalize
    utterance.onerror = finalize
  })

  activePlayback = playback
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)

  return playback
}