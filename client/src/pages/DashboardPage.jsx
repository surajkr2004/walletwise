import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";
import DashboardChart from "../components/DashboardChart";
import StatusBanner from "../components/StatusBanner";
import api from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";

function buildWeeklyData(transactions) {
  const labels = [];
  const totals = new Map();
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    labels.push({ key, day: label, income: 0, expense: 0 });
    totals.set(key, labels[labels.length - 1]);
  }

  transactions.forEach((item) => {
    const key = String(item.transaction_date).slice(0, 10);
    const bucket = totals.get(key);
    if (bucket) bucket[item.type] += Number(item.amount);
  });

  return labels;
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    wallet: { balance: 0, income_total: 0, expense_total: 0, savings_balance: 0 },
    transactions: []
  });
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchDashboard = async () => {
    try {
      const [{ data: wallet }, { data: transactions }] = await Promise.all([
        api.get("/wallet"),
        api.get("/transactions")
      ]);
      setDashboard({ wallet, transactions });
      setSavingsBalance(wallet.savings_balance || 0);
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to load dashboard data.") });
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const weeklyData = useMemo(() => buildWeeklyData(dashboard.transactions), [dashboard.transactions]);

  const handleSavingsSubmit = async (event) => {
    event.preventDefault();
    const v = Number(savingsBalance);
    if (!Number.isFinite(v) || v < 0) {
      setFeedback({ tone: "error", message: "Savings value must be 0 or greater." });
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put("/wallet/savings", { savingsBalance: v });
      await fetchDashboard();
      setFeedback({ tone: "success", message: data?.message || "Savings updated." });
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to update savings.") });
    } finally {
      setSaving(false);
    }
  };

  const w = dashboard.wallet;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Status banner */}
        {feedback?.message && (
          <div className="mb-6">
            <StatusBanner tone={feedback.tone} message={feedback.message} onClose={() => setFeedback(null)} />
          </div>
        )}

        {/* Page header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-black tracking-tight text-brand-900">
            Financial Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Summary cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="animate-fade-in-up delay-100">
            <SummaryCard
              title="Current Balance"
              value={`Rs.${Number(w.balance || 0).toLocaleString()}`}
              helper="Available in your wallet"
              tone="blue"
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <SummaryCard
              title="Total Income"
              value={`Rs.${Number(w.income_total || 0).toLocaleString()}`}
              helper="All recorded income"
              tone="green"
            />
          </div>
          <div className="animate-fade-in-up delay-300">
            <SummaryCard
              title="Total Expense"
              value={`Rs.${Number(w.expense_total || 0).toLocaleString()}`}
              helper="All recorded expenses"
              tone="red"
            />
          </div>
          <div className="animate-fade-in-up delay-400">
            <SummaryCard
              title="Savings"
              value={`Rs.${Number(w.savings_balance || 0).toLocaleString()}`}
              helper="Reserved for goals"
              tone="slate"
            />
          </div>
        </section>

        {/* Chart + Sidebar */}
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-in-up delay-100">
            <DashboardChart data={weeklyData} />
          </div>

          <div className="flex flex-col gap-6">
            {/* Recent transactions */}
            <div className="animate-fade-in-up delay-200">
              <TransactionList
                transactions={dashboard.transactions.slice(0, 5)}
                title="Recent Transactions"
              />
            </div>

            {/* Savings updater */}
            <div className="animate-fade-in-up delay-300 glass rounded-4xl p-6 shadow-card">
              <h2 className="text-base font-bold text-brand-900">Update Savings Target</h2>
              <p className="mt-1 text-xs text-slate-500">Reserve part of your balance for a goal.</p>
              <form onSubmit={handleSavingsSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={savingsBalance}
                  onChange={(e) => setSavingsBalance(e.target.value)}
                  className="input-modern flex-1"
                  placeholder="0.00"
                />
                <button type="submit" disabled={saving} className="btn-primary shrink-0 px-5 py-3 text-sm">
                  {saving ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
