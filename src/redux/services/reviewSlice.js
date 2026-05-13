// redux/services/reviewSlice.js
// Reviews & ratings via Supabase PostgREST.
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSupabase } from '@/libs/supabase';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    // Get all reviews for a user (as reviewee)
    getReviewsForUser: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('Review')
          .select('*, reviewer:reviewerId(fullName, email)')
          .eq('revieweeId', userId)
          .order('createdAt', { ascending: false });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ['Reviews'],
    }),

    // Check if a review already exists for a given reviewer/reviewee/requirement
    checkExistingReview: builder.query({
      async queryFn({ reviewerId, revieweeId, requirementId }) {
        if (!reviewerId || !revieweeId || !requirementId) return { data: null };
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('Review')
          .select('id, rating, review, createdAt')
          .eq('reviewerId', reviewerId)
          .eq('revieweeId', revieweeId)
          .eq('requirementId', requirementId)
          .maybeSingle();
        if (error && error.code !== 'PGRST116') return { error: { status: 500, data: error.message } };
        return { data };
      },
    }),

    // Add a review
    addReview: builder.mutation({
      async queryFn({ reviewerId, revieweeId, requirementId, rating, review }) {
        const supabase = getSupabase();
        const { error } = await supabase
          .from('Review')
          .insert({ reviewerId, revieweeId, requirementId, rating, review });
        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetReviewsForUserQuery,
  useCheckExistingReviewQuery,
  useAddReviewMutation,
} = reviewApi;
