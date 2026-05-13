import ParentReviewsMain from "@/components/layout/main/dashboards/ParentReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireRole from "@/components/shared/auth/RequireRole";

export const metadata = {
  title: "Parent Reviews | Tutorbay",
  description: "Reviews and feedback for parents",
};

const Parent_Reviews = () => {
  return (
    <RequireRole allowedRoles={["PARENT"]}>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <ParentReviewsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireRole>
  );
};

export default Parent_Reviews;
