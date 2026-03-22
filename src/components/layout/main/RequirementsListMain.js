"use client";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ParentList from "@/components/sections/courses/ParentList";
import StudentList from "@/components/sections/courses/StudentList";
import { useState } from "react";

const RequirementsListMain = () => {
  const [activeTab, setActiveTab] = useState("parent"); // "parent" or "student"
  const [sortInput, setSortInput] = useState("Sort by New");

  return (
    <>
      <HeroPrimary path={"Find Requirements"} title={"Requirements List"} />
      
      <div className="container py-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("parent")}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              activeTab === "parent"
                ? "bg-primaryColor text-whiteColor"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Parent Requirements
          </button>
          <button
            onClick={() => setActiveTab("student")}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              activeTab === "student"
                ? "bg-primaryColor text-whiteColor"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Student Requirements
          </button>
        </div>
        {/* Sorting Dropdown */}
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
        {activeTab === "parent" ? <ParentList sortInput={sortInput} /> : <StudentList sortInput={sortInput} />}
      </div>
    </>
  );
};

export default RequirementsListMain;
