import LessonCourseMaterialsMain from "@/components/layout/main/LessonCourseMaterialsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Course Materials | Tutorbay - Education Palatform",
  description: "Lesson Course Materials | Tutorbay - Education Palatform",
};
const Lesson_Course_Materials = () => {
  return (
    <PageWrapper>
      <main>
        <LessonCourseMaterialsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Course_Materials;
