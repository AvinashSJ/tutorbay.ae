"use client";
import Image from "next/image";
import placeholder from "@/assets/images/coursePlaceholder.svg";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaBook,
  FaLock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const ParentRequirementDetails = ({ params }) => {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedCourse");
      if (stored) setCourse(JSON.parse(stored));
    }
  }, []);
  console.log(course, "course");

  if (!course) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No data found for this requirement.
      </div>
    );
  }

  return (
    <PageWrapper>
      <section className="py-30px lg:py-50px">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="lg:w-1/3">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={course.image || placeholder}
                    alt={course.firstName || "Parent"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-2/3">
                <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-headingColor dark:text-headingColor-dark">
                  {course.title}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  {showContact ? (
                    <div className="flex items-center gap-2 text-contentColor dark:text-contentColor-dark">
                      <FaMapMarkerAlt className="text-primaryColor" />
                      <span>{course.location || "Location not specified"}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-contentColor dark:text-contentColor-dark">
                      <FaMapMarkerAlt className="text-primaryColor" />
                      <span>Unlock to view</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-contentColor dark:text-contentColor-dark">
                    <FaMoneyBillWave className="text-primaryColor" />
                    <span>
                      {Number.isFinite(course.price)
                        ? `${course.price.toFixed(2)} AED`
                        : course.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-contentColor dark:text-contentColor-dark">
                    <FaGraduationCap className="text-primaryColor" />
                    <span>{course.level || "Grade not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-contentColor dark:text-contentColor-dark">
                    <FaBook className="text-primaryColor" />
                    <span>{course.category || "Curriculum not specified"}</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-headingColor dark:text-headingColor-dark">
                    Parent Information
                  </h2>
                  {/* <p className="text-contentColor dark:text-contentColor-dark">
                    {course.instructor?.name}
                  </p> */}
                  {/* Contact Info Section */}
                  {!showContact ? (
                    <button
                      className="btn-primary mt-4 flex items-center gap-2"
                      onClick={() => setShowModal(true)}
                    >
                      <FaLock /> Unlock Contact Information
                    </button>
                  ) : (
                    <div className="mt-4">
                      <p className="text-contentColor dark:text-contentColor-dark">
                        <span className="font-semibold">Email:</span>{" "}
                        {course?.userId?.email || "Not available"}
                      </p>
                      <p className="text-contentColor dark:text-contentColor-dark">
                        <span className="font-semibold">Phone:</span>{" "}
                        {course?.userId?.phone || "Not available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-headingColor dark:text-headingColor-dark">
                Requirement Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-headingColor dark:text-headingColor-dark">
                    Subject
                  </h3>
                  <p className="text-contentColor dark:text-contentColor-dark">
                    {course.subject}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-headingColor dark:text-headingColor-dark">
                    Description
                  </h3>
                  <p className="text-contentColor dark:text-contentColor-dark whitespace-pre-wrap">
                    {course.description || "No description available"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-headingColor dark:text-headingColor-dark">
                    Additional Requirements
                  </h3>
                  <p className="text-contentColor dark:text-contentColor-dark">
                    {course.additionalNotes ||
                      "No additional requirements specified"}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="text-size-15   px-25px py-10px border  hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor ">
                  Apply as Tutor
                </button>
                <button className="text-size-15   px-25px py-10px border  hover:bg-whiteColor inline-block rounded dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor ">Save Requirement</button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal for unlocking contact info */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-headingColor dark:text-headingColor-dark">
                Unlock Contact Information
              </h3>
              <p className="mb-6 text-contentColor dark:text-contentColor-dark">
                Viewing this contact will cost{" "}
                <span className="font-bold text-primaryColor">4 coins</span>.
                <br />
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowContact(true);
                    setShowModal(false);
                  }}
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageWrapper>
  );
};

export default ParentRequirementDetails;
