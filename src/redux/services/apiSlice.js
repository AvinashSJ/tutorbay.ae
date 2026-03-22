// services/apiSlice.js
"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
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
