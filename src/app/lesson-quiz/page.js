import LessonQuizMain from "@/components/layout/main/LessonQuizMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Quiz | Tutorbay - Education Palatform",
  description: "Lesson Quiz | Tutorbay - Education Palatform",
};
const Lesson_Quiz = () => {
  return (
    <PageWrapper>
      <main>
        <LessonQuizMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Quiz;
