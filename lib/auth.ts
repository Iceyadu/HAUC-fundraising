import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types/auth";

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
  };
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
