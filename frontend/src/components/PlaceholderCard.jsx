export default function PlaceholderCard({ title, description }) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Backend route missing. Service stub is ready in `src/services`.
      </div>
    </div>
  );
}
