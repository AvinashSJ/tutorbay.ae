import CartMain from "@/components/layout/main/ecommerce/CartMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Cart Dark | Tutorbay - Education Palatform",
  description: "Cart Dark | Tutorbay - Education Palatform",
};

const Cart_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <CartMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Cart_Dark;
