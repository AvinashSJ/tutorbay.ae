"use client";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ParentList from "@/components/sections/courses/ParentList";
import StudentList from "@/components/sections/courses/StudentList";
import TutorMatchedList from "@/components/sections/courses/TutorMatchedList";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

const RequirementsListMain = () => {
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
    <>
      <HeroPrimary path={"Find Requirements"} title={"Requirements List"} />

      <div className="container py-6">
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

        {activeTab === "best-match" && <TutorMatchedList />}
        {activeTab === "parent" && <ParentList sortInput={sortInput} />}
        {activeTab === "student" && <StudentList sortInput={sortInput} />}
      </div>
    </>
  );
};

export default RequirementsListMain;
