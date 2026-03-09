import { useState } from "react";
import PlaceholderCard from "../components/PlaceholderCard";
import {
  getBrandAnalytics,
  getBrandProfile,
  getVerificationStatus,
  reportMisuse,
  submitBrand
} from "../services/verificationService";

export default function BrandVerificationPage() {
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [misuseUrl, setMisuseUrl] = useState("");
  const [feedback, setFeedback] = useState("");

  const handle = async (action) => {
    setFeedback("");
    try {
      if (action === "submit") {
        await submitBrand({ brandName, website });
      }
      if (action === "status") {
        await getVerificationStatus();
      }
      if (action === "analytics") {
        await getBrandAnalytics();
      }
      if (action === "profile") {
        await getBrandProfile();
      }
      if (action === "misuse") {
        await reportMisuse({ misuseUrl });
      }
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Brand Verification</h2>
        <p className="text-sm text-slate-500">
          Full UI scaffold created. Backend verification routes are currently missing.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-base font-semibold">Brand submission</h3>
          <div className="mt-3 space-y-3">
            <input className="input" placeholder="Brand name" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            <input className="input" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <button className="btn-primary" onClick={() => handle("submit")}>Submit brand</button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold">Report misuse</h3>
          <div className="mt-3 space-y-3">
            <input className="input" placeholder="Suspected misuse URL" value={misuseUrl} onChange={(e) => setMisuseUrl(e.target.value)} />
            <button className="btn-secondary" onClick={() => handle("misuse")}>Report</button>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold">Verification operations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => handle("status")}>Check status</button>
            <button className="btn-secondary" onClick={() => handle("analytics")}>Load analytics</button>
            <button className="btn-secondary" onClick={() => handle("profile")}>Open brand profile</button>
          </div>
          {feedback ? <p className="mt-3 text-sm text-danger">{feedback}</p> : null}
        </div>

        <PlaceholderCard
          title="Backend extension required"
          description="Add dedicated brand verification endpoints and this page becomes fully operational without UI rewrite."
        />
      </div>
    </div>
  );
}
