"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PollAnalyticsContainer } from "@/components/analytics/poll/PollAnalyticsContainer";
import { usePollAnalytics } from "@/hook/poll/usePollAnalytics";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";

export default function PollAnalyticsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { analytics, isLoading, isError, error, refetch } = usePollAnalytics(slug);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-canvas-cream bg-dot-pattern">
      <Navbar
        links={[
          { label: "Explore",   href: "/explore" },
          { label: "Create",    href: "/create" },
          { label: "Dashboard", href: "/dashboard", active: true },
        ]}
      />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        {isError ? (
          <DashboardError
            title="POLL CHECK FAILED!"
            message={(error as { message?: string })?.message ?? "Could not load poll analytics."}
            onRetry={refetch}
          />
        ) : analytics ? (
          <PollAnalyticsContainer data={analytics} />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
