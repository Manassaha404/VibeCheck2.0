"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Timer,
  Play,
  Square,
  ChevronRight,
  Lock,
  Hourglass,
  Zap,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveHeader from "@/components/live-session/LiveHeader";
import LiveControls from "@/components/live-session/LiveControls";
import QuestionDisplay from "@/components/live-session/QuestionDisplay";
import MultipleChoiceAnswers, {
  AnswerOption,
} from "@/components/live-session/MultipleChoiceAnswers";
import LiveFeedWordCloud, {
  FeedMessage,
} from "@/components/live-session/LiveFeedMasonry";
import { useGetSessionForHost } from "@/hook/quiz/host/useGetSessionForHost";
import { useEmitQuestion } from "@/hook/quiz/host/useEmitQuestion";
import { useActivateSession } from "@/hook/quiz/host/useActivateSession";
import { useEndSession } from "@/hook/quiz/host/useEndSession";
import { useHostSocket } from "@/hook/quiz/host/useHostSocket";
import { useLiveSessionStore } from "@/store/liveSessionStore";
import { numberToUuid } from "@/utils/uuid";
import type { LiveQuestion } from "@/store/participantStore"; // used for socket payload typing
import PageLoader from "@/components/PageLoader";
import { DashboardError } from "@/components/Dashboard/DashboardError";

