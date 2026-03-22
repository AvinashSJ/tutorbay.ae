"use client";
import { useGetRequirementsListQuery } from "@/redux/services/userSlice";
import RequirementCard from "@/components/shared/cards/RequirementCard";

const StudentList = () => {
  const { data: students, error, isLoading } = useGetRequirementsListQuery("student");

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

  if (!students?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No student requirements found.
      </div>
    );
  }

  return (
    <section className="py-30px lg:py-50px">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-30px">
          {students?.map((requirement) => (
            <RequirementCard key={requirement._id} requirement={requirement} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentList; 