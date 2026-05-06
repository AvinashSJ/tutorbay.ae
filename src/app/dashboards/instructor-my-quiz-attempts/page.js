import InstructorMyQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorMyQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Instructor My Quiz Attempts | Tutorbay - Education Palatform",
  description: "Instructor My Quiz Attempts | Tutorbay - Education Palatform",
};
const Instructor_My_Quiz_Attempts = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <InstructorMyQuizAttemptsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Instructor_My_Quiz_Attempts;
