const industries = ["Technology", "Food", "Fashion", "Finance", "Education", "Health", "Other"];

export default function LogoInput({
  brandName,
  description,
  industry,
  onBrandNameChange,
  onDescriptionChange,
  onIndustryChange
}) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Brand Name</label>
        <input
          className="input"
          value={brandName}
          onChange={(event) => onBrandNameChange(event.target.value)}
          placeholder="Enter your brand name"
          maxLength={80}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Brand Description</label>
        <textarea
          className="input min-h-28"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Describe your brand. Example: A futuristic AI company that builds smart productivity tools."
          maxLength={500}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
        <select className="input" value={industry} onChange={(event) => onIndustryChange(event.target.value)}>
          {industries.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
