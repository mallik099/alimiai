import TaglineCard from "./TaglineCard";

export default function TaglineResultsGrid({
  taglines,
  copiedTagline,
  favorites,
  ratings,
  regeneratingTagline,
  loading,
  onCopy,
  onFavorite,
  onRate,
  onRegenerate,
  onGenerateMore,
  onCopyAll
}) {
  if (!taglines.length) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-ink">Generated Taglines</h2>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={onCopyAll}>
            Copy All
          </button>
          <button type="button" className="btn-primary" onClick={onGenerateMore} disabled={loading}>
            {loading ? "Generating..." : "Generate More"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taglines.map((tagline) => (
          <TaglineCard
            key={tagline}
            tagline={tagline}
            copied={copiedTagline === tagline}
            favorite={favorites.includes(tagline)}
            rating={ratings[tagline] || null}
            regenerating={regeneratingTagline === tagline}
            onCopy={onCopy}
            onFavorite={onFavorite}
            onRate={onRate}
            onRegenerate={onRegenerate}
          />
        ))}
      </div>
    </section>
  );
}
