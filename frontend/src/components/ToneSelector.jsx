const defaultTones = ["Modern", "Futuristic", "Professional", "Creative", "Luxury", "Minimal"];

export default function ToneSelector({ value, onChange, options = defaultTones }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Tone</label>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </select>
    </div>
  );
}
