export default function TaglineCard({
  tagline,
  copied,
  favorite,
  rating,
  regenerating,
  onCopy,
  onFavorite,
  onRate,
  onRegenerate
}) {
  return (
    <article className="card fade-in-up p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <h3 className="text-lg font-semibold tracking-tight text-ink">{tagline}</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => onCopy(tagline)}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => onFavorite(tagline)}>
          {favorite ? "Favorited" : "Favorite"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => onRegenerate(tagline)} disabled={regenerating}>
          {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <span>Rate:</span>
        <button
          type="button"
          className={`rounded-full px-2 py-1 ${rating === "like" ? "bg-green-100 text-green-700" : "bg-slate-100"}`}
          onClick={() => onRate(tagline, rating === "like" ? null : "like")}
        >
          👍
        </button>
        <button
          type="button"
          className={`rounded-full px-2 py-1 ${rating === "dislike" ? "bg-red-100 text-red-700" : "bg-slate-100"}`}
          onClick={() => onRate(tagline, rating === "dislike" ? null : "dislike")}
        >
          👎
        </button>
      </div>
    </article>
  );
}
