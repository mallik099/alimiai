import { useEffect, useMemo, useState } from "react";
import BrandAnalysisCard from "./BrandAnalysisCard";
import SuggestionCard from "./SuggestionCard";

export default function AIResults({ result, loading, thinkingSteps, activeStep }) {
  const [typedSummary, setTypedSummary] = useState("");

  useEffect(() => {
    if (!result?.summary) {
      setTypedSummary("");
      return;
    }

    let index = 0;
    setTypedSummary("");

    const timer = setInterval(() => {
      index += 1;
      setTypedSummary(result.summary.slice(0, index));
      if (index >= result.summary.length) {
        clearInterval(timer);
      }
    }, 14);

    return () => clearInterval(timer);
  }, [result?.summary]);

  const scoreAccent = useMemo(() => {
    if (!result?.uniquenessScore) return "text-ink";
    return result.uniquenessScore >= 80 ? "text-success" : result.uniquenessScore >= 60 ? "text-sky-600" : "text-amber-600";
  }, [result?.uniquenessScore]);

  if (loading) {
    return (
      <section className="mx-auto mt-8 w-full max-w-5xl">
        <div className="card p-5">
          <h3 className="text-base font-semibold text-ink">AI Processing</h3>
          <div className="mt-4 space-y-2">
            {thinkingSteps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    idx <= activeStep ? "bg-sky-500 animate-pulse" : "bg-slate-300"
                  }`}
                />
                <p className={`text-sm ${idx <= activeStep ? "text-slate-800" : "text-slate-500"}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <BrandAnalysisCard
          icon="🎯"
          title="Uniqueness Score"
          value={`${result.uniquenessScore}%`}
          accent={scoreAccent}
          description="AI estimate of how distinct your brand appears in the market landscape."
        />

        <BrandAnalysisCard
          icon="🔎"
          title="Similar Brands"
          description="Closest naming patterns that may overlap with your idea."
          items={result.similarBrands}
        />

        <BrandAnalysisCard
          icon="🏭"
          title="Industry Match"
          value={result.industryMatch}
          description="How naturally this name aligns with category expectations."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SuggestionCard
          icon="💡"
          title="Suggested Alternatives"
          description="Safer options with stronger uniqueness potential."
          suggestions={result.alternativeNames}
        />

        <SuggestionCard
          icon="✨"
          title="Creative Variations"
          description="Naming styles generated for broader branding exploration."
          suggestions={result.creativeVariations}
        />

        <SuggestionCard
          icon="🌐"
          title="Domain Suggestions"
          description="Potential domain directions to check availability quickly."
          suggestions={result.domainSuggestions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BrandAnalysisCard icon="📊" title="Target Industry" value={result.targetIndustry} description="Primary market category inferred from your brand idea." />
        <BrandAnalysisCard icon="🧠" title="Brand Personality" value={result.brandPersonality} description="Tone and perceived personality traits associated with the name." />
        <BrandAnalysisCard icon="📍" title="Market Positioning" value={result.marketPositioning} description="Suggested positioning angle for launch and messaging." />
      </div>

      <div className="card p-5">
        <h3 className="text-base font-semibold text-ink">AI Summary</h3>
        <p className="mt-3 min-h-16 whitespace-pre-wrap text-sm text-slate-700">{typedSummary}</p>
      </div>
    </section>
  );
}
