import InstructorAnnoucementsMain from "@/components/layout/main/dashboards/InstructorAnnoucementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Instructor Announcements | Tutorbay - Education Palatform",
  description: "Instructor Announcements | Tutorbay - Education Palatform",
};
const Instructor_Announcements = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <InstructorAnnoucementsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Instructor_Announcements;
