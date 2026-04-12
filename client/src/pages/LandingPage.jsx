import { Link } from "react-router-dom";

const features = [
  { icon: "💳", label: "Smart Wallet", desc: "Track your real-time balance with automatic income & expense sync." },
  { icon: "📊", label: "Visual Reports", desc: "Bar and donut charts powered by Recharts to spot spending patterns." },
  { icon: "🔒", label: "Secure Auth", desc: "JWT-based authentication keeps your financial data private." },
  { icon: "🎯", label: "Savings Goals", desc: "Reserve and monitor savings targets directly from your dashboard." }
];

const stats = [
  { value: "₹48,650", label: "Current Balance" },
  { value: "₹62,000", label: "Total Income" },
  { value: "₹13,350", label: "Total Expenses" }
];

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">

      {/* ── Nav ── */}
      <nav className="navbar px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-2xl font-black tracking-tight gradient-text">WalletWise</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost py-2 px-5 text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-24">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative grid items-center gap-16 lg:grid-cols-2">
          {/* Left copy */}
          <div>

          <h1 className="animate-fade-in-up delay-100 mt-6 text-5xl font-black leading-[1.1] tracking-tight text-brand-900 xl:text-6xl">
              Track money with{" "}
              <span className="gradient-text">clarity</span>{" "}
              and control.
            </h1>

            <p className="animate-fade-in-up delay-200 mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              WalletWise gives you a real-time view of your income, expenses,
              and savings — beautifully presented in one modern dashboard.
            </p>

            <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary px-8 py-4 text-base">
                Create Free Account →
              </Link>
              <Link to="/login" className="btn-ghost px-8 py-4 text-base">
                Sign In
              </Link>
            </div>

            {/* Stats strip */}
            <div className="animate-fade-in-up delay-400 mt-12 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-brand-700">{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right mock card */}
          <div className="animate-float relative flex justify-center">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 m-auto h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />

            <div className="relative w-full max-w-sm space-y-4">
              {/* Balance card */}
              <div className="glass-dark rounded-4xl p-7 text-white">
                <p className="text-sm font-medium text-white/70">Current Balance</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight">₹48,650.00</h2>
                <div className="mt-5 flex gap-6">
                  <div>
                    <p className="text-xs text-white/60">Income</p>
                    <p className="mt-0.5 text-lg font-bold text-emerald-400">+₹62,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Expense</p>
                    <p className="mt-0.5 text-lg font-bold text-rose-400">−₹13,350</p>
                  </div>
                </div>
                {/* Mini bar visual */}
                <div className="mt-5 flex items-end gap-1.5 h-10">
                  {[40,65,50,80,55,90,72].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-white/20"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent txn cards */}
              {[
                { icon: "🛒", name: "Grocery Shopping", cat: "Food", amt: "−₹1,240", color: "rose" },
                { icon: "💼", name: "Freelance Payment", cat: "Income", amt: "+₹15,000", color: "emerald" }
              ].map((t) => (
                <div key={t.name} className="glass flex items-center justify-between rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.cat}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${t.color === "rose" ? "text-rose-500" : "text-emerald-500"}`}>
                    {t.amt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-brand-900">Everything you need, nothing you don't</h2>
          <p className="mt-3 text-slate-500">Built for individuals who take their finances seriously.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.label}
              className="glass stat-card animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-brand-900">{f.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} WalletWise — Built with React, Node.js & MySQL
      </footer>
    </main>
  );
}

export default LandingPage;
