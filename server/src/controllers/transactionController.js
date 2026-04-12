import supabase from "../config/supabase.js";

function parseTransactionId(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() + 1 === m && date.getUTCDate() === d;
}

function validateTransactionPayload(payload) {
  const title    = String(payload?.title || "").trim();
  const type     = String(payload?.type  || "").toLowerCase();
  const category = String(payload?.category || "").trim();
  const amount   = Number(payload?.amount);
  const date     = String(payload?.date  || "").trim();
  const note     = payload?.note ? String(payload.note).trim() : null;

  if (!title)                                   return { message: "Title is required." };
  if (title.length > 120)                       return { message: "Title must be 120 characters or less." };
  if (!["income", "expense"].includes(type))    return { message: "Type must be either income or expense." };
  if (!category)                                return { message: "Category is required." };
  if (category.length > 80)                     return { message: "Category must be 80 characters or less." };
  if (!Number.isFinite(amount) || amount <= 0)  return { message: "Amount must be greater than 0." };
  if (!isIsoDate(date))                         return { message: "Date must be in YYYY-MM-DD format." };
  if (note && note.length > 1000)               return { message: "Note must be 1000 characters or less." };

  return { value: { title, type, category, amount, date, note } };
}

async function refreshWalletTotals(userId) {
  const { data: txns } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId);

  const incomeTotal  = (txns || []).filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenseTotal = (txns || []).filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance      = incomeTotal - expenseTotal;

  await supabase
    .from("wallets")
    .update({ income_total: incomeTotal, expense_total: expenseTotal, balance })
    .eq("user_id", userId);
}

export async function getTransactions(req, res, next) {
  const search   = String(req.query?.search   || "").trim();
  const type     = String(req.query?.type     || "").trim().toLowerCase();
  const category = String(req.query?.category || "").trim();

  try {
    let query = supabase
      .from("transactions")
      .select("id, title, type, category, amount, transaction_date, note")
      .eq("user_id", req.user.id)
      .order("transaction_date", { ascending: false })
      .order("id", { ascending: false });

    if (["income", "expense"].includes(type)) {
      query = query.eq("type", type);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,category.ilike.%${search}%,note.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json(data || []);
  } catch (error) {
    next(error);
  }
}

export async function createTransaction(req, res, next) {
  const validation = validateTransactionPayload(req.body);
  if (!validation.value) return res.status(400).json({ message: validation.message });

  const { title, type, category, amount, date, note } = validation.value;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id:          req.user.id,
        title,
        type,
        category,
        amount,
        transaction_date: date,
        note
      })
      .select("id")
      .single();

    if (error) throw error;

    await refreshWalletTotals(req.user.id);
    return res.status(201).json({ id: data.id, message: "Transaction created successfully." });
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(req, res, next) {
  const transactionId = parseTransactionId(req.params.id);
  if (!transactionId) return res.status(400).json({ message: "Invalid transaction id." });

  const validation = validateTransactionPayload(req.body);
  if (!validation.value) return res.status(400).json({ message: validation.message });

  const { title, type, category, amount, date, note } = validation.value;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({ title, type, category, amount, transaction_date: date, note })
      .eq("id", transactionId)
      .eq("user_id", req.user.id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ message: "Transaction not found." });

    await refreshWalletTotals(req.user.id);
    return res.json({ message: "Transaction updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(req, res, next) {
  const transactionId = parseTransactionId(req.params.id);
  if (!transactionId) return res.status(400).json({ message: "Invalid transaction id." });

  try {
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("user_id", req.user.id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ message: "Transaction not found." });

    await refreshWalletTotals(req.user.id);
    return res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    next(error);
  }
}
