import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import React from "react";
import aboutImage1 from "@/assets/images/about/about_1.png";
import aboutImage8 from "@/assets/images/about/about_8.png";

import SectionName from "@/components/shared/section-names/SectionName";
import AboutListItem from "@/components/shared/abouts/AboutListItem";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";

const About2 = () => {
  const items = [
    { id: 1, title: "Find perfect instructor near you." },
    { id: 2, title: "Learn skills with experts in every field." },
    { id: 3, title: "Get connected with qualified instructors now." },
    { id: 4, title: "Join Over 4000+ Students." },
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* about section  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* about left */}
          <div data-aos="fade-up">
            <TiltWrapper>
              <div className="tilt relative">
                <Image
                  className="w-full"
                  src={aboutImage8}
                  alt=""
                  placeholder="blur"
                />
                <Image
                  className="absolute left-0 top-0 lg:top-4 right-0 mx-auto"
                  src={aboutImage1}
                  alt=""
                  placeholder="blur"
                />
              </div>
            </TiltWrapper>
          </div>

          {/* about right */}
          <div data-aos="fade-up" className="pl-0 lg:pl-8">
            <SectionName>About Us</SectionName>
            <h3 className="text-3xl md:text-5xl leading-tight font-bold text-gray-900 pb-6">
              Find Qualified Tutors, Institutes And Local Classes.
            </h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We connect students with qualified tutors and educational institutions 
              to provide personalized learning experiences. Our platform makes it 
              easy to find the perfect match for your educational needs.
            </p>
            <ul className="space-y-4 mb-8">
              {items.map((item, idx) => (
                <AboutListItem key={idx} item={item} />
              ))}
            </ul>

            <div className="mt-10">
              <ButtonPrimary path="#" arrow={true}>
                More About Us
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About2;
