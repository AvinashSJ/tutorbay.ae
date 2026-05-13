import TutorsMain from "@/components/layout/main/TutorsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "All Tutors | Tutorbay - Education Platform",
  description: "Browse all approved tutors on Tutorbay",
};

const TutorsPage = () => {
  return (
    <PageWrapper>
      <main>
        <TutorsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default TutorsPage;
