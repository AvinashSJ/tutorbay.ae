import EventDetailsMain from "@/components/layout/main/EventDetailsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import events from "@/../public/fakedata/events.json";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Event Details - Dark | Tutorbay - Education Palatform",
  description: "Event Details - Dark  | Tutorbay - Education Palatform",
};

const Event_details_Dark = async ({ params }) => {
  const { id } = params;
  const isExistEvent = events?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistEvent) {
    notFound();
  }
  return (
    <PageWrapper>
      <main className="is-dark">
        <EventDetailsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};
export async function generateStaticParams() {
  return events?.map(({ id }) => ({ id: id.toString() }));
}
export default Event_details_Dark;
