import React from "react";
import Link from "next/link";

const STATUS_BADGE = {
  DRAFT: { label: "Draft", cls: "bg-orange text-white" },
  PUBLISHED: { label: "Published", cls: "bg-blue text-white" },
  OPEN: { label: "Active", cls: "bg-greencolor2 text-white" },
  CLOSED: { label: "Closed", cls: "bg-secondaryColor text-white" },
  CANCELLED: { label: "Cancelled", cls: "bg-red text-white" },
};

const RequirementCard = ({ requirement, type, applicantCount, onMailboxClick }) => {
  const { id, title, subject, area, tuitionType, status, createdAt } = requirement;
  const badge = STATUS_BADGE[status] || { label: status, cls: "bg-gray text-white" };

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark leading-tight flex-1">
          <Link
            href={`/parent-requirements/${id}`}
            className="hover:text-primaryColor transition-2"
          >
            {title || subject}
          </Link>
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-contentColor dark:text-contentColor-dark">
        {subject && (
          <span>
            <span className="font-medium">Subject:</span> {subject}
          </span>
        )}
        {area && (
          <span>
            <span className="font-medium">Area:</span> {area}
          </span>
        )}
        {tuitionType && (
          <span>
            <span className="font-medium">Type:</span> {tuitionType}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-borderColor dark:border-borderColor-dark">
        <span className="text-xs text-contentColor dark:text-contentColor-dark">
          Posted {createdAt}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onMailboxClick?.(id)}
            className="relative flex items-center gap-1.5 text-sm font-semibold text-primaryColor hover:text-primaryColor/80 transition-2"
          >
            <i className="icofont-envelope text-lg" />
            {applicantCount > 0 && (
              <span className="absolute -top-2.5 -right-3 bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold leading-none">
                {applicantCount}
              </span>
            )}
            <span className="text-xs text-contentColor ml-1">View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementCard;
