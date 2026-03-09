export default function StatCard({ title, value, hint, tone = "default" }) {
  const toneClass =
    tone === "good"
      ? "text-success"
      : tone === "bad"
      ? "text-danger"
      : "text-ink";

  return (
    <div className="card p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</div>
      {hint ? <div className="mt-2 text-sm text-slate-500">{hint}</div> : null}
    </div>
  );
}
