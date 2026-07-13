import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function requireExportAuth(): Promise<
  { authorized: true } | { authorized: false; response: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { authorized: true };
}
