import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser, getStoredUser } from "../services/authAPI";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((data) => {
        if (active) {
          setUser(data.user || data);
        }
      })
      .catch(() => {
        clearSession();
        navigate("/login", { replace: true });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back{user?.name ? `, ${user.name}` : ""}.</p>

        {user ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Email: {user.email || "-"}</p>
            {user.picture ? <img src={user.picture} alt="Profile" className="mt-3 h-12 w-12 rounded-full" /> : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
        )}

        <button
          className="btn-secondary mt-6"
          onClick={() => {
            clearSession();
            navigate("/login", { replace: true });
          }}
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
