import bcrypt from "bcryptjs";
import supabase from "../config/supabase.js";
import generateToken from "../utils/generateToken.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export async function register(req, res, next) {
  const name = String(req.body?.name || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!name) return res.status(400).json({ message: "Name is required." });
  if (name.length > 100) return res.status(400).json({ message: "Name is too long." });
  if (!emailPattern.test(email)) return res.status(400).json({ message: "Please provide a valid email address." });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    // Check existing user
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) return res.status(409).json({ message: "Email already exists." });

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({ name, email, password_hash: hashedPassword })
      .select("id, name, email")
      .single();

    if (insertError) throw insertError;

    // Create wallet for user
    await supabase.from("wallets").insert({ user_id: newUser.id });

    const user = { id: newUser.id, name: newUser.name, email: newUser.email };
    const token = generateToken(user);
    return res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = generateToken(payload);
    return res.json({ user: payload, token });
  } catch (error) {
    next(error);
  }
}
