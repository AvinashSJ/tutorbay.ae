import CreateRequirementMain from "@/components/layout/main/CreateRequirementMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Create Course | Tutorbay - Education Palatform",
  description: "Create Course | Tutorbay - Education Palatform",
};
const Create_Course = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <CreateRequirementMain />
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Create_Course;
