// src/libs/supabase.js
// Singleton Supabase browser client — import this everywhere in the frontend.
// Uses NEXT_PUBLIC_ env vars so it is safe for client-side bundles.

import { createBrowserClient } from "@supabase/ssr";

let client;

export function getSupabase() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }
  return client;
}

// Convenience default export
export const supabase = typeof window !== "undefined" ? getSupabase() : null;
