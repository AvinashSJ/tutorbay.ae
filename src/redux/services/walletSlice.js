// redux/services/walletSlice.js
// Wallet data via Supabase PostgREST; unlock via Edge Function.
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSupabase } from '@/libs/supabase';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Wallet', 'Transactions'],
  endpoints: (builder) => ({
    // Get wallet balance for a tutor
    getWalletBalance: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('TutorWallet')
          .select('id, balance, updatedAt')
          .eq('tutorId', userId)
          .single();
        if (error) return { error: { status: 404, data: error.message } };
        return { data };
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

    // Unlock a requirement — deducts 1 credit and returns contact details
    unlockRequirement: builder.mutation({
      async queryFn(requirementId) {
        const supabase = getSupabase();
        const { data, error } = await supabase.functions.invoke('wallet-unlock', {
          body: { requirementId },
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
        const token = session?.access_token;
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
  useUnlockRequirementMutation,
  useCreatePaymentMutation,
} = walletApi;