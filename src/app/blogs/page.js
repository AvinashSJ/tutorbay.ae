import BlogsMain from "@/components/layout/main/BlogsMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Blog | Tutorbay - Education Palatform",
  description: "Blog | Tutorbay - Education Palatform",
};

const Blogs = async () => {
  return (
    <PageWrapper>
      <main>
        <BlogsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Blogs;
