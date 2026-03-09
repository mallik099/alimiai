export function AvailabilityIndicator({ status }) {
  const config =
    status === "available"
      ? { dot: "bg-green-500", text: "Available", tone: "text-green-700" }
      : status === "taken"
      ? { dot: "bg-red-500", text: "Taken", tone: "text-red-700" }
      : { dot: "bg-slate-400", text: "Unknown", tone: "text-slate-600" };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.tone}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.text}
    </span>
  );
}
