export default function LogoCard({
  item,
  favorite,
  copying,
  regenerating,
  onFavorite,
  onCopyImage,
  onDownloadPng,
  onDownloadSvg,
  onRegenerate
}) {
  return (
    <article className="card fade-in-up p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={`${item.brandName} ${item.style} logo`} className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-slate-500">No preview available</div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink">{item.brandName}</h3>
          <p className="text-xs uppercase tracking-wide text-slate-500">{item.style} style</p>
        </div>
        <button
          type="button"
          onClick={() => onFavorite(item.id)}
          className={`rounded-full px-2 py-1 text-xs ${favorite ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}
        >
          {favorite ? "Saved" : "Favorite"}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className="btn-secondary" onClick={() => onDownloadPng(item)}>
          Download PNG
        </button>
        <button type="button" className="btn-secondary" onClick={() => onDownloadSvg(item)}>
          Download SVG
        </button>
        <button type="button" className="btn-secondary" onClick={() => onCopyImage(item)} disabled={copying}>
          {copying ? "Copying..." : "Copy Image"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => onRegenerate(item)} disabled={regenerating}>
          {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </article>
  );
}
