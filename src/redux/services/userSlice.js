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
        console.log("getUser called with userId:", userId);
        const { data, error } = await supabase
          .from("User")
          .select(`
            id, email, fullName, phone, role, isActive, createdAt, emiratesId, profileImage, backgroundImage,
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
        console.log("getUser result - data:", data, "error:", error);
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
    // Uses SECURITY DEFINER RPC so anon users can browse
    getRequirementsListPublic: builder.query({
      async queryFn() {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("get_published_requirements");
        if (error) return { error: { status: 500, data: error.message } };
        return { data: (data || []).map(r => ({
          _id: r.id,
          subject: r.subject,
          area: r.area,
          tuitionType: r.tuitionType,
          additionalNotes: r.notes,
          status: r.status === "PUBLISHED" ? "active" : (r.status || "").toLowerCase(),
          createdAt: r.publishedAt ?? r.createdAt,
        })) };
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
          const { phone, ...profileDataWithoutPersonal } = profileData;
          
          const locationData = profileDataWithoutPersonal.location ? {
            currentLocationURL: profileDataWithoutPersonal.location.currentLocationURL || '',
            mapLocation: profileDataWithoutPersonal.location.mapLocation || []
          } : undefined;
          
          const currentHistory = existingProfile.applicationHistory || [];
          const updateData = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            nationality: profileDataWithoutPersonal.nationality,
            highestQualification: profileDataWithoutPersonal.highestQualification,
            modeOfTeaching: profileDataWithoutPersonal.modeOfTeaching,
            expectedFeePerHour: profileDataWithoutPersonal.expectedFeePerHour,
            hasPrivateTutorLicense: profileDataWithoutPersonal.hasPrivateTutorLicense,
            emirateId: profileDataWithoutPersonal.emirateId,
            subjects: profileDataWithoutPersonal.subjects || [],
            areas: profileDataWithoutPersonal.areas || [],
            bio: profileDataWithoutPersonal.bio,
            availability: profileDataWithoutPersonal.availability || [],
            applicationStatus: TUTOR_APPLICATION_STATUS.PENDING_REVIEW,
            applicationHistory: [...currentHistory, applicationHistoryEntry],
            updatedAt: now,
          };
          
          if (locationData) {
            updateData.location = locationData;
          }
          
          console.log("Updating profile with:", updateData);
          const { error } = await supabase
            .from("TutorProfile")
            .update(updateData)
            .eq("userId", userId);
          if (error) {
            console.error("Update error:", error);
            return { error: { status: 500, data: error.message } };
          }
        } else {
          // Create new profile with pending review status
          const { phone, ...profileDataWithoutPersonal } = profileData;
          
          // Flatten location object to match DB schema
          const locationData = profileDataWithoutPersonal.location ? {
            currentLocationURL: profileDataWithoutPersonal.location.currentLocationURL || '',
            mapLocation: profileDataWithoutPersonal.location.mapLocation || []
          } : { currentLocationURL: '', mapLocation: [] };
          
          const insertData = {
            userId,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            nationality: profileDataWithoutPersonal.nationality,
            highestQualification: profileDataWithoutPersonal.highestQualification,
            modeOfTeaching: profileDataWithoutPersonal.modeOfTeaching,
            expectedFeePerHour: profileDataWithoutPersonal.expectedFeePerHour,
            hasPrivateTutorLicense: profileDataWithoutPersonal.hasPrivateTutorLicense,
            emirateId: profileDataWithoutPersonal.emirateId,
            subjects: profileDataWithoutPersonal.subjects || [],
            areas: profileDataWithoutPersonal.areas || [],
            bio: profileDataWithoutPersonal.bio,
            availability: profileDataWithoutPersonal.availability || [],
            location: locationData,
            applicationStatus: TUTOR_APPLICATION_STATUS.PENDING_REVIEW,
            applicationHistory: [applicationHistoryEntry],
            createdAt: now,
            updatedAt: now,
          };
          
          console.log("Inserting profile with:", insertData);
          const { error } = await supabase
            .from("TutorProfile")
            .insert(insertData);
          if (error) {
            console.error("Insert error:", error);
            return { error: { status: 500, data: error.message } };
          }
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
          .select("applicationStatus, adminNotes, applicationHistory, updatedAt, approvedNotified")
          .eq("userId", userId)
          .single();
        if (error) {
          // Column might not exist yet (migration not applied) — fallback
          if (error.message?.includes("approvedNotified")) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("TutorProfile")
              .select("applicationStatus, adminNotes, applicationHistory, updatedAt")
              .eq("userId", userId)
              .single();
            if (fallbackError) return { error: { status: 404, data: fallbackError.message } };
            return { data: { ...fallbackData, approvedNotified: false } };
          }
          return { error: { status: 404, data: error.message } };
        }
        return { data };
      },
      providesTags: ["TutorProfile"],
    }),

    // Mark approved notification as seen (first-time card shown)
    markApprovedNotified: builder.mutation({
      async queryFn(userId) {
        const supabase = getSupabase();
        const { error } = await supabase
          .from("TutorProfile")
          .update({ approvedNotified: true, updatedAt: new Date().toISOString() })
          .eq("userId", userId);
        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ["TutorProfile"],
    }),

    // Save tutor form data as draft (preserves current status)
    saveTutorDraft: builder.mutation({
      async queryFn({ userId, profileData }) {
        const supabase = getSupabase();
        const now = new Date().toISOString();

        const { phone, ...profileDataWithoutPersonal } = profileData;

        const locationData = profileDataWithoutPersonal.location ? {
          currentLocationURL: profileDataWithoutPersonal.location.currentLocationURL || '',
          mapLocation: profileDataWithoutPersonal.location.mapLocation || []
        } : { currentLocationURL: '', mapLocation: [] };

        const upsertData = {
          userId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          nationality: profileDataWithoutPersonal.nationality,
          highestQualification: profileDataWithoutPersonal.highestQualification,
          modeOfTeaching: profileDataWithoutPersonal.modeOfTeaching,
          expectedFeePerHour: profileDataWithoutPersonal.expectedFeePerHour,
          hasPrivateTutorLicense: profileDataWithoutPersonal.hasPrivateTutorLicense,
          emirateId: profileDataWithoutPersonal.emirateId,
          subjects: profileDataWithoutPersonal.subjects || [],
          areas: profileDataWithoutPersonal.areas || [],
          bio: profileDataWithoutPersonal.bio,
          availability: profileDataWithoutPersonal.availability || [],
          location: locationData,
          updatedAt: now,
        };

        const { error } = await supabase
          .from("TutorProfile")
          .upsert(upsertData, { onConflict: "userId" });

        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ["TutorProfile", "User"],
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

    // Get single requirement by ID via RPC
    getRequirementById: builder.query({
      async queryFn(id) {
        if (!id) return { error: { status: 400, data: "Invalid requirement ID" } };
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("get_requirement_by_id", { p_id: String(id) });
        if (error) return { error: { status: 500, data: error.message } };
        if (data?.error) return { error: { status: 404, data: data.error } };
        return { data };
      },
      providesTags: ["Requirements"],
    }),

    // Find matching tutors for a requirement (by subject, area, mode, fee, emirate)
    findMatchingTutors: builder.query({
      async queryFn(filters) {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("find_matching_tutors", filters);
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ["TutorProfile"],
    }),

    // Find matching requirements for a tutor (by tutor's subjects, areas, mode)
    findMatchingRequirements: builder.query({
      async queryFn(tutorId) {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("find_matching_requirements", { p_tutorid: tutorId });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      providesTags: ["Requirements"],
    }),

    // Get tutor's existing requirement matches (applied status)
    getTutorRequirementMatches: builder.query({
      async queryFn(tutorId) {
        if (!tutorId) return { error: { status: 400, data: "Missing tutor ID" } };
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("get_tutor_requirement_matches", { p_tutor_id: tutorId });
        if (error) return { error: { status: 500, data: error.message } };
        return { data: data || [] };
      },
      providesTags: ["Requirements"],
    }),

    // Tutor applies to a requirement — creates RequirementMatch
    tutorApplyToRequirement: builder.mutation({
      async queryFn({ requirementId, notes }) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const { data, error } = await supabase.rpc("tutor_apply_to_requirement", {
          p_requirement_id: requirementId,
          p_tutor_id: user.id,
          p_notes: notes || null,
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Schedule a match session (demo/visit)
    scheduleMatchSession: builder.mutation({
      async queryFn({ matchId, scheduledAt, sessionType, locationUrl, meetingLink }) {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("schedule_match_session", {
          p_match_id: matchId,
          p_scheduled_at: scheduledAt,
          p_session_type: sessionType,
          p_location_url: locationUrl || null,
          p_meeting_link: meetingLink || null,
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Get all matches for a requirement (used by parents/owners)
    getRequirementMatches: builder.query({
      async queryFn(requirementId) {
        if (!requirementId) return { error: { status: 400, data: "Invalid requirement ID" } };
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("admin_get_requirement_matches", {
          p_requirement_id: requirementId,
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data: data || [] };
      },
      providesTags: ["Requirements"],
    }),

    // Submit feedback for a completed session (parent rates tutor)
    submitSessionFeedback: builder.mutation({
      async queryFn({ sessionId, feedback, rating, outcome }) {
        const supabase = getSupabase();
        const { data, error } = await supabase.rpc("submit_session_feedback", {
          p_session_id: sessionId,
          p_feedback: feedback,
          p_rating: rating,
          p_outcome: outcome,
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUserPostsQuery,
  useGetRequirementsListPublicQuery,
  useUpdateUserDetailsMutation,
  useUpdateTutorProfileMutation,
  useSubmitTutorApplicationMutation,
  useGetTutorApplicationStatusQuery,
  useGetAllTutorsQuery,
  useGetRequirementByIdQuery,
  useFindMatchingTutorsQuery,
  useFindMatchingRequirementsQuery,
  useGetTutorRequirementMatchesQuery,
  useTutorApplyToRequirementMutation,
  useScheduleMatchSessionMutation,
  useGetRequirementMatchesQuery,
  useSubmitSessionFeedbackMutation,
  useMarkApprovedNotifiedMutation,
  useSaveTutorDraftMutation,
} = userSlice;
