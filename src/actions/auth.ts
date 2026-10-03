"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";

export type AuthState = { error?: string; success?: string };

export async function signUpAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  // Check for existing user
  const { rows: existing } = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0) {
    return { error: "An account with this email already exists. Try signing in." };
  }

  const passwordHash = hashPassword(password);
  const { rows } = await query<{ id: string }>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
    [email, passwordHash]
  );
  const userId = rows[0].id;

  // Create a bare profile (onboarding not yet completed)
  await query(
    `INSERT INTO profiles (user_id, preferred_name, date_of_birth)
     VALUES ($1, $2, $3)`,
    [userId, "", "1900-01-01"]
  );

  // Set session cookie
  const token = createSessionToken(userId, email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  redirect("/onboarding");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/app");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { rows } = await query<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email]
  );
  if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash)) {
    return { error: "Incorrect email or password." };
  }

  const userId = rows[0].id;
  const token = createSessionToken(userId, email);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  // If a specific next path was provided, honor it
  if (next.startsWith("/") && next !== "/app") {
    redirect(next);
  }

  // Check profile role — caregivers go to their dashboard
  const { rows: profileRows } = await query<{ role: string }>(
    "SELECT role FROM profiles WHERE user_id = $1",
    [userId]
  );
  if (profileRows.length > 0 && profileRows[0].role === "caregiver") {
    redirect("/caregiver");
  }

  redirect("/app");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

// Legacy exports for backward compatibility with previous HAVII components
export type AuthActionState = AuthState;

export async function forgotPasswordAction(
  _prev: AuthState,
  _formData: FormData
): Promise<AuthState> {
  return { error: "Password reset is not available in this phase." };
}

export async function resetPasswordAction(
  _prev: AuthState,
  _formData: FormData
): Promise<AuthState> {
  return { error: "Password reset is not available in this phase." };
}
