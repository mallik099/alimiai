const defaults = ["TechNova", "GreenNest", "FoodLoop"];

export default function SearchInput({ value, onChange, onSubmit, loading, suggestions = defaults }) {
  return (
    <section className="mx-auto mt-10 w-full max-w-3xl text-center">
      <div className="card p-6 sm:p-8 shadow-soft">
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Enter your brand idea..."
            maxLength={120}
          />
          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading || !value.trim()}>
            {loading ? "Analyzing..." : "Analyze Brand"}
          </button>
        </form>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Try examples</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
