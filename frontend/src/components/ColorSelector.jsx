const options = ["Blue Tech", "Black Luxury", "Green Eco", "Vibrant Startup", "Custom"];

export default function ColorSelector({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Color Palette</label>
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
