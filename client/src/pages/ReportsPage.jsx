import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Navbar from "../components/Navbar";
import DashboardChart from "../components/DashboardChart";
import api from "../services/api";

const PIE_COLORS = ["#3a5ff0", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4", "#ec4899"];

function buildMonthlyData(transactions) {
  const map = new Map();
  transactions.forEach((item) => {
    const date = new Date(item.transaction_date);
    const label = date.toLocaleDateString("en-US", { month: "short" });
    if (!map.has(label)) map.set(label, { day: label, income: 0, expense: 0 });
    map.get(label)[item.type] += Number(item.amount);
  });
  return Array.from(map.values());
}

function buildCategoryData(transactions) {
  const map = new Map();
  transactions
    .filter((i) => i.type === "expense")
    .forEach((i) => {
      map.set(i.category, (map.get(i.category) || 0) + Number(i.amount));
    });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-2xl px-4 py-3 shadow-glass text-sm">
      <p className="font-bold text-brand-900">{payload[0].name}</p>
      <p className="text-slate-500 mt-0.5">Rs.{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
}

function ReportsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/transactions").then(({ data }) => setTransactions(data)).catch(console.error);
  }, []);

  const monthlyData = useMemo(() => buildMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => buildCategoryData(transactions), [transactions]);

  const totalExpense = categoryData.reduce((s, i) => s + i.value, 0);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-black tracking-tight text-brand-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Visual overview of your income and expense patterns
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Bar chart */}
          <div className="animate-fade-in-up delay-100">
            <DashboardChart data={monthlyData} title="Monthly Overview" />
          </div>

          {/* Pie chart */}
          <div className="animate-fade-in-up delay-200 glass rounded-4xl p-6 shadow-card">
            <h2 className="mb-1 text-lg font-bold text-brand-900">Expense by Category</h2>
            <p className="text-xs text-slate-500 mb-5">Based on all recorded expenses</p>

            {categoryData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-brand-50 text-center">
                <span className="text-4xl">📊</span>
                <p className="mt-3 text-sm font-semibold text-brand-700">No expense data yet</p>
                <p className="mt-1 text-xs text-slate-400">Add expense transactions to see insights</p>
              </div>
            ) : (
              <>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="50%"
                        outerRadius="80%"
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => {
                    const pct = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-xs text-slate-400">{pct}%</span>
                          <span className="font-bold text-brand-900">Rs.{item.value.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default ReportsPage;
