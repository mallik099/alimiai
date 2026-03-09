import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/brand-studio", label: "Brand Studio" },
  { to: "/analytics", label: "Analytics" },
  { to: "/brand-verification", label: "Brand Verification" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" }
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/70 p-5 backdrop-blur lg:block">
      <div className="mb-8 rounded-xl2 bg-ink px-4 py-3 text-white shadow-soft">
        <div className="text-xs uppercase tracking-widest text-slate-300">Alkimi AI</div>
        <div className="text-lg font-semibold">Brand OS</div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-ink text-white shadow-card" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
