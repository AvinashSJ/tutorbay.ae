// services/apiSlice.js
// Auth endpoints backed by Supabase Auth SDK directly.
// We use createApi with a no-op base query since Supabase SDK handles transport.
"use client";

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSupabase } from "@/libs/supabase";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      async queryFn({ email, password }) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("Supabase login error:", error.message, error.code, error.status);
          return { error: { status: error.status ?? 401, data: error.message } };
        }
        return { data };
      },
    }),

    registerUser: builder.mutation({
      async queryFn({ email, password, fullName, phone, role = "PARENT" }) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { fullName, phone, role },
          },
        });
        if (error) return { error: { status: 400, data: error.message } };
        // If email confirmation is disabled, a session is returned immediately.
        // If it's still enabled, data.session will be null — that's fine, user sees success toast.
        return { data };
      },
    }),

    logoutUser: builder.mutation({
      async queryFn() {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signOut();
        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
    }),

    forgotPassword: builder.mutation({
      async queryFn({ email }) {
        const supabase = getSupabase();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { error: { status: 400, data: error.message } };
        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
} = apiSlice;

