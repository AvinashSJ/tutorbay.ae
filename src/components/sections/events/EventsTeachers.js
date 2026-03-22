"use client";

import React, { useState } from "react";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";

const EventsTeachers = () => {
  const [activeTab, setActiveTab] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const events = [
    {
      time: "10:00 Am - 11:00 Am",
      type: "Event Speaker",
      title: "Forging Relationships Between Multi To National Governments And Global",
      image: "/placeholder.jpg"
    },
    {
      time: "11:30 Am - 12:30 Pm",
      type: "Workshop",
      title: "Advanced Mathematics for Grade 12 Students",
      image: "/placeholder.jpg"
    },
    {
      time: "02:00 Pm - 03:00 Pm",
      type: "Tutoring Session",
      title: "Chemistry Lab Safety and Experiments",
      image: "/placeholder.jpg"
    }
  ];

  return (
    <section className="bg-lightGrey10 dark:bg-lightGrey10-dark py-50px md:py-70px">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <SectionName>Teaching Excellence</SectionName>
          <HeadingPrimary text="center">
            The Best{" "}
            <span className="relative after:w-full after:h-[7px] z-0 after:bg-secondaryColor after:absolute after:left-0 after:bottom-3 md:after:bottom-5 after:z-[-1]">
              Teachers
            </span>{" "}
            In UAE Are Available Here
          </HeadingPrimary>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" data-aos="fade-up">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === day
                  ? "bg-primaryColor text-white"
                  : "bg-white dark:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark hover:bg-primaryColor hover:text-white"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-6" data-aos="fade-up">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              {/* Event Image Placeholder */}
              <div className="w-20 h-20 bg-primaryColor/20 rounded-lg flex-shrink-0"></div>
              
              {/* Event Details */}
              <div className="flex-1">
                <div className="text-sm text-primaryColor font-semibold mb-1">
                  {event.time}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {event.type}
                </div>
                <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                  {event.title}
                </h3>
                <button className="text-primaryColor hover:text-primaryColor/80 font-medium text-sm">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsTeachers; 