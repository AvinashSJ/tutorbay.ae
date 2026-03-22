"use client";
import Subjects from "@/components/shared/popular-subjects/Subjects";
import Image from "next/image";
import React from "react";
import shapImage from "@/assets/images/service/service__shape__1.png";
import shapBgImage from "@/assets/images/service/service__shape__bg__1.png";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useIsTrue from "@/hooks/useIsTrue";
import chatImage from "@/assets/images/icon/chat-app.png";
import virtualRealityImage from "@/assets/images/icon/virtual-reality.png";
import machineLearningImage from "@/assets/images/icon/machine-learning.png";
import artifitialImage from "@/assets/images/icon/artificial-intelligence.png";
const PopularSubjects = () => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const isHome10 = useIsTrue("/home-10");
  const isHome10Dark = useIsTrue("/home-10-dark");
  const subjects = [
    {
      title: "Arabic",
      desc: "Language & Culture",
      navButton: true,
      image: null,
      id: 1,
      path: "#",
      category: "Language",
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm0 2c7.732 0 14 6.268 14 14s-6.268 14-14 14S6 27.732 6 20 12.268 6 20 6z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M20 10c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm0 2c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Math",
      desc: "Sharpen Your Skills",
      navButton: true,
      id: 2,
      path: "#",
      category: "Mathematics",
      translate: true,
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M24 4H8C6.9 4 6 4.9 6 6v20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 8h4v4h-4V8zm0 6h4v4h-4v-4zm-2-6h2v2h-2V8zm0 6h2v2h-2v-2z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M18 8h2v2h-2V8zm0 6h2v2h-2v-2z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Science",
      desc: "Update Your Skill",
      navButton: true,
      id: 3,
      path: "#",
      category: "Science",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M20 4H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 8h2v2H9V8zm0 6h2v2H9v-2zm4-6h2v2h-2V8zm0 6h2v2h-2v-2z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M16 8h2v2h-2V8zm0 6h2v2h-2v-2z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "French",
      desc: "Show Creativity",
      navButton: true,
      id: 4,
      path: "#",
      category: "Language",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "English",
      desc: "Explore Culture",
      navButton: true,
      id: 5,
      path: "#",
      category: "Language",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Physics",
      desc: "Master the Art",
      navButton: true,
      id: 6,
      path: "#",
      category: "Science",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Chemistry",
      desc: "Diversity in Key",
      navButton: true,
      id: 7,
      path: "#",
      category: "Science",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Moral Studies",
      desc: "Upgrade Career",
      navButton: true,
      id: 8,
      path: "#",
      category: "Ethics",
      image: null,
      svg: (
        <div className="relative w-20 h-[60px]">
          <svg
            className="absolute inline-block translate-y-3 translate-x-2 w-20 h-[60px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#5F2DED"
            />
            <path
              className="group-hover:fill-whiteColor dark:group-hover:fill-whiteColor"
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
              fill="#FFB31F"
            />
          </svg>
        </div>
      ),
    },
  ];
  return (
    <section
      className={`${
        isHome9 || isHome9Dark
          ? "bg-[url(../assets/images/about/about_bg_1.jpg)] bg-cover"
          : "bg-lightGrey10 dark:bg-lightGrey10-dark"
      } pt-50px pb-110px`}
    >
      <div className="container">
        {/* about section  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 pt-30px gap-x-30px items-center">
          {/* about left */}
          <div
            className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0"
            data-aos="fade-up"
          >
            <div className="relative">
              <div>
                <Image
                  className="absolute bottom-9 lg:bottom-[-50px] right-[50px] animate-move-hor"
                  src={shapImage}
                  alt=""
                />
              </div>
              {isHome9 || isHome9Dark ? (
                ""
              ) : (
                <div>
                  <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                    Populer Subject
                  </span>
                  <h3 className="text-3xl md:text-size-35 2xl:text-size-38 3xl:text-size-42 leading-10 md:leading-45px 2xl:leading-50px 3xl:leading-2xl font-bold text-blackColor dark:text-blackColor-dark pb-25px">
                    Provide It & Technology <br /> Subject For You
                  </h3>
                  <p className="text-sm md:text-base text-contentColor dark:text-contentColor-dark mb-10px 2xl:mb-50px">
                    Construction is a general term meaning the art and science
                    to form systems organizations, and comes from Latin
                    Construction is
                  </p>
                  <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-10 pl-3 border-l-[3px] border-secondaryColor">
                    Construction is a general term meaning the art and science
                    to form systems organizations, and comes from Latin
                    Construction is a organizations, and comes from Latin
                    construction and Old
                  </p>
                  <div>
                    <ButtonPrimary color="secondary" path="#">
                      Explore More <i className="icofont-long-arrow-right"></i>
                    </ButtonPrimary>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* sbject right */}
          <div className="relative z-0 overflow-visible">
            {/* animted area */}
            <div data-aos="fade-up">
              <Image
                className="absolute sm:block xl:left-1/4 z-[-1] top-6 animate-move-var"
                src={shapBgImage}
                alt=""
              />
            </div>
            {/* subject card */}
            <Subjects subjects={subjects} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSubjects;
