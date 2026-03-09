export default function SuggestionCard({ icon, title, description, suggestions = [] }) {
  return (
    <article className="card fade-in-up p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <p className="text-2xl" aria-hidden>{icon}</p>
      <h3 className="mt-2 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((entry) => (
          <span key={entry} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            {entry}
          </span>
        ))}
      </div>
    </article>
  );
}
