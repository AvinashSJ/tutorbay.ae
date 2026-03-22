import Feature from "@/components/shared/features/Feature";
import React from "react";

const Features = () => {
  const features = [
    {
      title: "Video Training",
      desc: "View Unlimited Courses",
    },
    {
      title: "Expert Teacher",
      desc: "View Unlimited Courses",
    },
    {
      title: "Versatile Course",
      desc: "View Unlimited Courses",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* feature single */}
        {features.map((feature, idx) => (
          <Feature key={idx} feature={{ ...feature, id: idx }} />
        ))}
      </div>
    </div>
  );
};

export default Features;
