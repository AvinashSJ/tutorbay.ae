import InstructorCourseMain from "@/components/layout/main/dashboards/InstructorCourseMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Instructor Course | Tutorbay - Education Palatform",
  description: "Instructor Course | Tutorbay - Education Palatform",
};
const Instructor_Course = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <InstructorCourseMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Instructor_Course;
