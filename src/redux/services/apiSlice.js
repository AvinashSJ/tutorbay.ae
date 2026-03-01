// services/apiSlice.js
"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tutorbay-api.onrender.com/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ mobileEmail, password, userType }) => ({
        url: "/users/login",
        method: "POST",
        body: { mobileEmail, password, userType },
      }),
    }),
    createTutor: builder.mutation({
      query: (body) => ({
        url: "users/create-user",
        method: "POST",
        body,
      }),
    }),
    loginWithGoogle: builder.mutation({
      query: ({ token, clientId, select_by }) => ({
        url: "/users/google-login",
        method: "POST",
        body: { token, clientId, select_by },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useCreateTutorMutation,
  useLoginWithGoogleMutation,
} = apiSlice;
