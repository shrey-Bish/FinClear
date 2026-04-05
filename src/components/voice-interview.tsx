"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Loader2, Sparkles, Volume2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { withDerivedMetrics } from "@/lib/insights";
import type { EnrollmentFormData } from "@/lib/types";

interface VoiceInterviewProps {
  initialData: EnrollmentFormData;
  onComplete: (data: EnrollmentFormData) => Promise<void> | void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type InterviewState = "idle" | "listening" | "processing" | "speaking" | "complete";

// 🔒 HARD 2.5 SECOND CUTOFF
const SILENCE_THRESHOLD = 2500;

export function VoiceInterview({ initialData, onComplete }: VoiceInterviewProps) {
  const { user } = useUser();
  const [status, setStatus] = useState<InterviewState>("idle");
  const [transcript, setTranscript] = useState("");
  const [aiMessage, setAiMessage] = useState(
    "Hello! I'm SowSmart. I'll ask a few quick questions to personalize your profile. Just answer out loud. Ready when you are."
  );
  const [currentData, setCurrentData] = useState<Partial<EnrollmentFormData>>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [silenceProgress, setSilenceProgress] = useState(0);

  // 🔑 CORE TIMING REFS (BYPASS REACT STATE)
  const transcriptRef = useRef("");
  const lastVoiceActivityRef = useRef(Date.now());
  const silenceCheckIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const recognitionRef = useRef<any>(null);
  const isInterviewActiveRef = useRef(false);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        if (window.speechSynthesis.getVoices().length > 0 && !isUnmountedRef.current) {
          setVoicesLoaded(true);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      isUnmountedRef.current = true;
      isInterviewActiveRef.current = false;
      clearInterval(silenceCheckIntervalRef.current);
      stopRecognition();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopRecognition = () => {
    clearInterval(silenceCheckIntervalRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
      recognitionRef.current = null;
    }
  };

  // 🔥 HARD SILENCE DETECTOR (Runs every 100ms)
  const startSilenceChecker = () => {
    clearInterval(silenceCheckIntervalRef.current);
    lastVoiceActivityRef.current = Date.now();
    setSilenceProgress(0);

    silenceCheckIntervalRef.current = setInterval(() => {
      if (!isInterviewActiveRef.current || isUnmountedRef.current) return;

      const timeSinceSpeech = Date.now() - lastVoiceActivityRef.current;
      const progress = Math.min((timeSinceSpeech / SILENCE_THRESHOLD) * 100, 100);
      setSilenceProgress(progress);

      if (timeSinceSpeech >= SILENCE_THRESHOLD && transcriptRef.current.trim()) {
        clearInterval(silenceCheckIntervalRef.current);
        stopRecognition();
        handleAutoSubmit(transcriptRef.current.trim());
      }
    }, 100);
  };

  const startListening = async () => {
    if (!isInterviewActiveRef.current) return;
    setStatus("listening");
    setError(null);
    transcriptRef.current = "";
    setTranscript("");
    startSilenceChecker(); // Start the hard 2.5s timer

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Browser doesn't support voice. Using text fallback mode.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Mic access denied. Please allow permissions and refresh.");
      isInterviewActiveRef.current = false;
      setStatus("idle");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!isUnmountedRef.current && isInterviewActiveRef.current) setStatus("listening");
    };

    recognition.onresult = (event: any) => {
      if (!isInterviewActiveRef.current || isUnmountedRef.current) return;

      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }

      const newText = (final + interim).trim();

      // 🔑 ONLY RESET TIMER IF TRANSCRIPT ACTUALLY GREW (Filters AC/noise)
      if (newText.length > transcriptRef.current.length) {
        transcriptRef.current = newText;
        setTranscript(newText);
        lastVoiceActivityRef.current = Date.now(); // Hard reset of 2.5s countdown
      }
    };

    recognition.onerror = (event: any) => {
      if (isUnmountedRef.current) return;
      if (event.error === "not-allowed") {
        setError("Mic blocked. Please allow permissions.");
        isInterviewActiveRef.current = false;
        setStatus("idle");
      } else if (event.error === "no-speech" || event.error === "aborted") {
        // Browser VAD fired, keep listening
      }
    };

    recognition.onend = () => {
      // Browser dropped connection? Restart if still active
      if (!isUnmountedRef.current && isInterviewActiveRef.current && status === "listening") {
        setTimeout(() => {
          if (isInterviewActiveRef.current && status === "listening") startListening();
        }, 200);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAutoSubmit = async (text: string) => {
    setStatus("processing");
    setSilenceProgress(0);

    try {
      const resp = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text,
          currentData,
          userName: user?.name,
        }),
      });

      if (!resp.ok) throw new Error("API failed");
      const data = await resp.json();

      if (data.extractedData) {
        setCurrentData(prev => ({ ...prev, ...data.extractedData }));
      }

