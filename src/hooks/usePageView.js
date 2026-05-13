"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/services/analytics";
import { getSupabase } from "@/libs/supabase";

function PageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    const title = document.title || pathname;

    getSupabase().auth.getUser().then(({ data }) => {
      trackPageView(url, title, data?.user?.id ?? null);
    });
  }, [pathname, searchParams]);

  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewInner />
    </Suspense>
  );
}