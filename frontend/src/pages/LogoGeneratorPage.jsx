import { useEffect, useMemo, useState } from "react";
import ColorSelector from "../components/ColorSelector";
import GenerateButton from "../components/GenerateButton";
import LogoGrid from "../components/LogoGrid";
import LogoInput from "../components/LogoInput";
import StyleSelector from "../components/StyleSelector";
import TopNavbar from "../components/TopNavbar";
import { getApiBaseUrl } from "../services/apiClient";
import { sendChat } from "../services/backendService";

const thinkingSteps = [
  "Analyzing brand identity...",
  "Designing logo concepts...",
  "Generating visual styles..."
];

const styleOptions = ["Minimal", "Futuristic", "Luxury", "Playful", "Corporate"];

function styleVariants(selected) {
  const others = styleOptions.filter((entry) => entry !== selected);
  return [selected, ...others.slice(0, 2)];
}

function paletteColor(palette) {
  const map = {
    "Blue Tech": "#2563eb",
    "Black Luxury": "#111827",
    "Green Eco": "#16a34a",
    "Vibrant Startup": "#f97316",
    Custom: "#334155"
  };
  return map[palette] || "#334155";
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function LogoGeneratorPage() {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [style, setStyle] = useState("Minimal");
  const [palette, setPalette] = useState("Blue Tech");

  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copyingId, setCopyingId] = useState("");
  const [regeneratingId, setRegeneratingId] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const canGenerate = useMemo(
    () => brandName.trim().length > 0 && description.trim().length > 0 && !loading,
    [brandName, description, loading]
  );

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % thinkingSteps.length);
    }, 900);
    return () => clearInterval(timer);
  }, [loading]);

  const generateOne = async (styleName) => {
    const prompt = `Create a logo for ${brandName.trim()}.
Brand description: ${description.trim()}
Industry: ${industry}
Logo style: ${styleName}
Color palette: ${palette}
Return image output suitable for branding.`;

    const response = await sendChat(prompt, true, { retries: 1 });
    const imageUrl = response?.image_url ? `${getApiBaseUrl()}${response.image_url}` : "";

    return {
      id: crypto.randomUUID(),
      brandName: brandName.trim(),
      style: styleName,
      palette,
      imageUrl
    };
  };

  const generateAll = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setError("");

    try {
      const variants = styleVariants(style);
      const next = [];
      for (const variant of variants) {
        const item = await generateOne(variant);
        next.push(item);
      }
      setItems(next);
    } catch (err) {
      setError(err.message || "Failed to generate logo concepts.");
    } finally {
      setLoading(false);
    }
  };

  const onRegenerateOne = async (item) => {
    setRegeneratingId(item.id);
    setError("");

    try {
      const next = await generateOne(item.style);
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...next, id: item.id } : entry)));
    } catch (err) {
      setError(err.message || "Failed to regenerate logo.");
    } finally {
      setRegeneratingId("");
    }
  };

  const onFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const onDownloadPng = async (item) => {
    if (!item.imageUrl) {
      setError("No PNG available for this logo.");
      return;
    }

    const filename = `${item.brandName.replace(/\s+/g, "_")}_${item.style.toLowerCase()}.png`;
    const anchor = document.createElement("a");
    anchor.href = item.imageUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const onDownloadSvg = (item) => {
    const color = paletteColor(item.palette);
    const brand = item.brandName || "Alkimi AI";
    const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\"><rect width=\"512\" height=\"512\" rx=\"72\" fill=\"#ffffff\"/><path d=\"M250 66c14 0 26 7 33 19l140 240c14 24-4 53-32 53h-81v-90c0-30-24-54-54-54s-54 24-54 54v90h-81c-28 0-46-29-32-53l140-240c7-12 19-19 33-19z\" fill=\"${color}\"/><circle cx=\"256\" cy=\"170\" r=\"44\" fill=\"#ffffff\"/><text x=\"50%\" y=\"450\" text-anchor=\"middle\" font-family=\"Segoe UI, Arial\" font-size=\"36\" fill=\"#111827\">${brand}</text></svg>`;
    const filename = `${brand.replace(/\s+/g, "_")}_${item.style.toLowerCase()}.svg`;
    downloadBlob(filename, svg, "image/svg+xml;charset=utf-8");
  };

  const onCopyImage = async (item) => {
    if (!item.imageUrl) {
      setError("No image available to copy.");
      return;
    }

    if (!navigator.clipboard || !window.ClipboardItem) {
      setError("Clipboard image copy is not supported in this browser.");
      return;
    }

    setCopyingId(item.id);
    setError("");

    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setToast("Image copied to clipboard");
      setTimeout(() => setToast(""), 1200);
    } catch {
      setError("Failed to copy image.");
    } finally {
      setCopyingId("");
    }
  };

  return (
    <div className="page-atmosphere min-h-screen bg-white">
      <TopNavbar active="logo" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <section className="text-center fade-in-up">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">AI Logo Generator</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Describe your brand and generate unique logo ideas using AI.
          </p>
        </section>

        <section className="mx-auto mt-8 w-full max-w-4xl">
          <div className="card p-6 shadow-soft sm:p-8">
            <div className="grid gap-4">
              <LogoInput
                brandName={brandName}
                description={description}
                industry={industry}
                onBrandNameChange={setBrandName}
                onDescriptionChange={setDescription}
                onIndustryChange={setIndustry}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <StyleSelector value={style} onChange={setStyle} />
                <ColorSelector value={palette} onChange={setPalette} />
              </div>

              <GenerateButton loading={loading} onClick={generateAll} disabled={!canGenerate} label="Generate Logos" />
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

        {toast ? (
          <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {toast}
          </div>
        ) : null}

        <LogoGrid
          items={items}
          favorites={favorites}
          copyingId={copyingId}
          regeneratingId={regeneratingId}
          onFavorite={onFavorite}
          onCopyImage={onCopyImage}
          onDownloadPng={onDownloadPng}
          onDownloadSvg={onDownloadSvg}
          onRegenerate={onRegenerateOne}
          onRegenerateAll={generateAll}
          loading={loading}
        />
      </main>
    </div>
  );
}
