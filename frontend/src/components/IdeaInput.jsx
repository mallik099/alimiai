export default function IdeaInput({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Business Idea</label>
      <textarea
        className="input min-h-28"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe your startup idea..."
        maxLength={400}
      />
    </div>
  );
}
