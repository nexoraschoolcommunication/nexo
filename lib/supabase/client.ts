import { createBrowserClient } from "@supabase/ssr";

// Client-side Supabase instance. Only ever uses the public anon key,
// which is safe to ship because every table is locked down by RLS
// policies defined in schema.sql — the anon key alone grants nothing.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
