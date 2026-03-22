import InstructorDetailsMain from "@/components/layout/main/InstructorDetailsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Tutor Details | Tutorbay - Education Platform",
  description: "Tutor Details | Tutorbay - Education Platform",
};

const TutorDetailsPage = ({ params }) => {
  return (
    <PageWrapper>
      <main>
        <InstructorDetailsMain id={params.id} />
      </main>
    </PageWrapper>
  );
};

export default TutorDetailsPage; 