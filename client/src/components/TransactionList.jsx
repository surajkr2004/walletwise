function TransactionList({ transactions, title, onEdit, onDelete, busy }) {
  const items = transactions || [];
  const heading = title || "Recent Transactions";

  const incBadge = "bg-emerald-100 text-emerald-700";
  const expBadge = "bg-rose-100 text-rose-700";
  const incAmt   = "text-emerald-600";
  const expAmt   = "text-rose-500";

  return (
    <div className="glass rounded-4xl p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-brand-900">{heading}</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {items.length} transaction{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-50 py-12 text-center">
          <span className="text-4xl">💳</span>
          <p className="mt-3 text-sm font-semibold text-brand-700">No transactions yet</p>
          <p className="mt-1 text-xs text-slate-400">Add your first transaction to get started</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((tx) => {
            const isIncome = tx.type === "income";
            const badge = isIncome ? incBadge : expBadge;
            const amtCls = isIncome ? incAmt : expAmt;
            const sign = isIncome ? "+" : "-";
            const date = tx.transaction_date
              ? String(tx.transaction_date).slice(0, 10)
              : tx.date || "";

            return (
              <li
                key={tx.id}
                className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50/80 px-4 py-3.5 transition-all hover:border-brand-100 hover:bg-white hover:shadow-card"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
                  {sign}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-900">{tx.title}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>
                      {tx.category}
                    </span>
                    <span className="text-xs text-slate-400">{date}</span>
                  </div>
                </div>

                <span className={`shrink-0 text-sm font-bold ${amtCls}`}>
                  {sign}Rs.{Number(tx.amount).toLocaleString()}
                </span>

                {(onEdit || onDelete) && (
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        disabled={busy}
                        className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        disabled={busy}
                        className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;
