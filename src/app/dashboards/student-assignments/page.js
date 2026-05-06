import StudentAssignmentsMain from "@/components/layout/main/dashboards/StudentAssignmentsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Student Assignments | Tutorbay - Education Palatform",
  description: "Student Assignments| Tutorbay - Education Palatform",
};
const Student_Assignments = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <StudentAssignmentsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Student_Assignments;
