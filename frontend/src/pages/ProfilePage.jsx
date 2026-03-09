import { useState } from "react";
import PlaceholderCard from "../components/PlaceholderCard";
import { updateProfile } from "../services/authService";

export default function ProfilePage() {
  const [name, setName] = useState("Brand Owner");
  const [bio, setBio] = useState("Building AI-first brands.");
  const [error, setError] = useState("");

  const save = async () => {
    setError("");
    try {
      await updateProfile({ name, bio });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Prepared for `PATCH /auth/profile`.</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Bio</label>
            <textarea className="input min-h-24" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <button className="btn-primary mt-4" onClick={save}>
          Save profile
        </button>
      </div>

      <PlaceholderCard
        title="User API missing"
        description="Backend does not expose auth/user endpoints. This page is ready to connect as soon as routes are added."
      />
    </div>
  );
}
