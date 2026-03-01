import LessonAssignmentMain from "@/components/layout/main/LessonAssignmentMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Assignment | Tutorbay - Education Palatform",
  description: "Lesson Assignment | Tutorbay - Education Palatform",
};
const Lesson_Assignment = () => {
  return (
    <PageWrapper>
      <main>
        <LessonAssignmentMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Assignment;
