import TutorReviewsMain from "@/components/layout/main/dashboards/TutorReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireRole from "@/components/shared/auth/RequireRole";

export const metadata = {
  title: "Tutor Reviews | Tutorbay",
  description: "Reviews and feedback for tutors",
};

const Tutor_Reviews = () => {
  return (
    <RequireRole allowedRoles={["TUTOR"]}>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <TutorReviewsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireRole>
  );
};

export default Tutor_Reviews;
