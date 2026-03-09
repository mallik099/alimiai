import { useEffect, useMemo, useState } from "react";
import GenerateButton from "../components/GenerateButton";
import TaglineInput from "../components/TaglineInput";
import TaglineResultsGrid from "../components/TaglineResultsGrid";
import ToneSelector from "../components/ToneSelector";
import TopNavbar from "../components/TopNavbar";
import { sendChat } from "../services/backendService";

const industries = ["Technology", "Food", "Fashion", "Health", "Education", "Finance", "Other"];
const toneOptions = ["Professional", "Creative", "Luxury", "Playful", "Futuristic"];
const thinkingSteps = ["Analyzing your brand idea...", "Generating creative taglines..."];

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

function fallbackTaglines(brandName, industry, tone, count) {
  const base = brandName?.trim() || "Your Brand";
  const templates = [
    `${base}: Smarter Ideas, Stronger Impact`,
    `Built for ${industry} with ${tone.toLowerCase()} AI power`,
    `${base} - Innovation that feels effortless`,
    `Where ${industry} meets intelligent creativity`,
    `${base}: Turn vision into momentum`
  ];
  return templates.slice(0, count);
}

function normalizeTaglines(raw, brandName, industry, tone, count) {
  const fallback = fallbackTaglines(brandName, industry, tone, count);

  if (!raw) return fallback;

  if (Array.isArray(raw.taglines) && raw.taglines.length) {
    const clean = raw.taglines
      .map((entry) => String(entry).trim().replace(/^[-\d.)\s]+/, ""))
      .filter(Boolean);
    return (clean.length ? clean : fallback).slice(0, count);
  }

  return fallback;
}

export default function TaglineGeneratorPage() {
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [tone, setTone] = useState("Professional");

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [taglines, setTaglines] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [copiedTagline, setCopiedTagline] = useState("");
  const [regeneratingTagline, setRegeneratingTagline] = useState("");
  const [lastCount, setLastCount] = useState(3);

  const canGenerate = useMemo(() => description.trim().length > 0 && !loading, [description, loading]);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % thinkingSteps.length);
    }, 900);
    return () => clearInterval(timer);
  }, [loading]);

  const generateTaglines = async (count = 3) => {
    if (!description.trim() || loading) return;

    setLoading(true);
    setError("");
    setActiveStep(0);

    const prompt = `You are an expert brand copywriter.
Brand description: ${description.trim()}
Brand name: ${brandName || "Not specified"}
Industry: ${industry}
Tone: ${tone}
Generate ${count} powerful tagline suggestions.
Return STRICT JSON only:
{
  "taglines": ["...", "..."],
  "note": "short optional note"
}`;

    try {
      const response = await sendChat(prompt, true, { retries: 1 });
      const rawText = response?.response || "";
      const parsed = extractJsonObject(rawText);
      const nextTaglines = normalizeTaglines(parsed, brandName, industry, tone, count);
      setTaglines(nextTaglines);
      setLastCount(count);
    } catch (err) {
      setError(err.message || "Unable to generate taglines right now.");
      const fallback = fallbackTaglines(brandName, industry, tone, count);
      setTaglines(fallback);
      setLastCount(count);
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async (tagline) => {
    try {
      await navigator.clipboard.writeText(tagline);
      setCopiedTagline(tagline);
      setTimeout(() => setCopiedTagline(""), 1200);
    } catch {
      setError("Copy failed.");
    }
  };

  const onFavorite = (tagline) => {
    setFavorites((prev) => (prev.includes(tagline) ? prev.filter((entry) => entry !== tagline) : [...prev, tagline]));
  };

  const onRate = (tagline, value) => {
    setRatings((prev) => ({ ...prev, [tagline]: value }));
  };

  const onRegenerate = async (tagline) => {
    setRegeneratingTagline(tagline);
    setError("");

    const prompt = `Regenerate one improved tagline based on this tagline: "${tagline}".
Keep same brand context:
Description: ${description.trim()}
Brand name: ${brandName || "Not specified"}
Industry: ${industry}
Tone: ${tone}
Return plain text only (one line).`;

    try {
      const response = await sendChat(prompt, true, { retries: 1 });
      const next = (response?.response || "").split("\n")[0].replace(/^[-\d.)\s]+/, "").trim();
      if (next) {
        setTaglines((prev) => prev.map((entry) => (entry === tagline ? next : entry)));
      }
    } catch (err) {
      setError(err.message || "Failed to regenerate tagline.");
    } finally {
      setRegeneratingTagline("");
    }
  };

  const onCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(taglines.join("\n"));
      setCopiedTagline("ALL");
      setTimeout(() => setCopiedTagline(""), 1200);
    } catch {
      setError("Copy all failed.");
    }
  };

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="tagline" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="text-center fade-in-up">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">AI Tagline Generator</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Describe your brand and let AI generate powerful taglines.
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-4xl">
          <div className="card p-6 shadow-soft sm:p-8">
            <div className="grid gap-4">
              <TaglineInput value={description} onChange={setDescription} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Brand Name (optional)</label>
                  <input
                    className="input"
                    value={brandName}
                    onChange={(event) => setBrandName(event.target.value)}
                    placeholder="Enter brand name"
                    maxLength={80}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
                  <select className="input" value={industry} onChange={(event) => setIndustry(event.target.value)}>
                    {industries.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ToneSelector value={tone} onChange={setTone} options={toneOptions} />

              <GenerateButton loading={loading} onClick={() => generateTaglines(3)} disabled={!canGenerate} label="Generate Taglines" />
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

        {copiedTagline === "ALL" ? (
          <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            All taglines copied.
          </div>
        ) : null}

        <TaglineResultsGrid
          taglines={taglines}
          copiedTagline={copiedTagline}
          favorites={favorites}
          ratings={ratings}
          regeneratingTagline={regeneratingTagline}
          loading={loading}
          onCopy={onCopy}
          onFavorite={onFavorite}
          onRate={onRate}
          onRegenerate={onRegenerate}
          onGenerateMore={() => generateTaglines(Math.min(lastCount + 3, 12))}
          onCopyAll={onCopyAll}
        />
      </main>
    </div>
  );
}
