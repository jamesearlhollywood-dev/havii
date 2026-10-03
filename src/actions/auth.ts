"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPublicSignupRole } from "@/lib/roles";
import type { UserRole } from "@/lib/types";
import type { AuthActionState } from "@/actions/types";

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const preferredName = String(formData.get("preferred_name") || "").trim();
  const role = String(formData.get("role") || "youth");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!isPublicSignupRole(role)) {
    return { error: "Invalid signup role. Staff accounts are invitation-only." };
  }

  try {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          role: role as UserRole,
          first_name: firstName,
          last_name: lastName,
          preferred_name: preferredName || firstName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Ensure profile exists (trigger should create; upsert as backup)
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          user_id: data.user.id,
          role: role as UserRole,
          first_name: firstName || null,
          last_name: lastName || null,
          preferred_name: preferredName || firstName || null,
        },
        { onConflict: "user_id" }
      );
      if (profileError) {
        // Trigger may have already inserted; ignore unique conflicts
        console.error("profile upsert:", profileError.message);
      }
    }

    if (data.session) {
      redirect("/app/dashboard");
    }

    return {
      success:
        "Check your email to verify your account, then sign in to continue.",
    };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) {
      throw e; // Next.js redirect
    }
    const message = e instanceof Error ? e.message : "Signup failed.";
    if (message.includes("Missing NEXT_PUBLIC_SUPABASE")) {
      return {
        error:
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see README).",
      };
    }
    return { error: message };
  }
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    redirect(next.startsWith("/") ? next : "/app/dashboard");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) {
      throw e;
    }
    const message = e instanceof Error ? e.message : "Login failed.";
    if (message.includes("Missing NEXT_PUBLIC_SUPABASE")) {
      return {
        error:
          "Supabase is not configured. Add credentials to .env.local (see README).",
      };
    }
    return { error: message };
  }
}

export async function forgotPasswordAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Email is required." };

  try {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });
    if (error) return { error: error.message };
    return {
      success: "If an account exists for that email, a reset link has been sent.",
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed.";
    return { error: message };
  }
}

export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    redirect("/dashboard");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Reset failed." };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
