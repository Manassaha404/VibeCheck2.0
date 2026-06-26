"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PollAnalyticsContainer } from "@/components/analytics/poll/PollAnalyticsContainer";
import { usePollAnalytics } from "@/hook/poll/usePollAnalytics";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ── Loading skeleton ────────────────────────────────────────────
function PollAnalyticsSkeleton() {
  return (
    <div className="space-y-16 animate-pulse w-full max-w-container-max mx-auto px-4 md:px-10 py-12">
      <div className="flex gap-4">
        <div className="h-16 bg-ink-charcoal/10 border-4 border-ink-charcoal/20 w-3/4 rounded-xl" />
        <div className="h-16 bg-ink-charcoal/10 border-4 border-ink-charcoal/20 w-16 rounded-xl" />
        <div className="h-16 bg-ink-charcoal/10 border-4 border-ink-charcoal/20 w-16 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-pure-white border-4 border-ink-charcoal/20 rounded-xl" />
        ))}
      </div>
      <div className="h-96 bg-pure-white border-4 border-ink-charcoal/20 rounded-xl" />
    </div>
  );
}

// ── Error state ─────────────────────────────────────────────────
function PollAnalyticsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="bg-[#FF007F] border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-12 text-center max-w-lg rotate-1">
        <AlertTriangle size={64} strokeWidth={2} className="text-pure-white mx-auto mb-4" />
        <h2 className="font-display-lg text-[48px] font-black uppercase text-pure-white mb-4 leading-none">
          POLL CHECK FAILED!
        </h2>
        <p className="font-bold text-pure-white/80 text-lg mb-8">{message}</p>
        <button
          onClick={onRetry}
          className="bg-electric-sun text-ink-charcoal font-black uppercase text-xl px-8 py-4 border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:bg-pure-white transition-colors flex items-center gap-3 mx-auto active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <RefreshCw size={24} strokeWidth={3} />
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

export default function PollAnalyticsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { analytics, isLoading, isError, error, refetch } = usePollAnalytics(slug);

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
        {isLoading ? (
          <PollAnalyticsSkeleton />
        ) : isError ? (
          <PollAnalyticsError
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
