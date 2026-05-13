"use client";
import ProfileDetails from "@/components/shared/dashboards/ProfileDetails";
import WalletSection from "@/components/shared/wallet/WalletSection";
import TutorMatchedList from "@/components/sections/courses/TutorMatchedList";
import DemosCalendar from "@/components/shared/sessions/DemosCalendar";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const InstructorProfileMain = () => {
  const searchParams = useSearchParams();
  const [section, setSection] = useState("profile");

  useEffect(() => {
    setSection(searchParams.get("section") || "profile");
  }, [searchParams]);

  if (section === "wallet") return <WalletSection />;
  if (section === "matches") return <TutorMatchedList />;
  if (section === "sessions") return <DemosCalendar />;
  return <ProfileDetails />;
};

export default InstructorProfileMain;
