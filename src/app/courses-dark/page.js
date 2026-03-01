import CoursesMain from "@/components/layout/main/CoursesMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "Courses - Dark | Tutorbay - Education Palatform",
  description: "Courses - Dark | Tutorbay - Education Palatform",
};
const Courses_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CoursesMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Courses_Dark;
