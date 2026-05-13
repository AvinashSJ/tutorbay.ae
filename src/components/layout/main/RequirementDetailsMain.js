"use client";

import CourseDetailsPrimary from "@/components/sections/course-details/CourseDetailsPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import InterestedTutors from "@/components/shared/matching/InterestedTutors";
import React, { useEffect, useState } from "react";
import { useGetRequirementByIdQuery } from "@/redux/services/userSlice";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { trackRequirementView } from "@/services/analytics";
import { getSupabase } from "@/libs/supabase";

const RequirementDetailsMain = ({ id }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isUnlockedByTutor, setIsUnlockedByTutor] = useState(false);
  const { data: requirement, error, isLoading } = useGetRequirementByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (!requirement) return;
    const init = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      trackRequirementView(requirement, user?.id || null);
      // Check if any tutor has unlocked this requirement's contact
      const { data: unlocked } = await supabase.rpc("has_requirement_been_unlocked", { p_requirement_id: id });
      setIsUnlockedByTutor(!!unlocked);
    };
    init();
  }, [requirement, id]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !requirement || requirement?.error) {
    return (
      <PageWrapper>
        <div className="min-h-[400px] flex items-center justify-center text-red-500 text-center p-8">
          {error?.data || requirement?.error || "Failed to load requirement."}
        </div>
      </PageWrapper>
    );
  }

  const isOwner = currentUserId && requirement.ownerId === currentUserId;

  return (
    <PageWrapper>
      <HeroPrimary path={"Requirement"} title={requirement.title || requirement.subject} />
      <CourseDetailsPrimary requirement={requirement} />
      {isOwner && (
        <section>
          <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
            {isUnlockedByTutor && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-5 py-4 text-green-700 dark:text-green-300 text-sm font-medium">
                <i className="icofont-eye-alt text-lg" /> Your contact details have been viewed by tutor(s).
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
              <div className="lg:col-start-1 lg:col-span-8">
                <InterestedTutors requirementId={id} isOwner={isOwner} />
              </div>
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
};

export default RequirementDetailsMain;