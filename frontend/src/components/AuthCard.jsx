export default function AuthCard({ title, subtitle, children }) {
  return (
    <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100 transition-all duration-300">
      <h1 className="text-center text-2xl font-semibold text-ink">{title}</h1>
      {subtitle ? <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
