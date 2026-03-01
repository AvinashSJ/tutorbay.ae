import CreateCourseMain from "@/components/layout/main/CreateCourseMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Requirement | Tutorbay - Education Palatform",
  description: "Create Requirement | Tutorbay - Education Palatform",
};
const Create_Requirement = () => {
  return (
    <PageWrapper>
      <main>
        <CreateCourseMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Create_Requirement;
