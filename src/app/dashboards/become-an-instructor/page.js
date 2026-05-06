import BecomAnInstructorMain from "@/components/layout/main/BecomAnInstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Become An Instructor | Tutorbay - Education Palatform",
  description: "Become An Instructor | Tutorbay - Education Palatform",
};
const Become_An_Instructor = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <BecomAnInstructorMain />
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Become_An_Instructor;
