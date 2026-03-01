import Home6 from "@/components/layout/main/Home6";
import Home7 from "@/components/layout/main/Home7";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home-7 University | Tutorbay - Education Palatform",
  description: "Home-7 University | Tutorbay - Education Palatform",
};
const Home_7 = () => {
  return (
    <PageWrapper>
      <main>
        <Home7 />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Home_7;
