import { Link } from "react-router-dom";

function AuthCard({ title, subtitle, badge, children, alternateText, alternateLink, alternateLabel }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16 overflow-hidden">

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

      <div className="relative w-full max-w-md animate-fade-in-up">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-3xl font-black tracking-tight gradient-text">
            WalletWise
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-4xl p-8 shadow-glass">
          {badge && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 border border-brand-100">
              {badge}
            </div>
          )}
          <h1 className="text-2xl font-black text-brand-900 tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-500">
            {alternateText}{" "}
            <Link to={alternateLink} className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2">
              {alternateLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
