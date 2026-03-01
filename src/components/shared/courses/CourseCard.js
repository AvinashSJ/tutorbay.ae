"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
let insId = 0;
const CourseCard = ({ course, type }) => {
  const { addProductToWishlist } = useWishlistContext();
  const {
    _id: id,
    curriculum,
    subject,
    availability,
    expectedFee,
    modeOfTeaching,
    grade,
    location,
    emirates,
    status,
    // completedParchent,
  } = course;
  const depBgs = [
    {
      category: "Art & Design",
      bg: "bg-secondaryColor",
    },

    {
      category: "Development",
      bg: "bg-blue",
    },

    {
      category: "Lifestyle",
      bg: "bg-secondaryColor2",
    },

    {
      category: "Web Design",
      bg: "bg-greencolor2",
    },

    {
      category: "Business",
      bg: "bg-orange",
    },

    {
      category: "Art & Design",
      bg: "bg-yellow",
    },
    {
      category: "Personal Development",
      bg: "bg-secondaryColor",
    },

    {
      category: "Marketing",
      bg: "bg-blue",
    },

    {
      category: "Photography",
      bg: "bg-secondaryColor2",
    },

    {
      category: "Data Science",
      bg: "bg-greencolor2",
    },

    {
      category: "Health & Fitness",
      bg: "bg-orange",
    },

    {
      category: "Mobile Application",
      bg: "bg-yellow",
    },
  ];

  const cardBg = depBgs?.find(
    ({ category: category1 }) => category1 === "Health & Fitness"
  )?.bg;
  insId = id;
  insId = insId % 6 ? insId % 6 : 6;

  return (
    <div className="w-full  p-3">
      <div className="h-full bg-white dark:bg-darkdeep3-dark shadow-md rounded-lg p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="bg-primaryColor text-white text-xs font-semibold px-3 py-1 rounded-full">
            {curriculum}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {emirates}
          </span>
        </div>

        {/* Subject */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {subject}
        </h3>
        <p className="text-sm text-gray-500 mb-2">({grade})</p>

        {/* Details */}
        <div className="text-sm text-gray-800 dark:text-gray-300 space-y-1 mb-2">
          <p>
            <strong className="text-black dark:text-white">Mode:</strong>{" "}
            {modeOfTeaching}
          </p>
          <p>
            <strong className="text-black dark:text-white">Fee:</strong>{" "}
            {expectedFee ?? "Free"} AED
          </p>
          <p>
            <strong className="text-black dark:text-white">Status:</strong>{" "}
            <span
              className={
                status === "open"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {status}
            </span>
          </p>
          <p>
            <strong className="text-black dark:text-white">Location:</strong>{" "}
            <a
              href={location?.currentLocationURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View on Map
            </a>
          </p>
        </div>

        {/* Availability */}
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          <strong className="text-black dark:text-white">Availability:</strong>
          <ul className="list-disc list-inside">
            {availability?.map((slot) => (
              <li key={slot._id}>
                {slot.days} ({slot.startTime} - {slot.endTime})
              </li>
            ))}
          </ul>
        </div>

        {/* Optional footer (like button or progress) */}
      </div>
    </div>
  );
};

export default CourseCard;
