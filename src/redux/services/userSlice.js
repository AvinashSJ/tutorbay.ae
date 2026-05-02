// redux/services/userSlice.js
// Reads/writes go directly to Supabase PostgREST via baseQueryWithAuth.
// Table names match the Prisma schema (PascalCase, quoted by PostgREST).
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSupabase } from "@/libs/supabase";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "TutorProfile", "Requirements"],
  endpoints: (builder) => ({
    // Get own user profile from the User table
    getUser: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("User")
          .select(`
            id, email, fullName, phone, role, isActive, createdAt,
            tutorProfile:TutorProfile(subjects, areas, bio, isVerified),
            parentProfile:ParentProfile(area),
            studentProfile:StudentProfile(gradeLevel, area)
          `)
          .eq("id", userId)
          .single();
        if (error) return { error: { status: 404, data: error.message } };
        return { data };
      },
      providesTags: ["User"],
    }),

    // Get requirements owned by a user
    getUserPosts: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("Requirement")
          .select("id, title, subject, area, tuitionType, status, publishedAt, createdAt")
          .eq("ownerId", userId)
          .order("createdAt", { ascending: false });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ["Requirements"],
    }),

    // Get all published requirements (tutor browsing feed)
    getRequirementsList: builder.query({
      async queryFn() {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("Requirement")
          .select("id, title, subject, area, tuitionType, status, publishedAt, createdAt")
          .eq("status", "PUBLISHED")
          .order("publishedAt", { ascending: false });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ["Requirements"],
    }),

    // Update user core fields
    updateUserDetails: builder.mutation({
      async queryFn({ userId, data }) {
        const supabase = getSupabase();
        const { error } = await supabase
          .from("User")
          .update({ ...data, updatedAt: new Date().toISOString() })
          .eq("id", userId);
        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ["User"],
    }),

    // Upsert tutor profile (subjects, areas, bio)
    updateTutorProfile: builder.mutation({
      async queryFn({ userId, subjects, areas, bio }) {
        const supabase = getSupabase();
        const { error } = await supabase
          .from("TutorProfile")
          .upsert({ userId, subjects, areas, bio, updatedAt: new Date().toISOString() }, { onConflict: "userId" });
        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ["TutorProfile", "User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserPostsQuery,
  useGetRequirementsListQuery,
  useUpdateUserDetailsMutation,
  useUpdateTutorProfileMutation,
} = userSlice;
