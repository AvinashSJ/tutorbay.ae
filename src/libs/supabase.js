import { createBrowserClient } from "@supabase/ssr";

let client;

export function getSupabase() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          storageKey: 'tutorbay-auth',
          storage: {
            getItem: (key) => {
              if (typeof window === "undefined") return null;
              return localStorage.getItem(key);
            },
            setItem: (key, value) => {
              if (typeof window === "undefined") return;
              localStorage.setItem(key, value);
            },
            removeItem: (key) => {
              if (typeof window === "undefined") return;
              localStorage.removeItem(key);
            },
          },
        },
      }
    );
  }
  return client;
}

export const supabase = typeof window !== "undefined" ? getSupabase() : null;