"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionResultsHeader } from "@/components/analytics/quiz/session-results/SessionResultsHeader";
import { SessionHeroStats } from "@/components/analytics/quiz/session-results/SessionHeroStats";
import { QuestionInsights } from "@/components/analytics/quiz/session-results/QuestionInsights";
import { SessionLeaderboard } from "@/components/analytics/quiz/session-results/SessionLeaderboard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetSessionAnalytics } from "@/hook/quiz/host/useGetSessionAnalytics";
import { numberToUuid } from "@/utils/uuid";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";

export default function SessionResultsPage() {
  const params = useParams();
  const sessionId = numberToUuid(params["session-id"] as string);
  const { data, isLoading, isError, refetch } =
    useGetSessionAnalytics(sessionId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data) {
    return (
      <DashboardError
        message={"Could not load analytics for this session"}
        onRetry={refetch}
      />
    );
  }

  const { session, quiz, stats, leaderboard, questionInsights } = data;

  const formattedDate = new Date(session.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 pt-16 pb-12 flex flex-col gap-12 animate-fade-up">
        {/* Back Button Container */}
        <div className="w-full flex justify-start mb-2">
          <Link
            href={`/dashboard/quiz/${params.id}`}
            replace
            className="bg-[var(--color-pure-white)] text-label-md font-body font-bold text-[var(--color-ink-charcoal)] px-6 py-3 border-2 border-ink-charcoal shadow-hard btn-press transition-all flex items-center justify-center gap-2 uppercase self-start w-max"
          >
            <ArrowLeft size={20} />
            Back to session hub
          </Link>
        </div>

        <SessionResultsHeader
          title={quiz.title}
          date={formattedDate}
          id={session.sessionId.slice(0, 8).toUpperCase()}
        />

        <SessionHeroStats
          averageScore={stats.averageScore}
          totalParticipants={stats.totalParticipants}
        />

        <QuestionInsights insights={questionInsights} />

        <SessionLeaderboard leaderboard={leaderboard} />
      </main>

      <Footer />
    </div>
  );
}
