import About2 from "@/components/sections/abouts/About2";
import Brands from "@/components/sections/brands/Brands";
import CoursesFilter2 from "@/components/sections/courses/CoursesFilter2";
import RequirementsListSection from "@/components/sections/requirements/RequirementsListSection";
import Features from "@/components/sections/features/Features";
import Hero2 from "@/components/sections/hero-banners/Hero2";
import PopularSubjects2 from "@/components/sections/popular-subjects/PopularSubjects2";
import Registration from "@/components/sections/registrations/Registration";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import React from "react";

const Home2 = () => {
  return (
    <>
      <Hero2 />
      <Features />
      <About2 />
      <PopularSubjects2 />
      <CoursesFilter2 />
      <Registration />
      <RequirementsListSection />
      <Testimonials />
      <Brands />
    </>
  );
};

export default Home2;
