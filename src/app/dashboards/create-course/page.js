import CreateCourseMain from "@/components/layout/main/CreateCourseMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import RequireAuth from "@/components/shared/auth/RequireAuth";
export const metadata = {
  title: "Create Requirement | Tutorbay - Education Palatform",
  description: "Create Requirement | Tutorbay - Education Palatform",
};
const Create_Requirement = () => {
  return (
    <RequireAuth>
      <PageWrapper>
        <main>
          <CreateCourseMain />
          <ThemeController />
        </main>
      </PageWrapper>
    </RequireAuth>
  );
};

export default Create_Requirement;
