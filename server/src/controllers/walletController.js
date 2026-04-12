import supabase from "../config/supabase.js";

export async function getWallet(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .select("id, balance, income_total, expense_total, savings_balance")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Wallet not found." });

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function updateSavings(req, res, next) {
  const savingsBalance = Number(req.body?.savingsBalance);

  if (!Number.isFinite(savingsBalance) || savingsBalance < 0) {
    return res.status(400).json({ message: "Savings value must be 0 or greater." });
  }

  try {
    const { error } = await supabase
      .from("wallets")
      .update({ savings_balance: savingsBalance })
      .eq("user_id", req.user.id);

    if (error) throw error;
    return res.json({ message: "Savings updated successfully." });
  } catch (error) {
    next(error);
  }
}
