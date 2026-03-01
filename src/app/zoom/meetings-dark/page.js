import ZoomMeetingsMain from "@/components/layout/main/ZoomMeetingsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Zoom Meetings - Dark | Tutorbay - Education Palatform",
  description: "Zoom Meetings - Dark | Tutorbay - Education Palatform",
};
const Zoom_Meetings_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ZoomMeetingsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Zoom_Meetings_Dark;
