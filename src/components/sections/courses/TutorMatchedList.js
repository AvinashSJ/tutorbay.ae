"use client";
import { useFindMatchingRequirementsQuery } from "@/redux/services/userSlice";
import RequirementCard from "@/components/shared/cards/RequirementCard";
import RequirementActions from "@/components/shared/requirements/RequirementActions";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

const renderCards = (items) =>
  items.map((req) => (
    <div key={req.id} className="min-w-[320px] max-w-[320px] flex-shrink-0">
      <div className="relative flex flex-col">
        <RequirementCard
          requirement={{
            _id: req.id,
            subject: req.subject,
            location: req.area || "",
            modeOfTeaching: req.tuitionType,
            status: "active",
            createdAt: req.createdAt ?? req.publishedAt,
            matchScore: req.matchScore,
          }}
        />
        <RequirementActions requirementId={req.id} />
      </div>
    </div>
  ));

const TutorMatchedList = ({ variant }) => {
  const { userId } = useUser();
  const { data: matched, error, isLoading } = useFindMatchingRequirementsQuery(userId, { skip: !userId });
  const [isHovering, setIsHovering] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-red-500">
        Error loading matched requirements.
      </div>
    );
  }

  if (!matched?.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No matching requirements found for your subjects.
      </div>
    );
  }

  if (variant === "marquee") {
    return (
      <div
        className="-mx-4 px-4 py-30px"
        style={{
          overflowX: "clip",
          maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className="flex gap-30px w-max"
          style={{
            animation: "marquee 40s linear infinite",
            animationPlayState: isHovering ? "paused" : "running",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {renderCards([...matched, ...matched])}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-4">
        Showing {matched.length} requirement{matched.length !== 1 ? "s" : ""} matched to your tutoring profile, ranked by best fit.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {matched.map((req) => (
          <div key={req.id} className="relative flex flex-col">
            <RequirementCard
              requirement={{
                _id: req.id,
                subject: req.subject,
                area: req.area,
                tuitionType: req.tuitionType,
                additionalNotes: req.notes,
                status: "active",
                createdAt: req.createdAt ?? req.publishedAt,
                matchScore: req.matchScore,
              }}
            />
            <RequirementActions requirementId={req.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorMatchedList;
