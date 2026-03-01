import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Login/Register | Tutorbay - Education Palatform",
  description: "Login/Register | Tutorbay - Education Palatform",
};
const Login = () => {
  return (
    <PageWrapper>
      <main>
        <LoginMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Login;
