import InstructorQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Instructor Quiz Attempts | Tutorbay - Education Palatform",
  description: "Instructor Quiz Attempts | Tutorbay - Education Palatform",
};
const Instructor_Quiz_Attempts = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <InstructorQuizAttemptsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Instructor_Quiz_Attempts;
