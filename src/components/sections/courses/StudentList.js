"use client";
import { useGetRequirementsListPublicQuery } from "@/redux/services/userSlice";
import RequirementCard from "@/components/shared/cards/RequirementCard";
import RequirementActions from "@/components/shared/requirements/RequirementActions";
import Pagination from "@/components/shared/pagination/Pagination";
import { useState, useEffect } from "react";

const modeLabels = { ONLINE: "Online", HOME: "Home tuitions", INSTITUTE: "Institute" };

const mapRequirement = (r) => ({
  _id: r._id,
  subject: r.subject,
  curriculum: "",
  grade: "",
  location: { currentLocationURL: r.area || "" },
  modeOfTeaching: modeLabels[r.tuitionType] || r.tuitionType || "Not specified",
  expectedFeePerHour: null,
  availability: [],
  additionalNotes: r.additionalNotes,
  status: r.status,
  createdAt: r.createdAt,
});

const sortRequirements = (list, sortInput) => {
  const sorted = [...list];
  switch (sortInput) {
    case "Title Ascending":
      sorted.sort((a, b) => (a.subject || "").localeCompare(b.subject || ""));
      break;
    case "Title Descending":
      sorted.sort((a, b) => (b.subject || "").localeCompare(a.subject || ""));
      break;
    case "Price Ascending":
    case "Price Descending":
      break;
    default:
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return sorted;
};

const renderCards = (items) =>
  items.map((item) => (
    <div key={item._id} className="min-w-[320px] max-w-[320px] flex-shrink-0">
      <div className="relative flex flex-col">
        <RequirementCard requirement={mapRequirement(item)} />
        <RequirementActions requirementId={item._id} />
      </div>
    </div>
  ));

const ITEMS_PER_PAGE = 9;

const StudentList = ({ sortInput, variant }) => {
  const { data: items, error, isLoading } = useGetRequirementsListPublicQuery();
  const [isHovering, setIsHovering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortInput]);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-red-500">
        Error loading requirements. Please try again later.
      </div>
    );
  }

  const sorted = sortRequirements(items || [], sortInput);
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (!sorted.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No student requirements found.
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
          {renderCards([...sorted, ...sorted])}
        </div>
      </div>
    );
  }

  return (
    <section className="py-30px lg:py-50px">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-30px">
          {paginated.map((item) => (
            <div key={item._id} className="relative flex flex-col">
              <RequirementCard requirement={mapRequirement(item)} />
              <RequirementActions requirementId={item._id} />
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
};

export default StudentList; 