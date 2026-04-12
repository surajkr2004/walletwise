import {
  Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-2xl px-4 py-3 shadow-glass text-sm">
      <p className="mb-2 font-bold text-brand-900">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="capitalize text-slate-600">{entry.dataKey}:</span>
          <span className="font-semibold text-brand-800">₹{Number(entry.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardChart({ data, title = "Weekly Overview" }) {
  return (
    <div className="glass rounded-4xl p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Income vs Expense comparison</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Expense
          </span>
        </div>
      </div>
      <div className="h-72">
        {data?.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-brand-50 text-sm text-slate-400">
            No transaction data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(58,95,240,0.08)" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(58,95,240,0.05)", radius: 8 }} />
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" fill="#3a5ff0" radius={[8, 8, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardChart;
