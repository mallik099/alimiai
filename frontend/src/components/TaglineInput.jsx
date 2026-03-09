export default function TaglineInput({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Brand Description</label>
      <textarea
        className="input min-h-32"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe your brand idea...&#10;Example: A technology startup that builds AI tools to help students learn faster."
        maxLength={500}
      />
    </div>
  );
}
