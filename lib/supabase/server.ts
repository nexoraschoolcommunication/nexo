import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase instance bound to the request's HTTP-only session
// cookie. Every authenticated route/component reads the user from here —
// never from a value trusted from the client — so auth checks are always
// enforced server-side, not just hidden in the UI.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options, httpOnly: true, secure: true, sameSite: "lax" });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options, httpOnly: true, secure: true, sameSite: "lax" });
        },
      },
    }
  );
}

// Service-role client — SERVER ONLY. Bypasses RLS, so it must never be
// imported into any file that ships to the client bundle. Used only for
// admin tasks like seeding the skill catalog or writing login_attempts.
export function createServiceClient() {
  const { createClient: createRawClient } = require("@supabase/supabase-js");
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
