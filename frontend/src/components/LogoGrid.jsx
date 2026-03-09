import LogoCard from "./LogoCard";

export default function LogoGrid({
  items,
  favorites,
  copyingId,
  regeneratingId,
  onFavorite,
  onCopyImage,
  onDownloadPng,
  onDownloadSvg,
  onRegenerate,
  onRegenerateAll,
  loading
}) {
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-ink">Logo Concepts</h2>
        <button type="button" className="btn-primary" onClick={onRegenerateAll} disabled={loading}>
          {loading ? "Generating..." : "Regenerate Logos"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <LogoCard
            key={item.id}
            item={item}
            favorite={favorites.includes(item.id)}
            copying={copyingId === item.id}
            regenerating={regeneratingId === item.id}
            onFavorite={onFavorite}
            onCopyImage={onCopyImage}
            onDownloadPng={onDownloadPng}
            onDownloadSvg={onDownloadSvg}
            onRegenerate={onRegenerate}
          />
        ))}
      </div>
    </section>
  );
}
