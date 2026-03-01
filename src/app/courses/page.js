import CoursesMain from "@/components/layout/main/CoursesMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Courses | Tutorbay - Education Palatform",
  description: "Courses | Tutorbay - Education Palatform",
};

const Courses = async () => {
  return (
    <PageWrapper>
      <main>
        <CoursesMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Courses;
