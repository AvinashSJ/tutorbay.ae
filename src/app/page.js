import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import { Toaster } from "react-hot-toast";
import Home2 from "@/components/layout/main/Home2";

export default function Home() {
  return (
    <PageWrapper>
      <main>
        <Home2 />
        <ThemeController />
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </PageWrapper>
  );
}
