import CartMain from "@/components/layout/main/ecommerce/CartMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Cart | Tutorbay - Education Palatform",
  description: "Cart | Tutorbay - Education Palatform",
};

const Cart = async () => {
  return (
    <PageWrapper>
      <main>
        <CartMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Cart;
