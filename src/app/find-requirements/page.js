"use client";
import RequirementsListMain from "@/components/layout/main/RequirementsListMain";
import EventsList from "@/components/sections/events/EventsList";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const FindRequirementsPage = () => {
  return (
    <PageWrapper>
      <main>
        <RequirementsListMain />
        <EventsList />
      </main>
    </PageWrapper>
  );
};

export default FindRequirementsPage; 