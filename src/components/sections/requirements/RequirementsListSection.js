"use client";
import ParentList from "@/components/sections/courses/ParentList";
import StudentList from "@/components/sections/courses/StudentList";
import TutorMatchedList from "@/components/sections/courses/TutorMatchedList";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

const RequirementsListSection = () => {
  const { user } = useAuth();
  const isTutor = user?.role === "TUTOR";
  const [activeTab, setActiveTab] = useState(isTutor ? "best-match" : "parent");
  const [sortInput, setSortInput] = useState("Sort by New");

  const tabs = isTutor
    ? [
        { key: "best-match", label: "Best Match" },
        { key: "parent", label: "Parent Requirements" },
        { key: "student", label: "Student Requirements" },
      ]
    : [
        { key: "parent", label: "Parent Requirements" },
        { key: "student", label: "Student Requirements" },
      ];

  return (
    <section className="py-30px lg:py-50px">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-blackColor dark:text-blackColor-dark">
              Find Requirements
            </h2>
            <p className="text-gray-600 mt-2">
              Browse through parent and student requirements
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <ButtonPrimary color="secondary" path="/find-requirements" arrow={true}>
              All Requirements
            </ButtonPrimary>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-primaryColor text-whiteColor"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== "best-match" && (
          <div className="flex justify-end mb-4">
            <label className="mr-2 font-medium text-blackColor dark:text-blackColor-dark">Sort by:</label>
            <select
              value={sortInput}
              onChange={e => setSortInput(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-whiteColor dark:bg-darkdeep3-dark text-blackColor dark:text-blackColor-dark"
            >
              <option>Sort by New</option>
              <option>Title Ascending</option>
              <option>Title Descending</option>
              <option>Price Ascending</option>
              <option>Price Descending</option>
            </select>
          </div>
        )}

        {activeTab === "best-match" && <TutorMatchedList variant="marquee" />}
        {activeTab === "parent" && <ParentList sortInput={sortInput} variant="marquee" />}
        {activeTab === "student" && <StudentList sortInput={sortInput} variant="marquee" />}
      </div>
    </section>
  );
};

export default RequirementsListSection;
