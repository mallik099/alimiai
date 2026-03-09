import { useEffect, useMemo, useRef, useState } from "react";
import { sendChat } from "../services/backendService";

const HISTORY_KEY = "alkmiai_chat_history";

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  const stable = messages
    .filter((message) => !message.buffering)
    .slice(-50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(stable));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function useChat() {
  const [messages, setMessages] = useState(loadHistory());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedRequest, setLastFailedRequest] = useState(null);
  const abortRef = useRef(null);

  const commitMessages = (updater) => {
    setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveHistory(next);
      return next;
    });
  };

  const streamAssistantMessage = async (placeholderId, fullText, imageUrl, type, responseTimeMs) => {
    const safeText = fullText || "I could not generate a response. Please try again.";
    const chunkSize = 12;
    let cursor = 0;

    while (cursor < safeText.length) {
      cursor = Math.min(cursor + chunkSize, safeText.length);
      const partial = safeText.slice(0, cursor);
      commitMessages((prev) =>
        prev.map((entry) =>
          entry.id === placeholderId
            ? {
                ...entry,
                text: partial,
                buffering: cursor < safeText.length
              }
            : entry
        )
      );
      await delay(15);
    }

    commitMessages((prev) =>
      prev.map((entry) =>
        entry.id === placeholderId
          ? {
              ...entry,
              text: safeText,
              imageUrl: imageUrl || null,
              type,
              buffering: false,
              responseTimeMs
            }
          : entry
      )
    );
  };

  const send = async (text, useGroq = true) => {
    if (!text?.trim() || busy) {
      return;
    }

    const trimmed = text.trim();
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      createdAt: new Date().toISOString()
    };

    const assistantPlaceholderId = crypto.randomUUID();
    const assistantPlaceholder = {
      id: assistantPlaceholderId,
      role: "assistant",
      text: "",
      buffering: true,
      createdAt: new Date().toISOString()
    };

    commitMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setBusy(true);
    setError("");

    const start = performance.now();
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await sendChat(trimmed, useGroq, {
        signal: abortController.signal,
        retries: 1
      });

      const elapsed = Math.round(performance.now() - start);
      await streamAssistantMessage(
        assistantPlaceholderId,
        response.response,
        response.image_url,
        response.type,
        elapsed
      );
      setLastFailedRequest(null);
    } catch (err) {
      const isAborted = err?.code === "ERR_CANCELED" || err?.name === "AbortError";

      commitMessages((prev) => prev.filter((entry) => entry.id !== assistantPlaceholderId));
      setError(isAborted ? "Request canceled." : err.message || "Request failed.");
      if (!isAborted) {
        setLastFailedRequest({ text: trimmed, useGroq });
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  };

  const retryLast = async () => {
    if (!lastFailedRequest || busy) {
      return;
    }
    await send(lastFailedRequest.text, lastFailedRequest.useGroq);
  };

  const cancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  };

  const reset = () => {
    cancel();
    setMessages([]);
    setError("");
    setLastFailedRequest(null);
    localStorage.removeItem(HISTORY_KEY);
  };

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const stats = useMemo(() => {
    const total = messages.length;
    const assistant = messages.filter((m) => m.role === "assistant").length;
    const images = messages.filter((m) => m.imageUrl).length;
    return { total, assistant, images };
  }, [messages]);

  return { messages, busy, error, send, reset, retryLast, cancel, canRetry: !!lastFailedRequest, stats };
}
