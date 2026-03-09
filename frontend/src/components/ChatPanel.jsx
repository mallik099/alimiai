import { useEffect, useMemo, useRef, useState } from "react";
import { getApiBaseUrl } from "../services/apiClient";

const quickPrompts = [
  "Generate brand names for an AI fitness startup",
  "Create a tagline for FitPulse",
  "Create a logo for NovaLabs in modern style",
  "Analyze market positioning for my meal prep startup"
];

export default function ChatPanel({ chat }) {
  const [input, setInput] = useState("");
  const [useGroq, setUseGroq] = useState(true);
  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const messagesRef = useRef(null);

  const submit = async (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) {
      return;
    }
    setInput("");
    await chat.send(value, useGroq);
  };

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chat.messages, chat.busy]);

  return (
    <section className="card flex h-[72vh] flex-col overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold">AI Conversation</h2>
        <p className="text-sm text-slate-500">Buffered responses, cancel support, and automatic retry on transient errors.</p>
      </div>

      <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {chat.messages.length === 0 ? <p className="text-sm text-slate-500">No messages yet.</p> : null}

        {chat.messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm transition ${
              message.role === "user" ? "ml-auto bg-ink text-white" : "bg-slate-100 text-slate-800"
            }`}
          >
            {message.buffering ? (
              <div className="space-y-2">
                <div className="h-2.5 w-24 animate-pulse rounded bg-slate-300" />
                <div className="h-2.5 w-36 animate-pulse rounded bg-slate-300" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}

            {message.imageUrl ? (
              <img
                src={`${apiBase}${message.imageUrl}`}
                alt="Generated brand visual"
                className="mt-2 rounded-lg border border-slate-200"
              />
            ) : null}

            {message.responseTimeMs ? (
              <p className="mt-2 text-[11px] text-slate-500">Responded in {message.responseTimeMs} ms</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-2">
          <textarea
            className="input min-h-24"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask for brand names, logos, taglines, market positioning, consistency checks..."
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={useGroq} onChange={(event) => setUseGroq(event.target.checked)} />
              Use Groq
            </label>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary" onClick={chat.reset}>
                Clear
              </button>
              {chat.busy ? (
                <button type="button" className="btn-secondary" onClick={chat.cancel}>
                  Stop
                </button>
              ) : null}
              <button type="submit" className="btn-primary" disabled={chat.busy}>
                {chat.busy ? "Buffering..." : "Send"}
              </button>
            </div>
          </div>
        </form>

        {chat.error ? (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
            <span>{chat.error}</span>
            {chat.canRetry ? (
              <button type="button" className="btn-secondary" onClick={chat.retryLast}>
                Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
