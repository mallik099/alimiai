import { AvailabilityIndicator } from "./AvailabilityIndicator";

export default function DomainCard({ item, onCopy, onCheck, checking }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-card transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">{item.name}</p>
        <AvailabilityIndicator status={item.status} />
      </div>
      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-secondary" onClick={() => onCopy(item.name)}>
          Copy
        </button>
        <button type="button" className="btn-secondary" onClick={() => onCheck(item.name)} disabled={checking}>
          {checking ? "Checking..." : "Check Availability"}
        </button>
      </div>
    </article>
  );
}
