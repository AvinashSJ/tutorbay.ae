"use client";
import Link from "next/link";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import { useGetAllTutorsQuery } from "@/redux/services/userSlice";
import placeholder from "@/assets/images/placeholder.png";
import { useState } from "react";
import MatchScoreBadge from "@/components/shared/matching/MatchScoreBadge";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const TutorCard = ({ tutor, matchScore }) => {
  const { tutorProfile, fullName, id: userId } = tutor;
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
      {matchScore !== undefined && (
        <div className="absolute top-3 right-3">
          <MatchScoreBadge score={matchScore} />
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-lightGrey7 flex-shrink-0">
          <img
            src={tutor.profileImage || placeholder.src}
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
        href={`/instructor-profile`}
        className="mt-4 block w-full text-center py-2 px-4 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition-all duration-300"
      >
        View Profile
      </Link>
    </div>
  );
};

const CoursesFilter2 = () => {
  const [isHovering, setIsHovering] = useState(false);

  const { data: allTutors, isLoading, isError } = useGetAllTutorsQuery();

  const displayTutors = allTutors?.map((t) => ({ tutor: t, matchScore: undefined })) || [];

  return (
    <section className="py-30px lg:py-50px">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <SectionName>Our Tutors</SectionName>
            <HeadingPrimary
              text="Find Expert Tutors"
            />
          </div>
          <div className="mt-4 lg:mt-0">
            <ButtonPrimary color="secondary" path="/tutors" arrow={true}>
              All Tutors
            </ButtonPrimary>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : isError ? (
          <div className="min-h-[200px] flex items-center justify-center text-red-500">
            Unable to load tutors. Please try again later.
          </div>
        ) : displayTutors.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
            No tutors available at the moment.
          </div>
        ) : (
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
                animation: `marquee 40s linear infinite`,
                animationPlayState: isHovering ? "paused" : "running",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {[...displayTutors.slice(0, 10), ...displayTutors.slice(0, 10)].map(({ tutor, matchScore }, i) => (
                <div key={`${tutor.id}-${i}`} className="min-w-[320px] max-w-[320px] flex-shrink-0">
                  <TutorCard tutor={tutor} matchScore={matchScore} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesFilter2;
