import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const strength = formData.password.length === 0 ? 0
    : formData.password.length < 6 ? 1
    : formData.password.length < 10 ? 2
    : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-rose-400", "bg-amber-400", "bg-emerald-400"][strength];

  return (
    <AuthCard
      title="Create your account ✨"
      subtitle="Join WalletWise and take control of your finances."
      badge="🚀 Free Forever"
      alternateText="Already have an account?"
      alternateLink="/login"
      alternateLabel="Sign in instead"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Full name
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="input-modern"
            required
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email address
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="input-modern"
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="input-modern pr-12"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors text-sm"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          {/* Strength bar */}
          {formData.password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= strength ? strengthColor : "bg-slate-200"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-slate-500">{strengthLabel}</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={busy} className="btn-primary w-full mt-2">
          {busy ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            "Create Account →"
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          By signing up you agree to our{" "}
          <span className="text-brand-500 cursor-pointer">Terms of Service</span> &{" "}
          <span className="text-brand-500 cursor-pointer">Privacy Policy</span>
        </p>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;
