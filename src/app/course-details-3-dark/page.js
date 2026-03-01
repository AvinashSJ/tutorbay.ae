import CourseDetails3Main from "@/components/layout/main/CourseDetails3Main";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Courses Details 3 - Dark | Tutorbay - Education Palatform",
  description: "Courses Details 3 - Dark | Tutorbay - Education Palatform",
};
const Course_Details_3_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CourseDetails3Main />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_Details_3_Dark;
