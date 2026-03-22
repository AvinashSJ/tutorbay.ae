"use client";
import { useGetRequirementsListQuery } from "@/redux/services/userSlice";
import CourseCard2 from "@/components/shared/courses/CourseCard2";
import placeholder from "@/assets/images/coursePlaceholder.svg";

const ParentList = () => {
  const {
    data: parents,
    error,
    isLoading,
  } = useGetRequirementsListQuery("parent");

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        Error loading requirements. Please try again later.
      </div>
    );
  }

  if (!parents?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No parent requirements found.
      </div>
    );
  }

  return (
    <section className="py-30px lg:py-50px">
      <div className="container">
        <div className="flex flex-col gap-30px">
          {parents?.map((parent, idx) => (
            <CourseCard2
              key={parent._id}
              course={{
                id: parent._id,
                title: `Need ${parent.subject} Tutor`,
                firstName: parent?.userId?.firstName,
                image: parent.profileImage || placeholder,
                category: parent.requirement?.curriculum || "Not specified",
                subject: parent?.subject || "Not specified",
                level: parent.requirement?.grade || "Not specified",
                description:
                  parent.additionalNotes || "No description available",
                location: parent.currentLocationURL || "Location not specified",
                price: parent?.expectedFee || "Not specified",
                rating: 0,
                totalRating: 0,
                userId: parent?.userId,
                totalStudent: 0,
                totalLesson: 0,
                duration: "Not specified",
                instructor: {
                  name: `${parent.firstName} ${parent.lastName}`,
                  image: parent.profileImage || "/images/placeholder.png",
                },
              }}
              isList={true}
              card={2}
              isNotSidebar={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentList;
