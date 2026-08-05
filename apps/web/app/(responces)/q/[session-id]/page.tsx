"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticipantProgress from "@/components/participant-session/ParticipantProgress";
import ParticipantQuestionCard from "@/components/participant-session/ParticipantQuestionCard";
import ParticipantMCQ, {
  AnswerOption,
} from "@/components/participant-session/ParticipantMCQ";
import ParticipantOpenEnded from "@/components/participant-session/ParticipantOpenEnded";
import ParticipantSessionNotAllowed from "@/components/participant-session/ParticipantSessionNotAllowed";
import ParticipantPasswordGate from "@/components/participant-session/ParticipantPasswordGate";
import ParticipantSessionHeader from "@/components/participant-session/ParticipantSessionHeader";
import ParticipantSidebar from "@/components/participant-session/ParticipantSidebar";
import {
  ParticipantWaitingState,
  ParticipantReadyState,
  ParticipantEndedState,
  ParticipantAnswerLockedIn,
  ParticipantTimeUp,
} from "@/components/participant-session/ParticipantSessionStates";
import { numberToUuid } from "@/utils/uuid";
import { useParticipantQuiz } from "@/hook/quiz/participant/useParticipantQuiz";
import { useParticipantStore } from "@/store/participantStore";
import { ContentLoadingState } from "@/components/ui/ContentLoadingState";

// ── Option colour palette ─────────────────────────────────────────────────────
const OPTION_COLORS = [
  "bg-[var(--color-primary-container)]",
  "bg-[var(--color-electric-sun)]",
  "bg-[var(--color-error-container)]",
  "bg-[var(--color-sky-blue)]",
  "bg-[var(--color-lavender)]",
  "bg-[var(--color-mint)]",
];
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

