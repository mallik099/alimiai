import { useEffect, useMemo, useState } from "react";
import GenerateButton from "../components/GenerateButton";
import IdeaInput from "../components/IdeaInput";
import IndustrySelector from "../components/IndustrySelector";
import ResultsGrid from "../components/ResultsGrid";
import ToneSelector from "../components/ToneSelector";
import TopNavbar from "../components/TopNavbar";
import { getApiBaseUrl } from "../services/apiClient";
import { sendChat } from "../services/backendService";

const thinkingSteps = [
  "Analyzing your idea...",
  "Generating creative brand names...",
  "Checking uniqueness..."
];

function extractJsonObject(input) {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(input.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackNames(idea, industry, tone, count = 3) {
  const cleaned = idea.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  const seed = (cleaned.split(/\s+/)[0] || industry || "Brand").slice(0, 6);
  const root = seed.charAt(0).toUpperCase() + seed.slice(1).toLowerCase();

  const templates = [
    `${root}Nova`,
    `${root}Nest`,
    `${root}Forge`,
    `${root}Flow`,
    `${root}Verse`,
    `${root}Nexa`,
    `${root}Pilot`
  ];

  return templates.slice(0, count).map((name) => ({
    name,
    meaning: `A ${tone.toLowerCase()} brand identity for ${industry.toLowerCase()} audiences.`,
    industryFit: industry
  }));
}

function normalizePayload(payload, idea, industry, tone, count) {
  const fallback = fallbackNames(idea, industry, tone, count);
  const entries = Array.isArray(payload?.names)
    ? payload.names
        .map((item) => ({
          name: String(item?.name || "").trim(),
          meaning: String(item?.meaning || "").trim(),
          industryFit: String(item?.industryFit || industry).trim()
        }))
        .filter((item) => item.name)
    : [];

  return {
    names: entries.length ? entries.slice(0, count) : fallback,
    summary:
      String(payload?.summary || "").trim() ||
      `Generated ${count} ${tone.toLowerCase()} brand-name options tailored to ${industry.toLowerCase()} needs for the idea: ${idea}.`
  };
}

export default function BrandStudioPage() {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [tone, setTone] = useState("Modern");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copiedName, setCopiedName] = useState("");
  const [logoLoadingByName, setLogoLoadingByName] = useState({});
  const [lastCount, setLastCount] = useState(3);

  const canGenerate = useMemo(() => idea.trim().length > 0 && !loading, [idea, loading]);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % thinkingSteps.length);
    }, 900);
    return () => clearInterval(timer);
  }, [loading]);

  const generateNames = async (count = 3) => {
    if (!idea.trim() || loading) return;

    setLoading(true);
    setError("");
    setActiveStep(0);

    const prompt = `You are a brand naming AI assistant.
Business idea: ${idea.trim()}
Industry: ${industry}
Tone: ${tone}
Generate ${count} unique brand names.
Return STRICT JSON only:
{
  "names": [
    {"name": "", "meaning": "", "industryFit": ""}
  ],
  "summary": ""
}`;

    try {
      const response = await sendChat(prompt, true, { retries: 1 });
      const raw = response?.response || "";
      const parsed = extractJsonObject(raw);
      const normalized = normalizePayload(parsed, idea.trim(), industry, tone, count);
      setResults(normalized.names);
      setSummary(normalized.summary);
      setLastCount(count);
    } catch (err) {
      setError(err.message || "Unable to generate brand names right now.");
      const fallback = fallbackNames(idea.trim(), industry, tone, count);
      setResults(fallback);
      setSummary(`Fallback mode: generated ${count} options locally due to API error.`);
      setLastCount(count);
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async (name) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(""), 1200);
    } catch {
      setError("Clipboard copy failed. Please copy manually.");
    }
  };

  const onFavorite = (name) => {
    setFavorites((prev) => (prev.includes(name) ? prev.filter((entry) => entry !== name) : [...prev, name]));
  };

  const onCheckAvailability = (name) => {
    const query = encodeURIComponent(`${name} brand name availability`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank", "noopener,noreferrer");
  };

  const onGenerateLogo = async (name) => {
    setLogoLoadingByName((prev) => ({ ...prev, [name]: true }));
    setError("");

    try {
      const response = await sendChat(
        `Create a logo for ${name}. Industry: ${industry}. Tone: ${tone}. Keep it clean and brandable.`,
        true,
        { retries: 1 }
      );
      if (response?.image_url) {
        const url = `${getApiBaseUrl()}${response.image_url}`;
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setError("Logo generation did not return an image this time. Try again.");
      }
    } catch (err) {
      setError(err.message || "Logo generation failed.");
    } finally {
      setLogoLoadingByName((prev) => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="generator" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="text-center fade-in-up">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Generate Your Brand Name with AI</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Describe your idea and let AI create unique brand names.
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-4xl">
          <div className="card p-6 sm:p-8 shadow-soft">
            <div className="grid gap-4">
              <IdeaInput value={idea} onChange={setIdea} />

              <div className="grid gap-4 sm:grid-cols-2">
                <IndustrySelector value={industry} onChange={setIndustry} />
                <ToneSelector value={tone} onChange={setTone} />
              </div>

              <GenerateButton loading={loading} onClick={() => generateNames(3)} disabled={!canGenerate} />
            </div>
          </div>
        </section>

        {loading ? (
          <section className="mx-auto mt-6 w-full max-w-4xl">
            <div className="card p-5">
              <h3 className="text-base font-semibold text-ink">AI Processing</h3>
              <div className="mt-4 space-y-2">
                {thinkingSteps.map((step, idx) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${idx <= activeStep ? "bg-sky-500 animate-pulse" : "bg-slate-300"}`} />
                    <p className={`text-sm ${idx <= activeStep ? "text-slate-800" : "text-slate-500"}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {error ? (
          <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <ResultsGrid
          results={results}
          summary={summary}
          favorites={favorites}
          copiedName={copiedName}
          logoLoadingByName={logoLoadingByName}
          onCopy={onCopy}
          onFavorite={onFavorite}
          onCheckAvailability={onCheckAvailability}
          onGenerateLogo={onGenerateLogo}
          onRegenerate={() => generateNames(lastCount)}
          onGenerateMore={() => generateNames(Math.min(lastCount + 3, 12))}
          loading={loading}
        />
      </main>
    </div>
  );
}
