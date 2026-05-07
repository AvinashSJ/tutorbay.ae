"use client";
import Link from "next/link";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import { useGetAllTutorsQuery } from "@/redux/services/userSlice";
import placeholder from "@/assets/images/placeholder.png";
import Image from "next/image";

const TutorCard = ({ tutor }) => {
  const { tutorProfile, fullName, id: userId } = tutor;
  const subjects = tutorProfile?.subjects || [];
  const subjectsDisplay = Array.isArray(subjects) ? subjects.join(", ") : subjects;
  const availability = tutorProfile?.availability || [];
  const availabilityDisplay = Array.isArray(availability) && availability.length > 0
    ? availability.slice(0, 2).map(s => `${s.days}: ${s.startTime}-${s.endTime}`).join(", ")
    : null;
  const bio = tutorProfile?.bio || null;
  const expectedFeePerHour = tutorProfile?.expectedFeePerHour;
  const modeOfTeaching = tutorProfile?.modeOfTeaching;

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-xl shadow-dropdown-secodary p-30px group hover:shadow-lg transition-all duration-300 hover:-translate-y-5px flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-lightGrey7 flex-shrink-0">
          <Image
            src={tutor.profileImage || placeholder}
            alt={fullName || "Tutor"}
            width={64}
            height={64}
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
              {Array.isArray(subjects) ? subjects.map((s, i) => (
                <span key={i} className="text-xs bg-primaryColor bg-opacity-10 text-primaryColor px-2 py-0.5 rounded">{s}</span>
              )) : (
                <span className="text-xs text-contentColor">{subjectsDisplay}</span>
              )}
            </div>
          </div>
        )}

        {expectedFeePerHour && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blackColor dark:text-blackColor-dark">Fee</span>
            <span className="text-lg font-bold text-primaryColor">AED {expectedFeePerHour}/hr</span>
          </div>
        )}

        {availabilityDisplay && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blackColor dark:text-blackColor-dark">Availability</span>
            <span className="text-xs text-contentColor text-right">{availabilityDisplay}</span>
          </div>
        )}
      </div>

      <Link
        href={`/tutors/${userId}`}
        className="mt-4 block w-full text-center py-2.5 px-4 bg-primaryColor text-whiteColor rounded-lg hover:bg-opacity-90 transition-all duration-300 text-sm font-medium"
      >
        View Profile
      </Link>
    </div>
  );
};

const CoursesFilter2 = () => {
  const { data: tutors, error, isLoading } = useGetAllTutorsQuery();

  return (
    <section>
      <div className="pt-50px pb-10 md:pt-70px md:pb-50px lg:pt-20 2xl:pt-100px 2xl:pb-70px bg-lightGrey7 dark:bg-lightGrey7-dark">
        <div className="container">
          <div className="mb-5 md:mb-10" data-aos="fade-up">
            <div className="text-center">
              <SectionName>Find Tutors</SectionName>
            </div>
            <HeadingPrimary text="center">
              Find Your Perfect{" "}
              <span className="relative after:w-full after:h-[7px] z-0 after:bg-pink-400 after:absolute after:left-0 after:bottom-3 md:after:bottom-5 after:z-[-1]">
                Tutor
              </span>
              <br />
              For Your Needs
            </HeadingPrimary>
          </div>

          {isLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
            </div>
          ) : error ? (
            <div className="min-h-[300px] flex items-center justify-center text-red-500">
              <p>Error loading tutors.</p>
              <p className="text-sm mt-2 opacity-75">{error?.data || "Please try again later."}</p>
            </div>
          ) : !tutors?.length ? (
            <div className="min-h-[300px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
              No tutors found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-30px">
              {tutors.map((tutor) => (
                <div key={tutor.id} data-aos="fade-up">
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter2;
