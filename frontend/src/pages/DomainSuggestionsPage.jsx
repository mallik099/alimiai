import { useMemo, useState } from "react";
import DomainCard from "../components/DomainCard";
import DomainInput from "../components/DomainInput";
import TopNavbar from "../components/TopNavbar";
import { checkDomainAvailability, generateDomainSuggestions } from "../services/domainService";

export default function DomainSuggestionsPage() {
  const [brandName, setBrandName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingName, setCheckingName] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="domain" />

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6">
        <section className="text-center fade-in-up">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">AI Domain Name Suggestions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Enter your brand name to generate domain ideas and check availability instantly.
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-3xl">
          <div className="card p-6 shadow-soft sm:p-8">
            <DomainInput value={brandName} onChange={setBrandName} onSubmit={onSubmit} loading={loading} />
            {loading ? <p className="mt-3 text-sm text-slate-500">Generating domain suggestions...</p> : null}
            {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}
            {toast ? <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{toast}</p> : null}
          </div>
        </section>

        {items.length > 0 ? (
          <section className="mx-auto mt-8 w-full max-w-4xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Suggestions</h2>
              <button type="button" className="btn-secondary" disabled={!canGenerateMore} onClick={generate}>
                Generate More
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
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
          </section>
        ) : null}
      </main>
    </div>
  );
}
