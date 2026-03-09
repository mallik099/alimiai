import { useEffect, useMemo, useState } from "react";
import AIResults from "../components/AIResults";
import SearchInput from "../components/SearchInput";
import TopNavbar from "../components/TopNavbar";
import { sendChat } from "../services/backendService";

const thinkingSteps = [
  "Analyzing brand uniqueness...",
  "Checking similarity with existing brands...",
  "Generating brand insights..."
];

function titleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function extractJsonObject(input) {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  try {
    return JSON.parse(input.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackInsights(brandIdea, rawSummary = "") {
  const cleaned = brandIdea.trim() || "Brand Idea";
  const base = cleaned.replace(/\s+/g, "");
  const short = base.slice(0, 6) || "Brand";

  return {
    uniquenessScore: 82,
    similarBrands: [`${titleCase(short)} AI`, `Nova${titleCase(short)}`, `${titleCase(short)} Labs`],
    industryMatch: "Strong",
    alternativeNames: [`${titleCase(short)}Nexa`, `${titleCase(short)}Verse`, `Neo${titleCase(short)}`],
    creativeVariations: [`${titleCase(short)}Flow`, `${titleCase(short)}Forge`, `${titleCase(short)}ly`],
    domainSuggestions: [
      `${base.toLowerCase()}.com`,
      `${base.toLowerCase()}.ai`,
      `get${base.toLowerCase()}.com`
    ],
    targetIndustry: "Technology / Digital Products",
    brandPersonality: "Modern, innovative, reliable",
    marketPositioning: "AI-first challenger brand",
    summary: rawSummary || `The brand idea ${cleaned} has strong modern appeal with good flexibility across digital product categories.`
  };
}

function normalizeInsights(brandIdea, payload) {
  if (!payload || typeof payload !== "object") {
    return fallbackInsights(brandIdea);
  }

  const safeList = (value, fallback) => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map((entry) => String(entry).trim()).filter(Boolean).slice(0, 4);
    }
    return fallback;
  };

  const fallback = fallbackInsights(brandIdea, payload.summary || "");

  return {
    uniquenessScore: Number(payload.uniquenessScore) || fallback.uniquenessScore,
    similarBrands: safeList(payload.similarBrands, fallback.similarBrands),
    industryMatch: String(payload.industryMatch || fallback.industryMatch),
    alternativeNames: safeList(payload.alternativeNames, fallback.alternativeNames),
    creativeVariations: safeList(payload.creativeVariations, fallback.creativeVariations),
    domainSuggestions: safeList(payload.domainSuggestions, fallback.domainSuggestions),
    targetIndustry: String(payload.targetIndustry || fallback.targetIndustry),
    brandPersonality: String(payload.brandPersonality || fallback.brandPersonality),
    marketPositioning: String(payload.marketPositioning || fallback.marketPositioning),
    summary: String(payload.summary || fallback.summary)
  };
}

export default function BrandSearchPage() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canAnalyze = useMemo(() => idea.trim().length > 0 && !loading, [idea, loading]);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % thinkingSteps.length);
    }, 950);
    return () => clearInterval(timer);
  }, [loading]);

  const analyzeIdea = async (event) => {
    event.preventDefault();
    const brandIdea = idea.trim();
    if (!brandIdea || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setActiveStep(0);

    const prompt = `Analyze the brand idea \"${brandIdea}\".
Return STRICT JSON only using this schema:
{
  "uniquenessScore": number,
  "similarBrands": string[],
  "industryMatch": "Strong|Moderate|Weak",
  "alternativeNames": string[],
  "creativeVariations": string[],
  "domainSuggestions": string[],
  "targetIndustry": string,
  "brandPersonality": string,
  "marketPositioning": string,
  "summary": string
}
Keep suggestions practical and concise.`;

    try {
      const response = await sendChat(prompt, true, { retries: 1 });
      const raw = response?.response || "";
      const parsed = extractJsonObject(raw);
      setResult(normalizeInsights(brandIdea, parsed || { summary: raw }));
    } catch (err) {
      setError(err.message || "Unable to analyze this brand idea right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="search" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="text-center fade-in-up">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Check Your Brand Idea with AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Use AI to analyze brand names, check uniqueness, and generate insights.
          </p>
        </section>

        <SearchInput value={idea} onChange={setIdea} onSubmit={analyzeIdea} loading={loading} />

        {!canAnalyze && !loading && !result ? (
          <p className="mt-4 text-center text-sm text-slate-500">Enter a brand idea to start AI analysis.</p>
        ) : null}

        {error ? (
          <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <AIResults result={result} loading={loading} thinkingSteps={thinkingSteps} activeStep={activeStep} />
      </main>
    </div>
  );
}