// ── Helper ────────────────────────────────────────────────────────────────────
const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ParticipantQuizSessionPage({
  params,
}: {
  params: Promise<{ "session-id": string }>;
}) {
  const { "session-id": sessionIdParam } = React.use(params);
  const sessionId = numberToUuid(sessionIdParam);
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    passwordInput,
    setPasswordInput,
    submittedPassword,
    showPassword,
    setShowPassword,
    passwordError,
    setPasswordError,
    handlePasswordSubmit,
    store,
    handleSubmitMCQ,
    handleSubmitOpenEnded,
  } = useParticipantQuiz(sessionId);

  useEffect(() => {
    refetch();
    return () => {
      useParticipantStore.getState().resetAll();
    };
  }, [refetch]);

  const {
    sessionStatus,
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeLeft,
    timerActive,
    selectedId,
    selectedIds,
    submitted,
    revealedOptionIds,
    rank,
    score,
  } = store;

  // Detect password errors from the server
  const isPasswordError = passwordError;

  const handleSelectSingle = (id: string) => {
    store.selectSingle(id);
  };

  const handleSelectMultiple = (id: string) => {
    store.selectMultiple(id);
  };

  const participantCount = data?.participantCount ?? 0;
  const quizTitle = data?.quiz.title ?? "Quiz Session";
  const sessionName = data?.session.name ?? "";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <ContentLoadingState />
        <Footer />
      </>
    );
  }

  if (data?.notAllowedToJoin) {
    return <ParticipantSessionNotAllowed />;
  }

  // ── Password gate screen ──────────────────────────────────────────────────
  const showPasswordGate =
    isPasswordError ||
    (isError && error?.message?.includes("UNAUTHORIZED")) ||
    (data?.quiz.passwordNeeded && !submittedPassword && !data?.isParticipant);

  if (showPasswordGate || (!data && !isLoading)) {
    return (
      <ParticipantPasswordGate
        isError={isError}
        isPasswordError={isPasswordError}
        error={error}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        setPasswordError={setPasswordError}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  const buildOptions = (): AnswerOption[] => {
    if (!currentQuestion || currentQuestion.isTextAnswer) return [];
    return currentQuestion.options.map((opt, i) => ({
      id: opt.id,
      label: OPTION_LABELS[i] ?? String(i + 1),
      text: opt.text,
      colorClass: OPTION_COLORS[i % OPTION_COLORS.length]!,
    }));
  };
  const answerOptions = buildOptions();

  // ── Main participant UI ───────────────────────────────────────────────────
  return (
    <div className="bg-[var(--color-canvas-cream)] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-3 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 relative">
        {/* ── Left: Question area ──────────────────────────────────────────── */}
        <section className="flex-grow flex flex-col gap-3 sm:gap-5 w-full min-w-0">
          {/* Quiz title bar */}
          <ParticipantSessionHeader
            quizTitle={quizTitle}
            sessionName={sessionName}
            sessionStatus={sessionStatus}
          />

          {/* Progress bar — only shown when question is active */}
          {currentQuestion && (
            <ParticipantProgress
              currentQuestion={questionIndex + 1}
              totalQuestions={totalQuestions || 1}
              timeLeft={timeLeft}
            />
          )}

          {/* ── State: waiting for session to start ─────────────────────── */}
          {sessionStatus === "waiting" && !currentQuestion && (
            <ParticipantWaitingState participantCount={participantCount} />
          )}

          {/* ── State: active session, no question emitted yet ───────────── */}
          {sessionStatus === "active" && !currentQuestion && (
            <ParticipantReadyState />
          )}

          {/* ── State: session ended ─────────────────────────────────────── */}
          {sessionStatus === "ended" && (
            <ParticipantEndedState onReturnHome={() => router.push("/")} />
          )}

          {/* ── State: question emitted ──────────────────────────────────── */}
          {currentQuestion && sessionStatus !== "ended" && (
            <>
              <ParticipantQuestionCard
                questionText={currentQuestion.text}
                mediaUrl={currentQuestion.mediaUrl}
                questionNumber={questionIndex + 1}
                totalQuestions={totalQuestions || undefined}
              />

              {/* MCQ or open-ended */}
              {currentQuestion.isTextAnswer ? (
                <ParticipantOpenEnded
                  onSubmit={handleSubmitOpenEnded}
                  disabled={submitted || timeLeft <= 0}
                />
              ) : (
                <>
                  <ParticipantMCQ
                    options={answerOptions}
                    onSelect={
                      currentQuestion.allowMultipleCorrect
                        ? handleSelectMultiple
                        : handleSelectSingle
                    }
                    selectedId={
                      currentQuestion.allowMultipleCorrect
                        ? undefined
                        : selectedId
                    }
                    allowMultiple={currentQuestion.allowMultipleCorrect}
                    selectedIds={selectedIds}
                    disabled={submitted || timeLeft <= 0}
                    revealedOptionIds={revealedOptionIds}
                  />

                  {/* Single-select: submit button */}
                  {!currentQuestion.allowMultipleCorrect &&
                    selectedId &&
                    !submitted && (
                      <button
                        onClick={handleSubmitMCQ}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-4 font-display font-black uppercase text-headline-sm btn-press hover:bg-[var(--color-electric-sun)] transition-colors"
                      >
                        <Send size={20} strokeWidth={2.5} />
                        Lock In Answer
                      </button>
                    )}

                  {/* Multi-select: show explicit submit button */}
                  {currentQuestion.allowMultipleCorrect &&
                    !submitted &&
                    selectedIds.length > 0 && (
                      <button
                        onClick={handleSubmitMCQ}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-4 font-display font-black uppercase text-headline-sm btn-press hover:bg-[var(--color-electric-sun)] transition-colors"
                      >
                        <Send size={20} strokeWidth={2.5} />
                        Submit {selectedIds.length} Answer
                        {selectedIds.length !== 1 ? "s" : ""}
                      </button>
                    )}
                </>
              )}

              {/* Submitted confirmation */}
              {submitted && <ParticipantAnswerLockedIn />}

              {/* Time expired without submitting */}
              {!submitted && timeLeft <= 0 && <ParticipantTimeUp />}
            </>
          )}
        </section>

        {/* ── Right: Stats sidebar ─────────────────────────────────────────── */}
        <ParticipantSidebar
          rank={rank}
          score={score}
          participantCount={participantCount}
        />
      </main>

      <Footer />
    </div>
  );
}
