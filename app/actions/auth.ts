"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error?: string;
};

function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password. Double-check the credentials you set in Supabase.";
  }

  if (normalized.includes("email not confirmed")) {
    return "This account is not confirmed yet. In Supabase, open the user and enable Auto Confirm, or confirm the email.";
  }

  if (normalized.includes("too many requests")) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  return message;
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/dashboard");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect(redirectTo);
}
