import InstructorMain from "@/components/layout/main/InstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Instructor - Dark | Tutorbay - Education Palatform",
  description: "Instructor - Dark | Tutorbay - Education Palatform",
};
const Instructors_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <InstructorMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructors_Dark;
