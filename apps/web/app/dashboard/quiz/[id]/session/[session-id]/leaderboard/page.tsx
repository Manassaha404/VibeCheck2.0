"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { numberToUuid } from "@/utils/uuid";
import { useLeaderboard } from "@/hook/quiz/host/useLeaderboard";
import PageLoader from "@/components/PageLoader";

export default function LeaderboardPage({
  params,
}: {
  params: Promise<{ id: string; "session-id": string }>;
}) {
  const { id, "session-id": sessionId } = React.use(params);
  const sessionUuid = numberToUuid(sessionId);
  const router = useRouter();

  const {
    data: leaderboardData = [],
    isLoading,
    revealedInfo,
  } = useLeaderboard(sessionUuid);

  const handleBackToSession = () =>
    router.replace(`/dashboard/quiz/${id}/session/${sessionId}`);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        {/* Back to Session button */}
        <div className="mb-10">
          <button
            onClick={handleBackToSession}
            className="group inline-flex items-center gap-3 bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] border-4 border-[var(--color-ink-charcoal)] shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] px-6 py-3 font-display font-black uppercase text-label-md btn-press hover:bg-[var(--color-electric-sun)]"
          >
            <ArrowLeft
              size={18}
              strokeWidth={3}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to Session
          </button>
        </div>

        {/* ── Correct answer reveal banner ─────────────────────────────────── */}
        {revealedInfo && (
          <div className="mb-10 relative animate-fade-up">
            <div className="absolute -inset-1 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-1 -z-10" />
            <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-5 flex flex-col gap-2">
              <p className="font-display font-black text-headline-sm uppercase text-[var(--color-ink-charcoal)]">
                ✅ Correct Answer Revealed!
              </p>
              <p className="font-body text-body-md text-[var(--color-on-surface-variant)]">
                The host has revealed the correct option(s) for the latest
                question. Check the participant view!
              </p>
            </div>
          </div>
        )}

        <LeaderboardHeader />

        {isLoading ? (
          <>
            <PageLoader />
          </>
        ) : (
          <>
            <LeaderboardPodium data={leaderboardData.slice(0, 3)} />
            <LeaderboardTable data={leaderboardData.slice(3)} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
