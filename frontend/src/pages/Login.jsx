import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import GoogleButton from "../components/GoogleButton";
import InputField from "../components/InputField";
import { loginWithEmail, loginWithGoogle } from "../services/authAPI";

export default function Login() {
  const navigate = useNavigate();
  const detectedGoogleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    (typeof window !== "undefined" ? window.localStorage.getItem("Alkimi AI_google_client_id") : "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleClientIdInput, setGoogleClientIdInput] = useState(
    typeof window !== "undefined" ? window.localStorage.getItem("Alkimi AI_google_client_id") || "" : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginWithEmail({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle(credential);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Alkimi AI" subtitle="Sign in to account">
      <form className="space-y-4" onSubmit={handleEmailLogin}>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          showPasswordToggle
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Secure session enabled</span>
          <a href="#" className="text-slate-700 hover:underline">
            Forgot password?
          </a>
        </div>

        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleButton onSuccess={handleGoogleLogin} onError={(err) => setError(err.message)} disabled={loading} />

      {!detectedGoogleClientId ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="mb-2 text-xs text-amber-800">
            Google client ID is not configured. Paste it once and reload.
          </p>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="xxxxxxxxxx-xxxx.apps.googleusercontent.com"
              value={googleClientIdInput}
              onChange={(e) => setGoogleClientIdInput(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (!googleClientIdInput.trim()) return;
                window.localStorage.setItem("Alkimi AI_google_client_id", googleClientIdInput.trim());
                window.location.reload();
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}

      <p className="mt-5 text-center text-sm text-slate-600">
        Create account{" "}
        <Link to="/signup" className="font-medium text-ink hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}