      if (data.isComplete) {
        setStatus("complete");
        isInterviewActiveRef.current = false;
        const finalData = withDerivedMetrics({
          ...initialData,
          ...currentData,
          ...data.extractedData,
        } as EnrollmentFormData);
        setTimeout(() => onComplete(finalData), 2000);
      } else if (data.replyText) {
        setAiMessage(data.replyText);
        transcriptRef.current = "";
        setTranscript("");
        await playTTS(data.replyText);
      }
    } catch (err) {
      console.error(err);
      setError("Lost connection. Try speaking again.");
      setTimeout(() => {
        if (isInterviewActiveRef.current) startListening();
      }, 1000);
    }
  };

  const playTTS = async (text: string) => {
    if (isUnmountedRef.current) return;
    setStatus("speaking");

    return new Promise<void>((resolve) => {
      if (!window.speechSynthesis) {
        setStatus("idle");
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);

      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find((x: any) =>
          x.lang.startsWith("en-") && (x.name.includes("Female") || x.name.includes("Google") || x.name.includes("Rachel"))
        ) || voices.find((x: any) => x.lang.startsWith("en-")) || voices[0];
        if (v) utter.voice = v;

        utter.rate = 1.05;
        utter.pitch = 1.0;

        utter.onend = () => {
          if (!isUnmountedRef.current) setStatus("idle");
          resolve();
        };
        utter.onerror = () => {
          if (!isUnmountedRef.current) setStatus("idle");
          resolve();
        };

        setTimeout(() => {
          if (!isUnmountedRef.current) window.speechSynthesis.speak(utter);
        }, 50);
      };

      if (voicesLoaded && window.speechSynthesis.getVoices().length > 0) pickVoice();
      else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          pickVoice();
        };
      }
    }).then(() => {
      if (!isUnmountedRef.current && isInterviewActiveRef.current && status !== "complete") {
        setTimeout(() => startListening(), 600);
      }
    });
  };

  const beginInterview = () => {
    isInterviewActiveRef.current = true;
    setStatus("idle");
    setError(null);
    playTTS(aiMessage).then(() => {
      if (!isUnmountedRef.current && isInterviewActiveRef.current) {
        setTimeout(startListening, 500);
      }
    });
  };

  const isSetup = status === "idle" && aiMessage.includes("Ready when you are");
  const isComplete = status === "complete";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 w-full">
      <Card className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xl text-center relative min-h-[500px] flex flex-col items-center justify-center">

        <div className={`absolute inset-0 opacity-10 transition-colors duration-700 ${status === "listening" ? "bg-blue-500" :
          status === "processing" ? "bg-purple-500" :
            status === "speaking" ? "bg-green-500" : "bg-transparent"
          }`} />

        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md">

          <div className="relative flex items-center justify-center h-32 w-32">
            {status === "listening" && (
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * silenceProgress) / 100}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>
            )}

            <motion.div
              className={`flex h-24 w-24 items-center justify-center rounded-full shadow-lg ${status === "listening" ? "bg-blue-50" :
                status === "speaking" ? "bg-green-50" :
                  status === "processing" ? "bg-purple-50" :
                    "bg-[#E8F5E9]"
                }`}
              animate={status === "listening" ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {status === "listening" ? <Mic className="h-10 w-10 text-blue-600 animate-pulse" /> :
                status === "speaking" ? <Volume2 className="h-10 w-10 text-green-600 animate-pulse" /> :
                  status === "processing" ? <Loader2 className="h-10 w-10 text-purple-600 animate-spin" /> :
                    <Sparkles className="h-10 w-10 text-[#2E7D32]" />}
            </motion.div>
          </div>

          <div className="min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={aiMessage + status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-semibold text-[#1A1A1A] leading-relaxed"
              >
                {aiMessage}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {status === "listening" && transcript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full rounded-xl bg-blue-50/80 p-4 border border-blue-100 text-left"
              >
                <p className="text-blue-900 text-sm font-medium">You said:</p>
                <p className="text-gray-700 mt-1">{transcript}</p>
                {silenceProgress > 10 && (
                  <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      animate={{ width: `${silenceProgress}%` }}
                      transition={{ duration: 0.05 }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="w-full rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSetup && (
            <Button
              onClick={beginInterview}
              className="mt-4 rounded-full bg-[#2E7D32] px-12 py-6 text-lg font-bold hover:bg-[#1B5E20] shadow-xl text-white transition-all"
            >
              Start Voice Interview
            </Button>
          )}

          {isComplete && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-gray-600">All set. Personalizing your dashboard...</p>
            </motion.div>
          )}

          {status === "listening" && !isComplete && (
            <p className="text-sm text-gray-400 mt-2">Just keep talking. I'll jump in when you pause.</p>
          )}
        </div>
      </Card>
    </div>
  );
}