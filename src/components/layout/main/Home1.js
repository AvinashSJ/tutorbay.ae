import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import Hero1 from "@/components/sections/hero-banners/Hero1";
import Instructors from "@/components/sections/instructors/Instructors";
import PopularSubjects from "@/components/sections/popular-subjects/PopularSubjects";
import PricingPlans from "@/components/sections/pricing-plans/PricingPlans";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import Features from "@/components/sections/features/Features";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import Brands from "@/components/sections/brands/Brands";
import EventsTeachers from "@/components/sections/events/EventsTeachers";
import React from "react";
const Home1 = () => {
  return (
    <>
      <Hero1 />
      <Features />
      <BrandHero />
      <About1 />
      <PopularSubjects />
      <CoursesFilter />
      <Registration />
      <EventsTeachers />
      <PricingPlans />
      <Instructors />
      <Testimonials />
      <Brands />
      <Blogs />
    </>
  );
};

export default Home1;
