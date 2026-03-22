import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Wallet', 'Transactions'],
  endpoints: (builder) => ({
    // Get wallet balance
    getWalletBalance: builder.query({
      query: (userId) => `/payments/wallet/${userId}`,
      providesTags: ['Wallet'],
    }),

    // Create payment intent
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/create-payment',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),

    // Get transaction history
    getTransactions: builder.query({
      query: (userId) => `/payments/wallet-transactions?userId=${userId}`,
      providesTags: ['Transactions'],
    }),

    // Handle payment webhook
    handlePaymentWebhook: builder.mutation({
      query: (webhookData) => ({
        url: '/payments/payment-webhook',
        method: 'POST',
        body: webhookData,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useCreatePaymentMutation,
  useGetTransactionsQuery,
  useHandlePaymentWebhookMutation,
} = walletApi; 