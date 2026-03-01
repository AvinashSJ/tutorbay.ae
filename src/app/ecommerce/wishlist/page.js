import WishlistMain from "@/components/layout/main/ecommerce/WishlistMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Wishlist | Tutorbay - Education Palatform",
  description: "Wishlist | Tutorbay - Education Palatform",
};

const Wishlist = async () => {
  return (
    <PageWrapper>
      <main>
        <WishlistMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Wishlist;
