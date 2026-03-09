import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/75 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Workspace</div>
          <h1 className="text-lg font-semibold text-ink">{pathname.replace("/", "") || "landing"}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn-secondary">Landing</Link>
          <Link to="/dashboard" className="btn-primary">Open App</Link>
        </div>
      </div>
    </header>
  );
}
