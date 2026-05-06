import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Student Profile | TutorBay",
  description: "Student Profile | TutorBay",
};
const Student_Profile = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <StudentProfileMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Student_Profile;
