const toneConfig = {
  blue: {
    wrapper: "from-brand-500 to-brand-700 text-white",
    icon: "💰",
    valueClass: "text-white",
    labelClass: "text-white/70",
    helperClass: "text-white/60"
  },
  green: {
    wrapper: "from-emerald-500 to-teal-600 text-white",
    icon: "📈",
    valueClass: "text-white",
    labelClass: "text-white/70",
    helperClass: "text-white/60"
  },
  red: {
    wrapper: "from-rose-500 to-pink-600 text-white",
    icon: "📉",
    valueClass: "text-white",
    labelClass: "text-white/70",
    helperClass: "text-white/60"
  },
  slate: {
    wrapper: "from-violet-500 to-purple-700 text-white",
    icon: "🎯",
    valueClass: "text-white",
    labelClass: "text-white/70",
    helperClass: "text-white/60"
  }
};

function SummaryCard({ title, value, helper, tone = "slate" }) {
  const config = toneConfig[tone] || toneConfig.slate;

  return (
    <div
      className={`stat-card bg-gradient-to-br ${config.wrapper} shadow-card`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${config.labelClass}`}>
            {title}
          </p>
          <h3 className={`mt-3 text-2xl font-black tracking-tight ${config.valueClass}`}>
            {value}
          </h3>
          <p className={`mt-1.5 text-xs ${config.helperClass}`}>{helper}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl backdrop-blur-sm">
          {config.icon}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
