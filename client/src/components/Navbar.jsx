import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navLinks = [
  { to: "/dashboard",    label: "Dashboard",     icon: "📊" },
  { to: "/transactions", label: "Transactions",  icon: "💳" },
  { to: "/reports",      label: "Reports",       icon: "📈" },
  { to: "/profile",      label: "Profile",       icon: "👤" }
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-black tracking-tight gradient-text">
          WalletWise
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 border border-brand-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-semibold text-brand-800">{user?.name?.split(" ")[0] || "User"}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-100"
          >
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white/95 backdrop-blur px-6 pb-5 pt-3 space-y-1">
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-slate-700 hover:bg-brand-50"
                }`
              }
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
