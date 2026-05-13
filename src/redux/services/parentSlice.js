// redux/services/parentSlice.js
// Requirements management via Supabase PostgREST + Edge Functions.
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSupabase } from "@/libs/supabase";

export const parentSlice = createApi({
  reducerPath: "parentApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Requirements"],
  endpoints: (builder) => ({
    // Create a requirement as DRAFT
    createRequirement: builder.mutation({
      async queryFn(payload) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const { data, error } = await supabase
          .from("Requirement")
          .insert({
            id: crypto.randomUUID(),
            ownerId: user.id,
            ownerRole: user.app_metadata?.role ?? user.user_metadata?.role ?? "PARENT",
            title: payload.title ?? payload.subject,
            subject: payload.subject,
            area: payload.area ?? payload.city ?? "",
            tuitionType: payload.modeOfTeaching === "online" ? "ONLINE" :
                         payload.modeOfTeaching === "home"   ? "HOME"   : "INSTITUTE",
            notes: payload.notes ?? null,
            status: "DRAFT",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Update a requirement
    updateRequirement: builder.mutation({
      async queryFn({ id, ...payload }) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const updates = {
          title: payload.title ?? payload.subject,
          subject: payload.subject,
          area: payload.area ?? payload.city ?? "",
          tuitionType: payload.modeOfTeaching === "online" ? "ONLINE" :
                       payload.modeOfTeaching === "home"   ? "HOME"   : "INSTITUTE",
          notes: payload.notes ?? null,
          updatedAt: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("Requirement")
          .update(updates)
          .eq("id", id)
          .eq("ownerId", user.id)
          .select()
          .single();

        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Delete a requirement
    deleteRequirement: builder.mutation({
      async queryFn(requirementId) {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: { status: 401, data: "Not authenticated" } };

        const { error } = await supabase
          .from("Requirement")
          .delete()
          .eq("id", requirementId)
          .eq("ownerId", user.id);

        if (error) return { error: { status: 500, data: error.message } };
        return { data: { success: true } };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Publish a requirement (calls Edge Function which also triggers matching)
    publishRequirement: builder.mutation({
      async queryFn(requirementId) {
        const supabase = getSupabase();
        const { data, error } = await supabase.functions.invoke("requirements-publish", {
          body: { requirementId },
        });
        if (error) return { error: { status: 500, data: error.message } };
        return { data };
      },
      invalidatesTags: ["Requirements"],
    }),

    // Get requirements by current user
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
  }),
});

export const {
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
  usePublishRequirementMutation,
  useGetUserPostsQuery,
} = parentSlice;
