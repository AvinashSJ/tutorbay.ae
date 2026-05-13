// redux/services/walletSlice.js
// Wallet data via Supabase PostgREST; unlock via Edge Function.
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSupabase } from '@/libs/supabase';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Wallet', 'Transactions'],
  endpoints: (builder) => ({
    // Get wallet balance for the currently authenticated user
    getWalletBalance: builder.query({
      async queryFn() {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };
        const { data, error } = await supabase
          .from('TutorWallet')
          .select('id, balance, updatedAt')
          .eq('tutorId', user.id)
          .single();
        if (error) return { error: { status: 404, data: 0 } };
        return { data: data || { balance: 0 } };
      },
      providesTags: ['Wallet'],
    }),

    // Get wallet transaction history
    getTransactions: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        // First get the wallet id for this tutor
        const { data: wallet, error: wErr } = await supabase
          .from('TutorWallet')
          .select('id')
          .eq('tutorId', userId)
          .single();
        if (wErr) return { error: { status: 404, data: wErr.message } };

        const { data, error } = await supabase
          .from('WalletTransaction')
          .select('id, type, source, amount, balanceAfter, referenceId, createdAt')
          .eq('walletId', wallet.id)
          .order('createdAt', { ascending: false });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ['Transactions'],
    }),

    // Get previously unlocked requirement IDs with parent contact info
    getUnlockedRequirements: builder.query({
      async queryFn() {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };
        const { data, error } = await supabase.rpc("get_unlocked_requirements", { p_tutor_id: user.id });
        if (error) return { error: { status: 500, data: error.message } };
        return { data: data || [] };
      },
      providesTags: ['Transactions'],
    }),

    // Unlock a requirement — deducts credits via RPC and returns parent contact
    unlockRequirementContact: builder.mutation({
      async queryFn({ requirementId }) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const { data, error } = await supabase.rpc("unlock_requirement_contact", {
          p_requirement_id: requirementId,
          p_tutor_id: user.id,
        });
        if (error) return { error: { status: 500, data: error.message } };
        if (!data?.success) return { error: { status: 400, data: data?.error || "Unlock failed" } };
        return { data };
      },
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    // Unlock a tutor's contact — deducts from parent, credits tutor
    unlockTutorContact: builder.mutation({
      async queryFn({ tutorId }) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const { data, error } = await supabase.rpc("unlock_tutor_contact", {
          p_tutor_id: tutorId,
          p_parent_id: user.id,
        });
        if (error) return { error: { status: 500, data: error.message } };
        if (!data?.success) return { error: { status: 400, data: data?.error || "Unlock failed" } };
        return { data };
      },
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    // Add free credits for testing (bypasses payment)
    addFreeCredits: builder.mutation({
      async queryFn({ amount }) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };
        const { data, error } = await supabase.rpc("add_free_credits", {
          p_user_id: user.id,
          p_amount: amount,
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    // Create Stripe payment intent — redirects to Stripe Checkout
    createPayment: builder.mutation({
      async queryFn(paymentData) {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { error: { status: 401, data: "Not authenticated" } };
        const token = session.access_token;
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(paymentData),
        });
        const json = await res.json();
        if (!res.ok) return { error: { status: res.status, data: json.error ?? 'Payment failed' } };
        return { data: json };
      },
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useGetTransactionsQuery,
  useGetUnlockedRequirementsQuery,
  useUnlockRequirementContactMutation,
  useUnlockTutorContactMutation,
  useAddFreeCreditsMutation,
  useCreatePaymentMutation,
} = walletApi;