"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetQuizDashboard } from "@/hook/quiz/useGetQuizDashboard";
import { numberToUuid } from "@/utils/uuid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuizSessionHeader } from "@/components/analytics/quiz/quiz-session/QuizSessionHeader";
import { QuizHeroCard } from "@/components/analytics/quiz/quiz-session/QuizHeroCard";
import { QuizStats } from "@/components/analytics/quiz/quiz-session/QuizStats";
import { PreviousSessions } from "@/components/analytics/quiz/quiz-session/PreviousSessions";
import { QuizLeaderboard } from "@/components/analytics/quiz/quiz-session/QuizLeaderboard";
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";

export default function QuizSessionHub() {
  const params = useParams();
  const quizId = numberToUuid(params.id as string);
  const { data, isLoading, isError,refetch,error } = useGetQuizDashboard(quizId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data) {
    return (
      <DashboardError
        message={"Could not load analytics for this quiz"}
        onRetry={refetch}
      />
    );
  }

  const { quiz, stats, previousSessions, leaderboard } = data;

  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 pt-24 pb-12 flex flex-col gap-16">
        <QuizSessionHeader 
          quizId={quiz.quizId} 
          status={quiz.status} 
          onStatusChange={refetch} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <QuizHeroCard
              title={quiz.title}
              durationMins={Math.round(stats.totalTimeLimitSecs / 60)}
              quizIdStr={params.id as string}
            />
            <QuizStats
              totalQuestions={stats.totalQuestions}
              totalParticipants={stats.totalParticipants}
            />
            <PreviousSessions sessions={previousSessions} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <QuizLeaderboard leaderboard={leaderboard} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
