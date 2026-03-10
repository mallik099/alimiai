import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";

const items = [
  { to: "/", label: "Home", key: "home" },
  { to: "/ai-brand-generator", label: "AI Brand Generator", key: "generator" },
  { to: "/ai-tagline", label: "AI Tagline", key: "tagline" },
  { to: "/ai-logo", label: "AI Logo", key: "logo" },
  { to: "/ai-voice", label: "AI Voice", key: "voice" },
  { to: "/brand-search", label: "Brand Search", key: "search" },
  { to: "/ai-domain", label: "AI Domain", key: "domain" },
  { to: "/about", label: "About Us", key: "about" }
];

export default function TopNavbar({ active = "home", showActions = false }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="transition hover:opacity-90">
          <AppLogo className="h-8 w-8" withLabel animated={active === "home"} />
        </Link>

        <nav className="hidden items-center gap-2 text-sm md:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`rounded-full px-3 py-1.5 transition ${
                active === item.key
                  ? "bg-ink text-white shadow-card"
                  : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showActions ? (
            <>
              <Link to="/ai-brand-generator" className="btn-primary hidden md:inline-flex">
                Get Started
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
