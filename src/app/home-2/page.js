import Home2 from "@/components/layout/main/Home2";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home 2 | Tutorbay - Education Palatform",
  description: "Home 2 | Tutorbay - Education Palatform",
};

const Home_2 = async () => {
  return (
    <PageWrapper>
      <main>
        <Home2 />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Home_2;
