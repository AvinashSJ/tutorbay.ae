import CreateRequirementMain from "@/components/layout/main/CreateRequirementMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Requirement | TutorBay",
  description: "Create Requirement | TutorBay",
};
const Create_Requirement = () => {
  return (
    <PageWrapper>
      <main>
        <CreateRequirementMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Create_Requirement;
