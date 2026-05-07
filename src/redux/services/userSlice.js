// redux/services/userSlice.js
// Reads/writes go directly to Supabase PostgREST via baseQueryWithAuth.
// Table names match the Prisma schema (PascalCase, quoted by PostgREST).
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSupabase } from "@/libs/supabase";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

// Tutor application status constants
export const TUTOR_APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  ADDITIONAL_INFO_REQUIRED: 'ADDITIONAL_INFO_REQUIRED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

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
            tutorProfile:TutorProfile(
              subjects, areas, bio, isVerified, nationality, highestQualification,
              modeOfTeaching, expectedFeePerHour, hasPrivateTutorLicense,
              licenseDocumentUrl, availability, location, emirateId,
              applicationStatus
            ),
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

    // Submit tutor application with full profile data
    submitTutorApplication: builder.mutation({
      async queryFn({ userId, profileData }) {
        const supabase = getSupabase();
        const now = new Date().toISOString();

        // Check if tutor profile exists
        const { data: existingProfile } = await supabase
          .from("TutorProfile")
          .select("userId, applicationStatus")
          .eq("userId", userId)
          .single();

        const applicationHistoryEntry = {
          action: 'SUBMITTED',
          timestamp: now,
          status: TUTOR_APPLICATION_STATUS.PENDING_REVIEW,
        };

        if (existingProfile) {
          // Update existing profile and set status to pending review
          const { error } = await supabase
            .from("TutorProfile")
            .update({
              ...profileData,
              applicationStatus: TUTOR_APPLICATION_STATUS.PENDING_REVIEW,
              applicationHistory: supabase.rpc('append_to_jsonb_array', {
                input_array: existingProfile.applicationHistory || [],
                new_element: applicationHistoryEntry
              }),
              updatedAt: now,
            })
            .eq("userId", userId);
          if (error) return { error: { status: 500, data: error.message } };
        } else {
          // Create new profile with pending review status
          const { error } = await supabase
            .from("TutorProfile")
            .insert({
              userId,
              ...profileData,
              applicationStatus: TUTOR_APPLICATION_STATUS.PENDING_REVIEW,
              applicationHistory: [applicationHistoryEntry],
              createdAt: now,
              updatedAt: now,
            });
          if (error) return { error: { status: 500, data: error.message } };
        }

        return { data: { success: true, status: TUTOR_APPLICATION_STATUS.PENDING_REVIEW } };
      },
      invalidatesTags: ["TutorProfile", "User"],
    }),

    // Get tutor application status
    getTutorApplicationStatus: builder.query({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("TutorProfile")
          .select("applicationStatus, adminNotes, applicationHistory, updatedAt")
          .eq("userId", userId)
          .single();
        if (error) return { error: { status: 404, data: error.message } };
        return { data };
      },
      providesTags: ["TutorProfile"],
    }),

    // Get all tutors with their profiles
    // Uses RPC function to bypass RLS (public read)
    getAllTutors: builder.query({
      async queryFn() {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("get_all_tutors");
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserPostsQuery,
  useGetRequirementsListQuery,
  useUpdateUserDetailsMutation,
  useUpdateTutorProfileMutation,
  useSubmitTutorApplicationMutation,
  useGetTutorApplicationStatusQuery,
  useGetAllTutorsQuery,
} = userSlice;
