import Home1 from "@/components/layout/main/Home1";
import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <PageWrapper>
      <main>
        {/* <Home1 /> */}
        <LoginMain />
        <ThemeController />
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </PageWrapper>
  );
}
