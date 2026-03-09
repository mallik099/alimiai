import { useState } from "react";
import DomainPanel from "./DomainPanel";

export default function DomainSuggestionButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="btn-secondary rounded-full px-3 py-1.5"
      >
        <span className="mr-1" aria-hidden>🌐</span>
        AI Domain
      </button>
      <DomainPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
