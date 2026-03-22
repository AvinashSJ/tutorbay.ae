"use client";
import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const Page = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentEnrolledCoursesMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Page;
