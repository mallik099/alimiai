export default function BrandAnalysisCard({ icon, title, value, description, items = [], accent = "text-ink" }) {
  return (
    <article className="card fade-in-up p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl" aria-hidden>{icon}</p>
          <h3 className="mt-2 text-base font-semibold text-ink">{title}</h3>
        </div>
        {value ? <p className={`text-2xl font-semibold ${accent}`}>{value}</p> : null}
      </div>

      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}

      {items.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-2 py-1">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
