import TermsMain from "@/components/layout/main/TermsMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Terms & Conditions | Tutorbay - Education Platform",
  description: "Terms & Conditions | Tutorbay - Education Platform",
};

const Terms = async () => {
  return (
    <PageWrapper>
      <main>
        <TermsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Terms;
