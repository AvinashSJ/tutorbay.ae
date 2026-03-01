import { Hind, Inter } from "next/font/google";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "./globals.css";
import FixedShadow from "@/components/shared/others/FixedShadow";
import PreloaderPrimary from "@/components/shared/others/PreloaderPrimary";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "react-hot-toast";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
export const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata = {
  title: "Home 1 | Tutorbay - Education Platform",
  description: "Home description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${hind.variable}`}>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0  ${inter.className}`}
      >
        <PreloaderPrimary />
        <ReduxProvider>{children}</ReduxProvider>

        <Toaster position="top-center" reverseOrder={false} />
        {/* theme fixed shadow */}
        <div>
          <FixedShadow />
          <FixedShadow align={"right"} />
        </div>
      </body>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDP0Bjh63ZIUEDaMe7c1QqxMHFK_ptsJwg&libraries=places`}
        async
        defer
      ></script>
    </html>
  );
}
