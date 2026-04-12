import { useEffect, useState } from "react";

const defaultState = {
  title: "",
  type: "expense",
  category: "Food",
  amount: "",
  date: "",
  note: ""
};

const categories = ["Food", "Transport", "Shopping", "Health", "Education", "Entertainment", "Salary", "Freelance", "Other"];

function TransactionForm({ onSubmit, busy, initialData, submitLabel = "Add Transaction", onCancel }) {
  const [formData, setFormData] = useState(defaultState);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || "expense",
        category: initialData.category || "Food",
        amount: initialData.amount || "",
        date: initialData.transaction_date
          ? String(initialData.transaction_date).slice(0, 10)
          : initialData.date || "",
        note: initialData.note || ""
      });
      setFormError("");
      return;
    }
    setFormData(defaultState);
    setFormError("");
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = formData.title.trim();
    const category = formData.category.trim();
    const amount = Number(formData.amount);

    if (!title) { setFormError("Title is required."); return; }
    if (!category) { setFormError("Category is required."); return; }
    if (!Number.isFinite(amount) || amount <= 0) { setFormError("Amount must be greater than 0."); return; }
    if (!formData.date) { setFormError("Date is required."); return; }

    setFormError("");
    const shouldReset = await onSubmit({ ...formData, title, category, note: formData.note.trim(), amount });
    if (shouldReset !== false && !initialData) setFormData(defaultState);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-4xl p-6 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-900">
            {initialData ? "Edit Transaction" : "New Transaction"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Track your income and expenses</p>
        </div>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Error */}
      {formError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <span>Warning</span> {formError}
        </div>
      )}

      {/* Type toggle */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: t }))}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-all capitalize ${
                formData.type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-rose-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength="120"
          placeholder="e.g. Grocery shopping"
          className="input-modern"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-modern"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Amount + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Amount (Rs)</label>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input-modern"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="input-modern"
            required
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Note (optional)</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="2"
          maxLength="1000"
          placeholder="Add a note..."
          className="input-modern resize-none"
        />
      </div>

      {/* Submit */}
      <button type="submit" disabled={busy} className="btn-primary w-full py-3">
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default TransactionForm;
