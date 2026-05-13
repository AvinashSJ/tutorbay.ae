"use client";

import CourseDetailsSidebar from "@/components/shared/courses/CourseDetailsSidebar";
import Image from "next/image";
import blogImag8 from "@/assets/images/blog/blog_8.png";
import BlogTagsAndSocila from "@/components/shared/blog-details/BlogTagsAndSocila";
import ClientComment from "@/components/shared/blog-details/ClientComment";
import CommentFome from "@/components/shared/forms/CommentFome";
import CourseDetailsTab from "@/components/shared/course-details/CourseDetailsTab";
import InstrutorOtherCourses from "@/components/shared/course-details/InstrutorOtherCourses";

const CourseDetailsPrimary = ({ requirement }) => {
  const {
    subject,
    title,
    ownerName,
    area,
    curriculum,
    grade,
    modeOfTeaching,
    expectedFeePerHour,
    availability,
    additionalNotes,
    status,
    createdAt,
  } = requirement || {};

  const gradeLabel = grade ? `Year ${grade}` : null;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const formatAvailability = (slots) => {
    if (!slots || !Array.isArray(slots) || slots.length === 0) return null;
    return slots.map((s) => `${s.days}: ${s.startTime}–${s.endTime}`).join(", ");
  };

  return (
    <section>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
            <div data-aos="fade-up">
              <div className="overflow-hidden relative mb-5">
                <Image
                  src={blogImag8}
                  alt={title || subject || "Requirement"}
                  className="w-full"
                  placeholder="blur"
                />
              </div>

              <div>
                <div
                  className="flex items-center justify-between flex-wrap gap-6 mb-30px"
                  data-aos="fade-up"
                >
                  <div className="flex items-center gap-6">
                    {curriculum && (
                      <button className="text-sm text-whiteColor bg-indigo border border-indigo px-22px py-0.5 leading-23px font-semibold hover:text-indigo hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-indigo">
                        {curriculum}
                      </button>
                    )}
                    {gradeLabel && (
                      <button className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-22px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block">
                        {gradeLabel}
                      </button>
                    )}
                  </div>
                  {formattedDate && (
                    <div>
                      <p className="text-sm text-contentColor dark:text-contentColor-dark font-medium">
                        Posted:{" "}
                        <span className="text-blackColor dark:text-blackColor-dark">
                          {formattedDate}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <h4
                  className="text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                  data-aos="fade-up"
                >
                  {title || `Need ${subject} Tutor`}
                </h4>

                <div
                  className="flex gap-5 flex-wrap items-center mb-30px"
                  data-aos="fade-up"
                >
                  {expectedFeePerHour ? (
                    <div className="text-size-21 font-medium text-primaryColor font-inter leading-25px">
                      AED {expectedFeePerHour}{" "}
                      <span className="text-sm text-lightGrey4 font-semibold">/hr</span>
                    </div>
                  ) : null}
                  {area && (
                    <div className="flex items-center">
                      <div>
                        <i className="icofont-location-pin pr-5px text-primaryColor text-lg"></i>
                      </div>
                      <span className="text-black dark:text-blackColor-dark">{area}</span>
                    </div>
                  )}
                  {modeOfTeaching && (
                    <div className="flex items-center">
                      <div>
                        <i className="icofont-computer pr-5px text-primaryColor text-lg"></i>
                      </div>
                      <span className="text-black dark:text-blackColor-dark capitalize">{modeOfTeaching}</span>
                    </div>
                  )}
                </div>

                {additionalNotes && (
                  <p
                    className="text-sm md:text-lg text-contentColor dark:contentColor-dark mb-25px !leading-30px"
                    data-aos="fade-up"
                  >
                    {additionalNotes}
                  </p>
                )}

                <div>
                  <h4
                    className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px"
                    data-aos="fade-up"
                  >
                    Requirement Details
                  </h4>

                  <div
                    className="bg-darkdeep3 dark:bg-darkdeep3-dark mb-30px grid grid-cols-1 md:grid-cols-2"
                    data-aos="fade-up"
                  >
                    <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Subject :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {subject || "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Parent Name :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {ownerName || "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Area :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {area || "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Mode :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium capitalize">
                            {modeOfTeaching || "—"}
                          </span>
                        </p>
                      </li>
                    </ul>
                    <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Curriculum :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {curriculum || "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Grade :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {gradeLabel || "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Fee/hr :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {expectedFeePerHour ? `AED ${expectedFeePerHour}` : "—"}
                          </span>
                        </p>
                      </li>
                      <li>
                        <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                          Status :
                          <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium">
                            {status ? status.replace(/_/g, " ") : "—"}
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>

                {availability && availability.length > 0 && (
                  <div className="mb-30px" data-aos="fade-up">
                    <h4
                      className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-15px"
                    >
                      Preferred Availability
                    </h4>
                    <div className="bg-darkdeep3 dark:bg-darkdeep3-dark p-5 rounded">
                      <div className="space-y-3">
                        {availability.map((slot, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 text-sm text-contentColor dark:text-contentColor-dark"
                          >
                            <i className="icofont-clock-time text-primaryColor text-lg" />
                            <span className="font-semibold text-primaryColor">{slot.days}</span>
                            <span>{slot.startTime} – {slot.endTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-5" data-aos="fade-up">
                  <h4 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px">
                    Additional Notes
                  </h4>
                  <p className="text-sm text-contentColor dark:text-contentColor-dark whitespace-pre-wrap">
                    {additionalNotes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-start-9 lg:col-span-4">
            <CourseDetailsSidebar requirement={requirement} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPrimary;