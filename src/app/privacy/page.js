import PrivacyMain from "@/components/layout/main/PrivacyMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Privacy Policy | Tutorbay - Education Platform",
  description: "Privacy Policy | Tutorbay - Education Platform",
};

const Privacy = async () => {
  return (
    <PageWrapper>
      <main>
        <PrivacyMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Privacy;
