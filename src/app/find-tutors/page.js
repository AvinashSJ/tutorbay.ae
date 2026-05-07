"use client";
import TutorList from "@/components/sections/courses/TutorList";
import TutorCategories from "@/components/sections/courses/TutorCategories";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const FindTutorsPage = () => {
  return (
    <PageWrapper>
      <main>
        <HeroPrimary path={"Find Tutors"} title={"Available Tutors"} />
        <TutorCategories />
        <TutorList />
      </main>
    </PageWrapper>
  );
};

export default FindTutorsPage; 