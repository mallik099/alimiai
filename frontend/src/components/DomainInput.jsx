export default function DomainInput({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter your brand name..."
        maxLength={80}
      />
      <button type="submit" className="btn-primary w-full" disabled={!value.trim() || loading}>
        {loading ? "Generating..." : "Generate Domains"}
      </button>
    </form>
  );
}
