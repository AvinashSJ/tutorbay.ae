"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import PagragraphHero from "@/components/shared/paragraphs/PagragraphHero";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useEffect } from "react";
import about1 from "@/assets/images/about/about_1.png";
import about8 from "@/assets/images/about/about_8.png";
import herobanner2 from "@/assets/images/register/register__2.png";
import herobanner6 from "@/assets/images/herobanner/herobanner__6.png";
import herobanner7 from "@/assets/images/herobanner/herobanner__7.png";
import Link from "next/link";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";

const Hero1 = () => {
  return (
    <section data-aos="fade-up">
      {/* banner section  */}
      <div className="container2-xl bg-darkdeep1 pt-50px md:pt-20 pb-205px md:pb-35 rounded-2xl relative overflow-hidden shadow-brand">
        <div className="container grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* banner Left  */}
          <div data-aos="fade-up">
            <HreoName>TUTORING PLATFORM</HreoName>
            <HeadingLg color={"white"}>
              Learn From Expert Tutors. <br className="hidden md:block" />
              Face-To-Face Or Online.
            </HeadingLg>
            <PagragraphHero color="white">
              We Can Help You Find Matching Local And Online Tutors In Seconds. Hire A Tutor Now - For FREE
            </PagragraphHero>

            <div className="mt-30px md:mt-45px">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full sm:w-80 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                />
                <button className="w-full sm:w-auto bg-primaryColor text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          {/* banner right  */}
          <div data-aos="fade-up">
            <TiltWrapper>
              <div className="tilt relative">
                <Image
                  placeholder="blur"
                  className="w-full"
                  src={about8}
                  alt=""
                />
                <Image
                  className="absolute left-0 top-0 lg:top-4 right-0 mx-auto"
                  src={about1}
                  alt=""
                />
              </div>
            </TiltWrapper>
          </div>
        </div>

        <div>
          <Image
            className="absolute left-1/2 bottom-[15%] animate-spin-slow"
            src={herobanner2}
            alt=""
          />
          <Image
            className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
            src={herobanner6}
            alt=""
          />
          <Image
            className="absolute right-[5%] bottom-[15%]"
            src={herobanner7}
            alt=""
          />
          <Image
            className="absolute top-[5%] left-[45%]"
            src={herobanner7}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
