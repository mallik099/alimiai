import { useEffect, useMemo, useRef, useState } from "react";
import DomainCard from "./DomainCard";
import DomainInput from "./DomainInput";
import { checkDomainAvailability, generateDomainSuggestions } from "../services/domainService";

export default function DomainPanel({ open, onClose }) {
  const panelRef = useRef(null);
  const [brandName, setBrandName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingName, setCheckingName] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, onClose]);

  const canGenerateMore = useMemo(() => items.length > 0 && !loading, [items.length, loading]);

  const generate = async () => {
    if (!brandName.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const next = await generateDomainSuggestions(brandName.trim());
      setItems(next);
    } catch (err) {
      setError(err.message || "Failed to generate domain suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await generate();
  };

  const onCopy = async (name) => {
    try {
      await navigator.clipboard.writeText(name);
      setToast(`${name} copied`);
      setTimeout(() => setToast(""), 1200);
    } catch {
      setError("Copy failed.");
    }
  };

  const onCheck = async (name) => {
    setCheckingName(name);
    setError("");

    try {
      const result = await checkDomainAvailability(name);
      setItems((prev) => prev.map((entry) => (entry.name === name ? { ...entry, status: result.status } : entry)));
    } catch (err) {
      setError(err.message || "Availability check failed.");
    } finally {
      setCheckingName("");
    }
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 top-14 z-40 w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-soft animate-in fade-in slide-in-from-top-2 duration-200">
      <div ref={panelRef} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">AI Domain Name Suggestions</h3>
          <button type="button" className="text-xs text-slate-500 hover:text-ink" onClick={onClose}>
            Close
          </button>
        </div>

        <DomainInput value={brandName} onChange={setBrandName} onSubmit={onSubmit} loading={loading} />

        {loading ? <p className="text-xs text-slate-500">Generating domain suggestions...</p> : null}
        {error ? <p className="rounded-lg bg-red-50 px-2 py-1 text-xs text-danger">{error}</p> : null}
        {toast ? <p className="rounded-lg bg-green-50 px-2 py-1 text-xs text-green-700">{toast}</p> : null}

        {items.length > 0 ? (
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <DomainCard
                key={item.name}
                item={item}
                onCopy={onCopy}
                onCheck={onCheck}
                checking={checkingName === item.name}
              />
            ))}
          </div>
        ) : null}

        <div className="flex justify-end">
          <button type="button" className="btn-secondary" disabled={!canGenerateMore} onClick={generate}>
            Generate More
          </button>
        </div>
      </div>
    </div>
  );
}
