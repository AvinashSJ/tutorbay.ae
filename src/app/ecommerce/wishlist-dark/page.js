import WishlistMain from "@/components/layout/main/ecommerce/WishlistMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Wishlist Dark | Tutorbay - Education Palatform",
  description: "Wishlist Dark | Tutorbay - Education Palatform",
};

const Wishlist_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <WishlistMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Wishlist_Dark;
