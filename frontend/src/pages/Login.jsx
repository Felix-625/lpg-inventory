import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Mail, Lock, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-ink-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-gold-500 mb-3">
            <Flame size={26} />
          </div>
          <h1 className="text-2xl font-bold text-navy-700">Welcome back</h1>
          <p className="text-sm text-ink-400">Sign in to your LPG dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700">Email</label>
            <div className="mt-1 relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink-700">Password</label>
            <div className="mt-1 relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          No account?{" "}
          <Link to="/register" className="text-navy-700 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}