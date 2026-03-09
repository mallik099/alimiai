const industries = [
  "Technology",
  "Food",
  "Fashion",
  "Health",
  "Education",
  "Finance",
  "Other"
];

export default function IndustrySelector({ value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </div>
  );
}
