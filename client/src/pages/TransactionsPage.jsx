import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StatusBanner from "../components/StatusBanner";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import api from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";

const defaultFilters = { search: "", type: "all", category: "all" };

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to load transactions.") });
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const query = filters.search.trim().toLowerCase();
      const matchesSearch = !query || [item.title, item.category, item.note || ""].some((v) =>
        String(v).toLowerCase().includes(query)
      );
      const matchesType = filters.type === "all" || item.type === filters.type;
      const matchesCategory = filters.category === "all" || item.category === filters.category;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [filters, transactions]);

  const categoryOptions = useMemo(() =>
    Array.from(new Set(transactions.map((i) => i.category))).sort(),
    [transactions]
  );

  const handleCreate = async (payload) => {
    setBusy(true);
    try {
      const { data } = await api.post("/transactions", payload);
      await fetchTransactions();
      setFeedback({ tone: "success", message: data?.message || "Transaction added." });
      return true;
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to create transaction.") });
      return false;
    } finally { setBusy(false); }
  };

  const handleUpdate = async (payload) => {
    if (!editingTransaction) return false;
    setBusy(true);
    try {
      const { data } = await api.put(`/transactions/${editingTransaction.id}`, payload);
      setEditingTransaction(null);
      await fetchTransactions();
      setFeedback({ tone: "success", message: data?.message || "Transaction updated." });
      return true;
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to update transaction.") });
      return false;
    } finally { setBusy(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setBusy(true);
    try {
      const { data } = await api.delete(`/transactions/${id}`);
      if (editingTransaction?.id === id) setEditingTransaction(null);
      await fetchTransactions();
      setFeedback({ tone: "success", message: data?.message || "Transaction deleted." });
    } catch (error) {
      setFeedback({ tone: "error", message: getApiErrorMessage(error, "Failed to delete transaction.") });
    } finally { setBusy(false); }
  };

  const totals = useMemo(() =>
    filteredTransactions.reduce((s, i) => { s[i.type] += Number(i.amount); return s; }, { income: 0, expense: 0 }),
    [filteredTransactions]
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-black tracking-tight text-brand-900">Transactions</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all your income and expenses</p>
        </div>

        {feedback?.message && (
          <div className="mb-6">
            <StatusBanner tone={feedback.tone} message={feedback.message} onClose={() => setFeedback(null)} />
          </div>
        )}

        {/* Summary Mini-cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Visible Transactions", value: filteredTransactions.length, cls: "text-brand-900", bg: "bg-brand-50 border-brand-100" },
            { label: "Visible Income", value: `Rs.${totals.income.toFixed(2)}`, cls: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Visible Expense", value: `Rs.${totals.expense.toFixed(2)}`, cls: "text-rose-600", bg: "bg-rose-50 border-rose-100" }
          ].map((m) => (
            <div key={m.label} className={`rounded-3xl border p-5 ${m.bg} animate-fade-in-up`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{m.label}</p>
              <p className={`mt-2 text-2xl font-black ${m.cls}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 glass rounded-3xl p-5 shadow-card animate-fade-in-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-900">Filter Transactions</h3>
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Clear
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              name="search"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              placeholder="Search title, category, note..."
              className="input-modern text-sm"
            />
            <select
              name="type"
              value={filters.type}
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
              className="input-modern text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              className="input-modern text-sm"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Form + List */}
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <div className="animate-fade-in-up delay-100">
            <TransactionForm
              onSubmit={editingTransaction ? handleUpdate : handleCreate}
              busy={busy}
              initialData={editingTransaction}
              submitLabel={editingTransaction ? "Update Transaction" : "Add Transaction"}
              onCancel={() => setEditingTransaction(null)}
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <TransactionList
              title="All Transactions"
              transactions={filteredTransactions}
              onEdit={setEditingTransaction}
              onDelete={handleDelete}
              busy={busy}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default TransactionsPage;
