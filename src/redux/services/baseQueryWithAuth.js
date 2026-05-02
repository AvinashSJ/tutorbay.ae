// redux/services/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-hot-toast";
import { getSupabase } from "@/libs/supabase";

// Helper: returns the current Supabase access_token (replaces old localStorage "token")
const getToken = async () => {
  if (typeof window === "undefined") return null;
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token ?? null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`,
  prepareHeaders: async (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const token = await getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const token = await getToken();

  if (!token && typeof window !== "undefined" && window.location.pathname !== "/login") {
    toast.error("Please log in to continue.");
    window.location.href = "/login";
    return { error: { status: 401, data: "No token found" } };
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    toast.error("Session expired. Please log in again.");
    if (typeof window !== "undefined") {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};
