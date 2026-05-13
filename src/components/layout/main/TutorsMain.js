"use client";
import { useState } from "react";
import Link from "next/link";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import { useGetAllTutorsQuery } from "@/redux/services/userSlice";
import Pagination from "@/components/shared/pagination/Pagination";
import placeholder from "@/assets/images/placeholder.png";

const TutorCard = ({ tutor }) => {
  const { tutorProfile, fullName, id: userId, profileImage } = tutor;
  const subjectsList = tutorProfile?.subjects || [];
  const subjectsDisplay = Array.isArray(subjectsList) ? subjectsList.join(", ") : subjectsList;
  const availability = tutorProfile?.availability || [];
  const availabilityDisplay = Array.isArray(availability) && availability.length > 0
    ? availability.slice(0, 2).map(s => `${s.days}: ${s.startTime}-${s.endTime}`).join(", ")
    : null;
  const bio = tutorProfile?.bio || null;
  const expectedFeePerHour = tutorProfile?.expectedFeePerHour;
  const modeOfTeaching = tutorProfile?.modeOfTeaching;

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-xl shadow-dropdown-secodary p-30px group hover:shadow-lg transition-all duration-300 hover:-translate-y-5px flex flex-col h-full relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-lightGrey7 flex-shrink-0">
          <img
            src={profileImage || placeholder.src}
            alt={fullName || "Tutor"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-size-22 font-semibold text-blackColor dark:text-blackColor-dark truncate">
            {fullName || "Tutor"}
          </h4>
          {modeOfTeaching && (
            <span className="text-sm text-primaryColor font-medium capitalize">{modeOfTeaching}</span>
          )}
        </div>
      </div>

      {bio && (
        <p className="text-sm text-contentColor dark:text-contentColor-dark mb-4 line-clamp-2">{bio}</p>
      )}

      <div className="space-y-3 flex-grow">
        {subjectsDisplay && (
          <div>
            <span className="text-xs font-semibold text-blackColor dark:text-blackColor-dark block mb-1">Subjects</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(subjectsList) ? subjectsList.map((s, i) => (
                <span key={i} className="text-xs bg-primaryColor bg-opacity-10 text-primaryColor px-2 py-0.5 rounded">{s}</span>
              )) : (
                <span className="text-xs text-contentColor">{subjectsDisplay}</span>
              )}
            </div>
          </div>
        )}

        {availabilityDisplay && (
          <div>
            <span className="text-xs font-semibold text-blackColor dark:text-blackColor-dark block mb-1">Availability</span>
            <p className="text-xs text-contentColor dark:text-contentColor-dark">{availabilityDisplay}</p>
          </div>
        )}

        {expectedFeePerHour && (
          <div>
            <span className="text-xs font-semibold text-blackColor dark:text-blackColor-dark block mb-1">Expected Fee</span>
            <p className="text-sm font-semibold text-primaryColor">AED {expectedFeePerHour}/hr</p>
          </div>
        )}
      </div>

      <Link
        href={`/tutors/${userId}`}
        className="mt-4 block w-full text-center py-2 px-4 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition-all duration-300"
      >
        View Profile
      </Link>
    </div>
  );
};

const ITEMS_PER_PAGE = 12;

const TutorsMain = () => {
  const { data: allTutors, isLoading, isError } = useGetAllTutorsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = allTutors ? Math.ceil(allTutors.length / ITEMS_PER_PAGE) : 0;
  const paginated = allTutors
    ? allTutors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeroPrimary path={"All Tutors"} title={"All Tutors"} />
      <section className="py-30px lg:py-50px">
        <div className="container">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
            </div>
          ) : isError ? (
            <div className="min-h-[400px] flex items-center justify-center text-red-500">
              Unable to load tutors. Please try again later.
            </div>
          ) : !allTutors?.length ? (
            <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
              No tutors available at the moment.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px">
                {paginated.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default TutorsMain;
