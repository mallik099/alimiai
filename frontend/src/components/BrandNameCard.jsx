export default function BrandNameCard({
  entry,
  copied,
  isFavorite,
  logoGenerating,
  onCopy,
  onFavorite,
  onCheckAvailability,
  onGenerateLogo
}) {
  return (
    <article className="card fade-in-up p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{entry.name}</h3>
        <button
          type="button"
          onClick={() => onFavorite(entry.name)}
          className={`rounded-full px-2 py-1 text-sm ${isFavorite ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}
        >
          {isFavorite ? "Saved" : "Favorite"}
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-600">{entry.meaning}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Industry Fit: {entry.industryFit}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => onCopy(entry.name)}>
          {copied ? "Copied" : "Copy Name"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => onCheckAvailability(entry.name)}>
          Check Availability
        </button>
        <button type="button" className="btn-secondary" onClick={() => onGenerateLogo(entry.name)} disabled={logoGenerating}>
          {logoGenerating ? "Generating..." : "Generate Logo"}
        </button>
      </div>
    </article>
  );
}
