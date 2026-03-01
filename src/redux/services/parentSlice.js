// redux/services/userSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parentSlice = createApi({
  reducerPath: "parentApi",
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
    createRequirement: builder.mutation({
      query: (payload) => ({
        url: `/requirements/create-requirement`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response.data,
    }),

    getUserPosts: builder.query({
      query: (userId) => ({
        url: `/requirements/get-single-user-requirements?userId=${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateRequirementMutation, useGetUserPostsQuery } =
  parentSlice;
