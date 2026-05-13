import ParentRequirementsMain from "@/components/layout/main/dashboards/ParentRequirementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireRole from "@/components/shared/auth/RequireRole";

export const metadata = {
  title: "My Requirements | Tutorbay - Parent Dashboard",
  description: "Track your posted requirements",
};

const Page = () => {
  return (
    <RequireRole allowedRoles={["PARENT"]}>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <ParentRequirementsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireRole>
  );
};

export default Page;
