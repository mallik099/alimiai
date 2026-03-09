const options = ["Minimal", "Futuristic", "Luxury", "Playful", "Corporate"];

export default function StyleSelector({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Logo Style</label>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </select>
    </div>
  );
}
