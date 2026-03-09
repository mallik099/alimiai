import { useState } from "react";
import { API_URL_KEY, getApiBaseUrl } from "../services/apiClient";
import { getHealth } from "../services/backendService";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [result, setResult] = useState("");

  const save = () => {
    localStorage.setItem(API_URL_KEY, apiUrl.trim());
    setResult("Saved API URL. Refresh dashboard to re-check status.");
  };

  const testConnection = async () => {
    setResult("Testing...");
    try {
      await getHealth();
      setResult("Connection successful: GET /health responded.");
    } catch (err) {
      setResult(`Connection failed: ${err.message}`);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Runtime frontend config.</p>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-slate-600">Backend API base URL</label>
          <input className="input" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
        </div>

        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={save}>Save</button>
          <button className="btn-secondary" onClick={testConnection}>Test connection</button>
        </div>

        {result ? <p className="mt-3 text-sm text-slate-600">{result}</p> : null}
      </div>

      <div className="card p-5">
        <h3 className="text-base font-semibold">Backend capability snapshot</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Available: `/`, `/health`, `/models/status`, `/chat`</li>
          <li>Missing: `/auth/*`, `/users/*`, `/brand-verification/*`</li>
          <li>CORS currently allows all origins in backend config.</li>
        </ul>
      </div>
    </div>
  );
}
