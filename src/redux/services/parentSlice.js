// redux/services/userSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const parentSlice = createApi({
  reducerPath: "parentApi",
  baseQuery: baseQueryWithAuth,
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
