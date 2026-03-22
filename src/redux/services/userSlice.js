// redux/services/userSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/get-user-details/${userId}`,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => response.data,
    }),

    getUserPosts: builder.query({
      query: (userId) => ({
        url: `/requirements/get-single-user-requirements?userId=${userId}`,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => response.data,
    }),

    // ✅ New API based on the curl command
    getRequirementsList: builder.query({
      query: (userType) => ({
        url: `/requirements/get-parents-tutors-list?userType=${userType}`,
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => response.data,
    }),

    updateUserDetails: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/update-user-details/${userId}`,
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),

    updateTutorProfile: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `/users/update-user-details/${userId}`,
        method: "PATCH",
        body: {
          ...data,
          userType: "tutor"
        },
      }),
      invalidatesTags: ["User"],
    }),

    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/users/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/users/verify-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetUserQuery, 
  useGetUserPostsQuery, 
  useGetRequirementsListQuery,
  useUpdateUserDetailsMutation,
  useUpdateTutorProfileMutation,
  useVerifyOTPMutation,
  useVerifyEmailMutation
} = userSlice;
