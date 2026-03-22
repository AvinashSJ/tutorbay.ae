"use client";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Testimonials3 from "@/components/sections/testimonials/Testimonials3";
import React from "react";
import { useGetUserQuery } from "@/redux/services/userSlice";
import moment from "moment";
import Image from "next/image";
import placeholder from "@/assets/images/placeholder.png";

const InstructorDetailsMain = ({ id }) => {
  const { data: tutor, error, isLoading } = useGetUserQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        Error loading tutor details. Please try again later.
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        Tutor not found.
      </div>
    );
  }

  return (
    <>
      <HeroPrimary
        path={"Tutor Profile"}
        title={`${tutor.firstName} ${tutor.lastName}`}
      />

      <section className="py-30px lg:py-50px">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30px">
            {/* Tutor Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-md p-6">
                <div className="relative h-64 w-full mb-6">
                  <Image
                    src={tutor.profileImage || placeholder}
                    alt={`${tutor.firstName} ${tutor.lastName}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-4">
                  {tutor.firstName} {tutor.lastName}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Contact Information
                    </h3>
                    <p className="text-contentColor dark:text-contentColor-dark">
                      <i className="icofont-envelope mr-2"></i>
                      {tutor.email}
                    </p>
                    <p className="text-contentColor dark:text-contentColor-dark mt-2">
                      <i className="icofont-phone mr-2"></i>
                      {tutor.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Teaching Details
                    </h3>
                    <p className="text-contentColor dark:text-contentColor-dark">
                      <strong>Mode:</strong>{" "}
                      {tutor.tutorProfile?.modeOfTeaching || "Not specified"}
                    </p>
                    <p className="text-contentColor dark:text-contentColor-dark mt-2">
                      <strong>Qualification:</strong>{" "}
                      {tutor.tutorProfile?.highestQualification ||
                        "Not specified"}
                    </p>
                    <p className="text-contentColor dark:text-contentColor-dark mt-2">
                      <strong>Hourly Rate:</strong> AED{" "}
                      {tutor.tutorProfile?.expectedFeePerHour ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutor Details */}
            <div className="lg:col-span-2">
              <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-blackColor dark:text-blackColor-dark mb-4">
                  About
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tutor.tutorProfile?.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="bg-primaryColor bg-opacity-10 text-primaryColor px-3 py-1 rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Availability
                    </h4>
                    <div className="space-y-2">
                      {tutor.tutorProfile?.availability?.map((slot, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
                        >
                          <p className="text-contentColor dark:text-contentColor-dark">
                            <strong>{slot.days}:</strong> {slot.startTime} -{" "}
                            {slot.endTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <Testimonials3 id={id} isInsTructorDetails={true} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstructorDetailsMain;
