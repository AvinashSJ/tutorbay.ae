// services/apiSlice.js
// Auth endpoints backed by Supabase Auth SDK directly.
"use client";

import { toast } from "react-hot-toast";
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
      async queryFn({ email, password, fullName, phone, role = "PARENT", emiratesId }) {
        const supabase = getSupabase();
        
        console.log("registerUser params:", { email, fullName, phone, role, emiratesId });
        
        // Sign up in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { fullName, phone, role, emiratesId },
          },
        });
        if (authError) return { error: { status: 400, data: authError.message } };
        
        console.log("Auth created, inserting User with emiratesId:", emiratesId);
        
        // Insert into User table
        if (authData.user) {
          const userData = {
            id: authData.user.id,
            email: email,
            fullName: fullName,
            phone: phone,
            role: role,
            emiratesId: emiratesId,
            passwordHash: '', // Auth handles password, DB stores empty hash
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          console.log("User insert data:", userData);
          
          const { error: insertError } = await supabase
            .from("User")
            .upsert(userData, { onConflict: 'id' });
          if (insertError) {
            console.error("Failed to upsert User record:", insertError);
            toast.error("Failed to save profile: " + insertError.message);
            return { error: { status: 500, data: insertError.message } };
          }
          console.log("User upserted successfully");
        }
        
        return { data: authData };
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

