import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-black tracking-tight text-brand-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <div className="animate-fade-in-up delay-100 glass rounded-4xl p-8 shadow-card">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-violet-600 text-2xl font-black text-white shadow-glow">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-900">{user?.name || "User"}</h2>
              <p className="mt-1 text-sm text-slate-500">{user?.email || "—"}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active Account
              </span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="animate-fade-in-up delay-200 mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Full name", value: user?.name, icon: "👤" },
            { label: "Email address", value: user?.email, icon: "📧" }
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass rounded-3xl p-5 shadow-card">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>{icon}</span> {label}
              </div>
              <p className="mt-2 text-base font-semibold text-brand-900">{value || "Not set"}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="animate-fade-in-up delay-300 mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-100"
          >
            Sign Out of Account
          </button>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
