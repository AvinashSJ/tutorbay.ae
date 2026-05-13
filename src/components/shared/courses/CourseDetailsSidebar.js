import BlogSocials from "../blogs/BlogSocials";
import BlogTags from "../blogs/BlogTags";
import CourseEnroll from "../course-details/CourseEnroll";
import PopularCoursesMini from "../course-details/PopularCoursesMini";
import BlogContactForm from "../blogs/BlogContactForm";

const CourseDetailsSidebar = ({ course, requirement }) => {
  const mappedCourse = requirement
    ? {
        id: requirement.id,
        title: requirement.title || requirement.subject,
        subject: requirement.subject,
        price: requirement.expectedFeePerHour,
        image: null,
        insName: requirement.ownerName,
        categories: requirement.curriculum,
        level: requirement.grade ? `Year ${requirement.grade}` : null,
        mode: requirement.modeOfTeaching,
        location: requirement.area,
        requirement,
      }
    : course;

  return (
    <div className="flex flex-col">
      <CourseEnroll course={mappedCourse} />
      <BlogSocials />
      <PopularCoursesMini />
      <BlogContactForm />
      <BlogTags />
    </div>
  );
};

export default CourseDetailsSidebar;