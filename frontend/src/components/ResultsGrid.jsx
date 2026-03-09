import { useEffect, useState } from "react";
import BrandNameCard from "./BrandNameCard";

export default function ResultsGrid({
  results,
  summary,
  favorites,
  copiedName,
  logoLoadingByName,
  onCopy,
  onFavorite,
  onCheckAvailability,
  onGenerateLogo,
  onRegenerate,
  onGenerateMore,
  loading
}) {
  const [typedSummary, setTypedSummary] = useState("");

  useEffect(() => {
    if (!summary) {
      setTypedSummary("");
      return;
    }

    let index = 0;
    setTypedSummary("");
    const timer = setInterval(() => {
      index += 1;
      setTypedSummary(summary.slice(0, index));
      if (index >= summary.length) {
        clearInterval(timer);
      }
    }, 14);

    return () => clearInterval(timer);
  }, [summary]);

  if (!results?.length) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-ink">Generated Brand Names</h2>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={onRegenerate} disabled={loading}>
            Regenerate
          </button>
          <button type="button" className="btn-primary" onClick={onGenerateMore} disabled={loading}>
            Generate More
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((entry) => (
          <BrandNameCard
            key={entry.name}
            entry={entry}
            copied={copiedName === entry.name}
            isFavorite={favorites.includes(entry.name)}
            logoGenerating={!!logoLoadingByName[entry.name]}
            onCopy={onCopy}
            onFavorite={onFavorite}
            onCheckAvailability={onCheckAvailability}
            onGenerateLogo={onGenerateLogo}
          />
        ))}
      </div>

      <div className="card p-5">
        <h3 className="text-base font-semibold text-ink">AI Insight Summary</h3>
        <p className="mt-3 min-h-16 whitespace-pre-wrap text-sm text-slate-700">{typedSummary}</p>
      </div>
    </section>
  );
}
