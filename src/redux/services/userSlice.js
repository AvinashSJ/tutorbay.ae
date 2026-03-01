// redux/services/userSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
  reducerPath: "userApi",
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
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/get-user-details/${userId}`,
        method: "GET",
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

export const { useGetUserQuery, useGetUserPostsQuery } = userSlice;
    