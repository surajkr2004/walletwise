function StatusBanner({ tone = "success", message, onClose }) {
  if (!message) return null;

  const config = {
    success: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      icon: "✅"
    },
    error: {
      wrapper: "border-rose-200 bg-rose-50 text-rose-700",
      icon: "⚠️"
    },
    info: {
      wrapper: "border-brand-200 bg-brand-50 text-brand-700",
      icon: "ℹ️"
    }
  };

  const { wrapper, icon } = config[tone] || config.info;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium animate-fade-in-up ${wrapper}`}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default StatusBanner;
