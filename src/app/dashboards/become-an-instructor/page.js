import BecomAnInstructorMain from "@/components/layout/main/BecomAnInstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Become An Instructor | Tutorbay - Education Palatform",
  description: "Become An Instructor | Tutorbay - Education Palatform",
};
const Become_An_Instructor = () => {
  return (
    <PageWrapper>
      <main>
        <BecomAnInstructorMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Become_An_Instructor;
