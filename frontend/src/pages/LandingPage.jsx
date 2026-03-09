import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-6 inline-flex w-fit items-center rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs uppercase tracking-widest text-slate-600 shadow-card">
        AI Brand Assistant Platform
      </div>

      <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        Minimal SaaS frontend generated from your backend routes.
      </h1>

      <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
        This UI is mapped to your live APIs: `/`, `/health`, `/models/status`, and `/chat`. Missing auth and verification
        routes are scaffolded with placeholder services for safe future integration.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/dashboard" className="btn-primary">
          Open Dashboard
        </Link>
        <Link to="/login" className="btn-secondary">
          Login (Placeholder)
        </Link>
        <Link to="/signup" className="btn-secondary">
          Signup (Placeholder)
        </Link>
      </div>
    </div>
  );
}
