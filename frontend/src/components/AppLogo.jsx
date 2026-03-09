export default function AppLogo({ className = "h-8 w-8", withLabel = true, animated = false }) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 120 120"
        className={`${className} ${animated ? "alkimi-logo-animated" : ""}`}
        role="img"
        aria-label="Alkimi AI logo"
      >
        <defs>
          <linearGradient id="alkimiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#111318" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
        <path
          d="M59 12c4 0 8 2 10 6l40 69c4 7-1 15-9 15H77V76c0-9-8-17-17-17s-17 8-17 17v26H20c-8 0-13-8-9-15l40-69c2-4 6-6 10-6z"
          fill="url(#alkimiGrad)"
        />
        <circle cx="60" cy="46" r="13" fill="#ffffff" />
      </svg>
      {withLabel ? <span className="text-lg font-semibold tracking-tight text-ink">Alkimi AI</span> : null}
    </div>
  );
}
