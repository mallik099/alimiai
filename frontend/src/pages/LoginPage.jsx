import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form className="card w-full space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate-500">Auth API is not available in backend yet.</p>

        <input className="input" type="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <button className="btn-primary w-full" type="submit">
          Sign in
        </button>

        <p className="text-sm text-slate-600">
          Need an account? <Link className="text-ink underline" to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
