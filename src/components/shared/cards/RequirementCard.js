"use client";
import Link from "next/link";
import moment from "moment";
import MatchScoreBadge from "@/components/shared/matching/MatchScoreBadge";

const RequirementCard = ({ requirement }) => {
  const {
    _id,
    subject,
    curriculum,
    grade,
    location,
    modeOfTeaching,
    expectedFeePerHour,
    availability,
    additionalNotes,
    status,
    createdAt,
    matchScore,
  } = requirement;

  const area = typeof location === "string" ? location : location?.currentLocationURL || location?.area || "";
  const hasCurriculum = curriculum || grade;

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-xl shadow-dropdown-secodary group hover:shadow-lg transition-all duration-300 hover:-translate-y-5px flex flex-col overflow-hidden h-[400px]">
      <div className="p-30px flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark leading-tight truncate">
              {subject || "Untitled"}
            </h3>
            {matchScore !== undefined && (
              <div className="shrink-0">
                <MatchScoreBadge score={matchScore} />
              </div>
            )}
          </div>
          {hasCurriculum && (
            <p className="text-xs text-contentColor dark:text-contentColor-dark mt-0.5 truncate">
              {curriculum || "—"} - Grade {grade || "—"}
            </p>
          )}
        </div>

        <div className="space-y-3 overflow-hidden flex-shrink min-h-0">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-contentColor dark:text-contentColor-dark min-w-0">
              <i className="icofont-location-pin text-primaryColor shrink-0"></i>
              <span className="truncate">{area || "Location not specified"}</span>
            </div>
            <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full capitalize shrink-0">
              {modeOfTeaching || "Not specified"}
            </span>
          </div>

          <div className="bg-primaryColor bg-opacity-10 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-contentColor dark:text-contentColor-dark">Fee:</span>
              <span className="text-base font-semibold text-primaryColor">
                {expectedFeePerHour ? `AED ${expectedFeePerHour}/hr` : "Negotiable"}
              </span>
            </div>
          </div>

          {availability && availability.length > 0 && (
            <div className="text-sm text-contentColor dark:text-contentColor-dark">
              <span className="font-semibold">Available: </span>
              {availability.slice(0, 2).map((s, i) => (
                <span key={i}>{s.days} {i < Math.min(availability.length, 2) - 1 ? ", " : ""}</span>
              ))}
            </div>
          )}

          {additionalNotes && (
            <p className="text-sm text-contentColor dark:text-contentColor-dark line-clamp-3 leading-relaxed">
              {additionalNotes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-contentColor dark:text-contentColor-dark">
              Posted {moment(createdAt).fromNow()}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
            }`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
            </span>
          </div>
          <Link
            href={`/parent-requirements/${_id}`}
            className="block w-full text-center py-2 px-4 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition-all duration-300 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequirementCard;
