import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          <h1 className="text-2xl font-bold text-navy-700">Create account</h1>
          <p className="text-sm text-ink-400">Start managing your LPG inventory</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {["name", "email", "password"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-ink-700 capitalize">
                {field}
              </label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 border border-ink-100 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                placeholder={field === "password" ? "min 6 characters" : ""}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{" "}
          <Link to="/login" className="text-navy-700 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}