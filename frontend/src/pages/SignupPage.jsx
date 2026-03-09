import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/authService";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form className="card w-full space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Signup</h1>
        <p className="text-sm text-slate-500">Prepared for future `/auth/signup` backend route.</p>

        <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" type="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <button className="btn-primary w-full" type="submit">
          Create account
        </button>

        <p className="text-sm text-slate-600">
          Already have an account? <Link className="text-ink underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