// ── Option colour palette (cycles by index) ───────────────────────────────────
const OPTION_COLORS = [
  "bg-[var(--color-electric-sun)]",
  "bg-[var(--color-leaf-green)]",
  "bg-[var(--color-sky-blue)]",
  "bg-[var(--color-vivid-coral)]",
  "bg-[var(--color-inverse-primary)]",
  "bg-[var(--color-surface-tint)]",
];
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LiveSessionPage({
  params,
}: {
  params: Promise<{ id: string; "session-id": string }>;
}) {
  const { id: quizIdParam, "session-id": sessionIdParam } = React.use(params);
  const quizId = numberToUuid(quizIdParam);
  const sessionId = numberToUuid(sessionIdParam);
  const router = useRouter();

  // ── Server data ───────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useGetSessionForHost(sessionId);

  const sessionStatus = data?.session.status ?? "waiting";
  const questions = data?.questions ?? [];
  const totalQuestions = questions.length;
  const joinCode = data?.session.joinCode ?? "";
  const autoActivatesAt = data?.session.autoActivatesAt
    ? new Date(data.session.autoActivatesAt)
    : null;

  // ── Open-ended live feed messages ───────────────────────────────────────────────────
  const [openEndedMessages, setOpenEndedMessages] = useState<FeedMessage[]>([]);

  // ── Socket: live participant count + vote tallies ─────────────────────────
  const {
    participantCount,
    revealAnswer,
    emitSessionActivated,
    emitSessionEnded,
  } = useHostSocket(
    sessionId,
    data?.participantCount ?? 0,
    setOpenEndedMessages,
  );

  // ── Zustand live store ────────────────────────────────────────────────────────────
  const {
    currentQuestionIndex,
    voteTallies,
    questionTimerRunning,
    questionTimeLeft,
    tickTimer,
    initSession,
    revealedCorrectOptionIds,
    setRevealedAnswer,
  } = useLiveSessionStore();

  // Init store once session data arrives
  const storeInitialised = useRef(false);
  useEffect(() => {
    if (data && !storeInitialised.current) {
      storeInitialised.current = true;
      initSession(sessionId, {
        currentQuestionIndex: data.liveState?.currentQuestionIndex ?? -1,
        voteTallies: data.liveState?.voteTallies ?? {},
      });
    }
  }, [data, sessionId, initSession]);

  // ── Current question ──────────────────────────────────────────────────────
  // Memoized so the auto-reveal effect below has a stable object reference.
  const currentQ = useMemo(
    () =>
      currentQuestionIndex >= 0
        ? (questions[currentQuestionIndex] ?? null)
        : null,
    [currentQuestionIndex, questions],
  );

  // ── Auto-reveal correct answer when the question timer expires ────────────
  const revealedRef = useRef<string | null>(null); // tracks which questionId was last revealed
  useEffect(() => {
    if (
      questionTimeLeft === 0 &&
      !questionTimerRunning &&
      currentQ &&
      currentQ.questionId !== revealedRef.current
    ) {
      revealedRef.current = currentQ.questionId;
      const correctIds = currentQ.options
        .map((o, i) => (o.isCorrect ? (o.id ?? `opt-${i}`) : null))
        .filter((id) => id !== null) as string[];
      revealAnswer(sessionId, currentQ.questionId, correctIds);
      setRevealedAnswer(correctIds);
    }
  }, [
    questionTimeLeft,
    questionTimerRunning,
    currentQ,
    sessionId,
    revealAnswer,
    setRevealedAnswer,
  ]);

  // ── Per-question countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (!questionTimerRunning) return;
    const tick = setTimeout(() => tickTimer(), 1000);
    return () => clearTimeout(tick);
  }, [questionTimerRunning, questionTimeLeft, tickTimer]);

  // ── Waiting-stage countdown to auto-activation ────────────────────────────
  const [waitingSecsLeft, setWaitingSecsLeft] = useState(0);
  useEffect(() => {
    if (sessionStatus !== "waiting" || !autoActivatesAt) return;
    const update = () => {
      const diff = Math.max(
        0,
        Math.floor((autoActivatesAt.getTime() - Date.now()) / 1000),
      );
      setWaitingSecsLeft(diff);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sessionStatus, autoActivatesAt]);

  const { emitQuestion, isPending: emitting } = useEmitQuestion();

  const { activateSession, isPending: activating } = useActivateSession({
    onSuccess: () => {
      // Refetch server state so questions array and session status are fresh
      refetch();
      emitSessionActivated(sessionId);
    },
  });

  const { endSession, isPending: ending } = useEndSession({
    quizId,
    onSuccessCallback: emitSessionEnded,
  });

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleGoToLeaderboard = () =>
    router.push(
      `/dashboard/quiz/${quizIdParam}/session/${sessionIdParam}/leaderboard`,
    );

  // ── Derived state ─────────────────────────────────────────────────────────
  const timerWarning = questionTimeLeft <= 10 && questionTimerRunning;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const handleNextQuestion = useCallback(() => {
    const nextIndex =
      currentQuestionIndex === -1 ? 0 : currentQuestionIndex + 1;
    if (nextIndex < totalQuestions) {
      // Reveal current question's correct answer before advancing (if not already revealed)
      if (currentQ && currentQ.questionId !== revealedRef.current) {
        revealedRef.current = currentQ.questionId;
        const correctIds = currentQ.options
          .map((o, i) => (o.isCorrect ? (o.id ?? `opt-${i}`) : null))
          .filter((id) => id !== null) as string[];
        revealAnswer(sessionId, currentQ.questionId, correctIds);
        setRevealedAnswer(correctIds);
      }

      const nextQ = questions[nextIndex];
      // Build payload for the socket broadcast from the next question
      const nextPayload: LiveQuestion | null = nextQ
        ? {
            questionId: nextQ.questionId,
            orderIndex: nextQ.orderIndex,
            text: nextQ.text,
            options: nextQ.options.map((o) => ({
              id: o.id ?? "",
              text: o.text,
              isCorrect: o.isCorrect,
            })),
            isTextAnswer: nextQ.isTextAnswer,
            allowMultipleCorrect: nextQ.allowMultipleCorrect,
            timeLimitSecs: nextQ.timeLimitSecs,
            points: nextQ.points,
            mediaUrl: nextQ.mediaUrl,
          }
        : null;

      emitQuestion(
        sessionId,
        nextIndex,
        nextQ?.timeLimitSecs ?? 30,
        nextPayload,
      );
    }
  }, [
    currentQuestionIndex,
    totalQuestions,
    sessionId,
    questions,
    emitQuestion,
    currentQ,
    revealAnswer,
  ]);

  // ── Build answer options for MCQ display ──────────────────────────────────
  const buildAnswerOptions = (): AnswerOption[] => {
    if (!currentQ || currentQ.isTextAnswer) return [];
    const voteMap = voteTallies[currentQ.questionId] ?? {};
    return currentQ.options.map((o, i) => ({
      id: o.id ?? `opt-${i}`,
      label: OPTION_LABELS[i] ?? String(i + 1),
      text: o.text,
      colorClass: OPTION_COLORS[i % OPTION_COLORS.length]!,
      votes: voteMap[o.id ?? `opt-${i}`] ?? 0,
    }));
  };
  const answerOptions = buildAnswerOptions();
  const totalVotes = answerOptions.reduce((sum, o) => sum + o.votes, 0);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
  }

  if (isError || !data) {
    return (
      <DashboardError
        title="Failed to Load Session"
        message="Please try again later."
      />
    );
  }

  // ── Ended state → redirect banner ─────────────────────────────────────────
  if (sessionStatus === "ended") {
    return (
      <div className="bg-[var(--color-canvas-cream)] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center flex flex-col items-center gap-8">
            <div className="inline-block bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] px-6 py-3 shadow-hard rotate-1">
              <span className="font-display font-black text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
                🎉 Session Ended
              </span>
            </div>
            <p className="font-body text-body-lg text-[var(--color-on-surface-variant)]">
              The quiz session has concluded. Check out the results!
            </p>
            <button
              onClick={handleGoToLeaderboard}
              className="flex items-center gap-3 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-8 py-4 font-display font-black uppercase text-headline-sm btn-press hover:bg-[var(--color-electric-sun)] transition-colors"
            >
              <BarChart2 size={24} strokeWidth={2.5} />
              View Analytics
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Build page title ──────────────────────────────────────────────────────
  const title = (
    <>
      {data.quiz.title.split(" ").map((word, i) =>
        i === 0 ? (
          <span key={i}>{word} </span>
        ) : (
          <span
            key={i}
            className="text-[var(--color-leaf-green)]"
            style={{ WebkitTextStroke: "2px var(--color-ink-charcoal)" }}
          >
            {word}{" "}
          </span>
        ),
      )}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--color-canvas-cream)] min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 relative z-10 flex flex-col gap-12">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center w-full">
          <LiveHeader
            title={title}
            sessionId={joinCode}
            description={data.quiz.description ?? undefined}
            status={sessionStatus as "waiting" | "active" | "ended"}
          />
        </section>

        {/* ── Status strip: Participants | Stage Button | Timer ──────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Participant Count */}
          <div className="flex items-center gap-5 border-4 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] shadow-[6px_6px_0px_0px_var(--color-ink-charcoal)] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-[var(--color-sky-blue)]" />
            <div className="ml-2 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-sky-blue)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex-shrink-0">
              <Users
                size={26}
                strokeWidth={2.5}
                className="text-[var(--color-ink-charcoal)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-headline-lg leading-none text-[var(--color-ink-charcoal)]">
                {participantCount}
              </span>
              <span className="font-body text-label-md text-[var(--color-on-surface-variant)] uppercase tracking-widest">
                Participants Joined
              </span>
              <span className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-vivid-coral)] animate-pulse" />
                <span className="text-label-sm text-[var(--color-vivid-coral)] font-bold uppercase">
                  Live
                </span>
              </span>
            </div>
          </div>

          {/* Waiting: Activate button | Active: Next Question / End Session */}
          {sessionStatus === "waiting" ? (
            <button
              onClick={() => activateSession(sessionId)}
              disabled={activating}
              className="group flex items-center justify-center gap-4 border-4 border-[var(--color-ink-charcoal)] shadow-[6px_6px_0px_0px_var(--color-ink-charcoal)] p-5 font-display font-black uppercase text-headline-sm transition-all duration-150 btn-press bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] hover:bg-[var(--color-electric-sun)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {activating ? (
                <div className="w-6 h-6 border-4 border-[var(--color-ink-charcoal)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play
                  size={28}
                  strokeWidth={3}
                  className="fill-current group-hover:scale-110 transition-transform"
                />
              )}
              {activating ? "Activating…" : "Activate Now"}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Next Question */}
              <button
                onClick={handleNextQuestion}
                disabled={
                  emitting ||
                  (isLastQuestion && currentQuestionIndex >= 0) ||
                  questionTimerRunning
                }
                className="flex-1 flex items-center justify-center gap-3 border-4 border-[var(--color-ink-charcoal)] shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] p-4 font-display font-black uppercase text-headline-sm transition-all duration-150 btn-press bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] hover:bg-[var(--color-leaf-green)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emitting ? (
                  <div className="w-5 h-5 border-3 border-[var(--color-ink-charcoal)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronRight size={24} strokeWidth={3} />
                )}
                {currentQuestionIndex === -1
                  ? "Start First Question"
                  : isLastQuestion
                    ? "All Questions Done"
                    : "Next Question"}
              </button>
              {/* End Session */}
              <button
                onClick={() => endSession(sessionId)}
                disabled={ending}
                className="flex items-center justify-center gap-2 border-4 border-[var(--color-ink-charcoal)] shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] p-3 font-display font-bold uppercase text-label-md transition-all duration-150 btn-press bg-[var(--color-vivid-coral)] text-[var(--color-pure-white)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square size={16} strokeWidth={3} className="fill-current" />
                {ending ? "Ending…" : "End Session"}
              </button>
            </div>
          )}

          {/* Timer */}
          <div
            className={[
              "flex flex-col items-center justify-center border-4 border-[var(--color-ink-charcoal)]",
              "shadow-[6px_6px_0px_0px_var(--color-ink-charcoal)] p-5 relative overflow-hidden",
              sessionStatus === "waiting"
                ? "bg-[var(--color-sky-blue)]"
                : timerWarning
                  ? "bg-[var(--color-vivid-coral)]"
                  : "bg-[var(--color-electric-sun)]",
            ].join(" ")}
          >
            {/* Timer icon + label */}
            <div className="flex items-center gap-2 mb-2">
              {sessionStatus === "waiting" ? (
                <Hourglass
                  size={20}
                  strokeWidth={2.5}
                  className="text-[var(--color-ink-charcoal)]"
                />
              ) : (
                <Timer
                  size={20}
                  strokeWidth={2.5}
                  className={
                    timerWarning
                      ? "text-[var(--color-pure-white)]"
                      : "text-[var(--color-ink-charcoal)]"
                  }
                />
              )}
              <span
                className={[
                  "font-body text-label-sm uppercase tracking-widest font-bold",
                  timerWarning
                    ? "text-[var(--color-pure-white)]"
                    : "text-[var(--color-ink-charcoal)]",
                ].join(" ")}
              >
                {sessionStatus === "waiting" ? "Starts In" : "Question Timer"}
              </span>
            </div>

            {/* Countdown */}
            <span
              className={[
                "font-display font-black text-display-lg leading-none",
                timerWarning
                  ? "text-[var(--color-pure-white)] animate-pulse"
                  : sessionStatus === "active" && questionTimerRunning
                    ? "text-[var(--color-ink-charcoal)] animate-pulse"
                    : "text-[var(--color-ink-charcoal)]",
              ].join(" ")}
            >
              {sessionStatus === "waiting"
                ? formatTime(waitingSecsLeft)
                : formatTime(questionTimeLeft)}
            </span>

            {/* Active stage: status label only — timer is fully automatic */}
            {sessionStatus === "active" && (
              <div className="flex gap-3 mt-4">
                <span
                  className="text-label-sm font-body uppercase tracking-wide"
                  style={{
                    color: timerWarning
                      ? "var(--color-pure-white)"
                      : "var(--color-on-surface-variant)",
                  }}
                >
                  {currentQuestionIndex === -1
                    ? "Emit a question to start"
                    : questionTimerRunning
                      ? "Timer running…"
                      : "Timer ended"}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── Controls Grid ──────────────────────────────────────────────────────── */}
        <LiveControls
          joinCode={joinCode}
          sessionId={sessionId}
          onGoToLeaderboard={handleGoToLeaderboard}
        />

        {/* ── Questions Area ──────────────────────────────────────────────── */}
        {sessionStatus === "waiting" ? (
          /* Locked placeholder during waiting */
          <section className="relative w-full mt-4">
            {/* Tilted backing */}
            <div className="absolute -inset-2 bg-[var(--color-surface-variant)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-[4deg] z-0" />
            <div className="relative bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-8 md:p-12 z-10 min-h-[300px] flex flex-col items-center justify-center gap-6">
              {/* Locked badge */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface-container)] border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard">
                  <Lock
                    size={36}
                    strokeWidth={2.5}
                    className="text-[var(--color-on-surface-variant)]"
                  />
                </div>
                <h2 className="font-display font-black text-headline-lg uppercase text-[var(--color-ink-charcoal)] text-center">
                  Questions Locked
                </h2>
                <p className="font-body text-body-lg text-[var(--color-on-surface-variant)] text-center max-w-md">
                  Questions will be revealed once the session goes active. You
                  can activate it manually above or wait for the auto-start
                  timer.
                </p>
              </div>

              {/* Question count preview */}
              <div className="flex items-center gap-2 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-5 py-3">
                <Zap
                  size={20}
                  strokeWidth={2.5}
                  className="text-[var(--color-ink-charcoal)]"
                />
                <span className="font-display font-black text-headline-sm uppercase text-[var(--color-ink-charcoal)]">
                  {totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}{" "}
                  Ready
                </span>
              </div>
            </div>
          </section>
        ) : currentQuestionIndex === -1 ? (
          /* Active but no question emitted yet */
          <section className="relative w-full mt-4">
            <div className="absolute -inset-2 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-[4deg] z-0" />
            <div className="relative bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-8 md:p-12 z-10 min-h-[300px] flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard animate-pulse">
                  <Zap
                    size={36}
                    strokeWidth={2.5}
                    className="text-[var(--color-ink-charcoal)]"
                  />
                </div>
                <h2 className="font-display font-black text-headline-lg uppercase text-[var(--color-ink-charcoal)] text-center">
                  Session is Live!
                </h2>
                <p className="font-body text-body-lg text-[var(--color-on-surface-variant)] text-center max-w-md">
                  Press <strong>&quot;Start First Question&quot;</strong> above
                  to emit the first question to all participants.
                </p>
              </div>
            </div>
          </section>
        ) : currentQ ? (
          /* Active with question emitted */
          <>
            <QuestionDisplay
              currentQuestionIndex={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              questionText={currentQ.text}
              mediaUrl={currentQ.mediaUrl}
            >
              {!currentQ.isTextAnswer && (
                <MultipleChoiceAnswers
                  options={answerOptions}
                  totalVotes={totalVotes}
                  revealedOptionIds={revealedCorrectOptionIds}
                />
              )}
            </QuestionDisplay>

            {/* Open-ended: live feed populated via socket */}
            {currentQ.isTextAnswer && (
              <LiveFeedWordCloud messages={openEndedMessages} />
            )}
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
