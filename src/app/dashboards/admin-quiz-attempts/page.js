import AdminQuizAttemptsMain from "@/components/layout/main/dashboards/AdminQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Admin Quiz Attempts | Tutorbay - Education Palatform",
  description: "Admin Quiz Attempts | Tutorbay - Education Palatform",
};
const Admin_Quiz_Attempts = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <AdminQuizAttemptsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Admin_Quiz_Attempts;
