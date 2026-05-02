import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Parent Profile | TutorBay",
  description: "Parent Profile | TutorBay",
};
const Parent_Profile = () => {
  return (
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
  );
};

export default Parent_Profile;
