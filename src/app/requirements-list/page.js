import RequirementsListMain from "@/components/layout/main/RequirementsListMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course List | Tutorbay - Education Palatform",
  description: "Course List | Tutorbay - Education Palatform",
};

const Requirements_List = async () => {
  return (
    <PageWrapper>
      <main>
        <RequirementsListMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Requirements_List;
