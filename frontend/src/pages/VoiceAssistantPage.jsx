import { useEffect, useMemo, useRef, useState } from "react";
import TopNavbar from "../components/TopNavbar";
import { sendChat } from "../services/backendService";

const VOICE_OPTIONS = [
  { id: "female", label: "Female", rate: 1, pitch: 1.12, hints: ["female", "zira", "samantha", "google us english"] },
  { id: "male", label: "Male", rate: 0.95, pitch: 0.9, hints: ["male", "david", "mark", "alex"] },
  { id: "futuristic", label: "Futuristic", rate: 1.04, pitch: 1.24, hints: ["google", "synth", "neural"] }
];

const starterPrompts = [
  "Suggest 5 brand names for my AI travel app",
  "Create taglines for a student productivity startup",
  "Give available-sounding domain ideas for GreenNest",
  "Write a short brand story for a fintech product"
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pickVoice(voices, profile) {
  if (!voices.length) return null;
  const byHint = voices.find((voice) =>
    profile.hints.some((hint) => voice.name.toLowerCase().includes(hint) || voice.voiceURI.toLowerCase().includes(hint))
  );
  return byHint || voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) || voices[0];
}

function extractCopySnippets(text) {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .filter((line) => line.length > 4);

  const compact = lines.length ? lines : text.split(/[.!?]/).map((line) => line.trim()).filter(Boolean);
  return Array.from(new Set(compact)).slice(0, 4);
}

export default function VoiceAssistantPage() {
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [error, setError] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("female");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [lastUserPrompt, setLastUserPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      id: generateId(),
      role: "assistant",
      text: "Hi, I am Alkimi AI. Tell me your startup idea and I will suggest names, taglines, domains, and brand direction.",
      createdAt: new Date().toISOString()
    }
  ]);

  const selectedVoice = useMemo(() => VOICE_OPTIONS.find((voice) => voice.id === voiceStyle) || VOICE_OPTIONS[0], [voiceStyle]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, liveTranscript, thinking]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const refreshVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setError("");
      setListening(true);
      setLiveTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }
      setLiveTranscript(interim || finalText);
      if (finalText.trim()) {
        setLiveTranscript("");
        runPrompt(finalText.trim(), { fromVoice: true });
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      setError(event.error === "not-allowed" ? "Microphone permission denied." : "Voice recognition failed.");
    };

    recognition.onend = () => {
      setListening(false);
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speakResponse = (text) => {
    if (!("speechSynthesis" in window) || !text?.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const selected = pickVoice(availableVoices, selectedVoice);
    if (selected) utterance.voice = selected;
    utterance.rate = selectedVoice.rate;
    utterance.pitch = selectedVoice.pitch;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role, text, createdAt: new Date().toISOString() }
    ]);
  };

  const runPrompt = async (prompt, options = {}) => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || thinking) return;

    if (!options.skipUserBubble) {
      addMessage("user", cleanPrompt);
    }

    setInputText("");
    setError("");
    setThinking(true);
    setLastUserPrompt(cleanPrompt);

    try {
      const response = await sendChat(cleanPrompt, true, { retries: 1 });
      const text = response?.response?.trim() || "I could not generate a response. Please try again.";
      addMessage("assistant", text);
      speakResponse(text);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Failed to get AI response.";
      addMessage("assistant", `I ran into an issue: ${detail}`);
    } finally {
      setThinking(false);
      if (options.fromVoice) {
        setListening(false);
      }
    }
  };

  const onMicClick = () => {
    if (!speechSupported) {
      setError("Web Speech API is not available in this browser.");
      return;
    }
    if (thinking) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    recognitionRef.current?.start();
  };

  const saveConversation = () => {
    const text = messages
      .map((message) => `[${message.role.toUpperCase()}] ${message.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alkimi-ai-conversation.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="voice" />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />

        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-ink sm:text-5xl">Talk to Alkimi AI</h1>
          <p className="mt-3 text-slate-600 sm:text-lg">
            Describe your brand idea or ask branding questions and Alkimi AI will reply in voice.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onMicClick}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-soft transition duration-300 ${
                listening
                  ? "bg-rose-500 animate-pulse"
                  : thinking
                    ? "bg-sky-500"
                    : "bg-ink hover:scale-105"
              }`}
            >
              {thinking ? (
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <span className="text-sm font-semibold tracking-wide">MIC</span>
              )}
              {!thinking ? (
                <span className={`absolute inset-0 rounded-full ${listening ? "animate-ping bg-rose-300/40" : "bg-sky-200/20"}`} />
              ) : null}
            </button>
            <p className="text-sm text-slate-500">
              {thinking ? "Thinking..." : listening ? "Listening..." : "Tap the mic and start speaking"}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <select
              value={voiceStyle}
              onChange={(event) => setVoiceStyle(event.target.value)}
              className="input w-44"
            >
              {VOICE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  Voice: {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (lastUserPrompt) runPrompt(lastUserPrompt, { skipUserBubble: true });
              }}
              disabled={!lastUserPrompt || thinking}
            >
              Regenerate Response
            </button>
            <button type="button" className="btn-secondary" onClick={saveConversation}>
              Save Conversation
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        </section>

        <section className="mx-auto mt-8 max-w-4xl">
          <div className="card rounded-3xl p-4 sm:p-6">
            <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-ink text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    {message.role === "assistant" ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn-secondary !px-3 !py-1 text-xs" onClick={() => speakResponse(message.text)}>
                            Replay Voice
                          </button>
                          <button
                            type="button"
                            className="btn-secondary !px-3 !py-1 text-xs"
                            onClick={() => navigator.clipboard.writeText(message.text)}
                          >
                            Copy Reply
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {extractCopySnippets(message.text).map((snippet) => (
                            <button
                              key={`${message.id}-${snippet}`}
                              type="button"
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                              onClick={() => navigator.clipboard.writeText(snippet)}
                              title="Copy text"
                            >
                              Copy: {snippet.length > 34 ? `${snippet.slice(0, 34)}...` : snippet}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {liveTranscript ? (
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl bg-ink/80 px-4 py-3 text-sm text-white">
                    {liveTranscript}
                  </div>
                </div>
              ) : null}

              {thinking ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:240ms]" />
                    </span>
                    <span className="ml-2">Typing response...</span>
                  </div>
                </div>
              ) : null}

              {speaking ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs text-sky-700">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-1 animate-pulse rounded bg-sky-500" />
                      <span className="h-4 w-1 animate-pulse rounded bg-sky-500 [animation-delay:120ms]" />
                      <span className="h-2.5 w-1 animate-pulse rounded bg-sky-500 [animation-delay:220ms]" />
                      <span>Alkimi AI speaking...</span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div ref={chatEndRef} />
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="input flex-1"
                  placeholder="Type your startup idea or branding question..."
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      runPrompt(inputText);
                    }
                  }}
                />
                <button type="button" className="btn-primary sm:min-w-[130px]" onClick={() => runPrompt(inputText)} disabled={thinking}>
                  Send
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => runPrompt(prompt)}
                    disabled={thinking}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {!speechSupported ? (
                <p className="mt-4 text-xs text-amber-600">
                  Voice recognition is not supported in this browser. You can still chat using text input.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
