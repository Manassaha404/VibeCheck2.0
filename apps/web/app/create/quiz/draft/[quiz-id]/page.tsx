"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard from "@/components/create-quiz/QuestionCard";
import AddQuestionButton from "@/components/create-quiz/AddQuestionButton";
import AgentChatToggleFAB from "@/components/agent-chat/AgentChatToggleFAB";
import { useQuizStore } from "@/store/quizStore";
import { trpc } from "@/trpc/client";
import { numberToUuid } from "@/utils/uuid";
import { usePublishDraftQuiz } from "@/hook/quiz/host/usePublishDraftQuiz";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DraftQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = numberToUuid(params["quiz-id"] as string);

  // Seed the store with the draft's info/settings (created in Step 1)
  const { data, isLoading, isError } = trpc.quiz.getQuizForEdit.useQuery(
    { quizId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const [isInitialized, setIsInitialized] = useState(false);
  const questions = useQuizStore((s) => s.questions);
  const setInfo = useQuizStore((s) => s.setInfo);
  const setGlobalSettings = useQuizStore((s) => s.setGlobalSettings);
  const reorderQuestions = useQuizStore((s) => s.reorderQuestions);

  // Seed store with the draft data so globalSettings defaults are correct
  useEffect(() => {
    if (data && !isInitialized) {
      setInfo({
        title: data.quiz.title,
        description: data.quiz.description || "",
      });
      setGlobalSettings({
        passwordProtect: data.quiz.passwordNeeded,
        password: data.quiz.password || "",
      });
      // Start with an empty questions list — the user will build them fresh
      reorderQuestions([]);
      setIsInitialized(true);
    }
  }, [data, isInitialized, setInfo, setGlobalSettings, reorderQuestions]);

  const { publishQuiz, isSubmitting } = usePublishDraftQuiz(quizId);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading || !isInitialized) {
    return (
      <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col justify-center items-center bg-dot-pattern selection:bg-electric-sun selection:text-ink-charcoal">
        <Loader2 className="animate-spin text-ink-charcoal mb-4" size={48} />
        <h2 className="font-display text-headline-md">Loading question builder...</h2>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col justify-center items-center bg-dot-pattern gap-4">
        <h2 className="font-display text-headline-md text-red-500">
          Failed to load quiz draft
        </h2>
        <Link href="/create/quiz" className="underline font-bold text-lg">
          Start over
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col bg-dot-pattern selection:bg-electric-sun selection:text-ink-charcoal">
      <Navbar />

      <main className="flex-grow relative overflow-hidden py-8 md:py-16 px-4 md:px-10 flex justify-center w-full">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center">
          {/* Back link + step indicator */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-8">
            <Link
              href="/create/quiz"
              className="bg-pure-white text-label-md font-body font-bold text-ink-charcoal px-5 py-2.5 border-2 border-ink-charcoal shadow-hard-sm btn-press transition-all flex items-center gap-2 uppercase"
            >
              <ArrowLeft size={18} />
              Back to Info
            </Link>

            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border-2 border-ink-charcoal/30 px-4 py-1.5 font-label-md text-label-md font-black uppercase tracking-wide text-ink-charcoal/40">
                <span className="border border-ink-charcoal/30 rounded-full w-6 h-6 flex items-center justify-center text-sm font-black">
                  1
                </span>
                Quiz Info
              </div>
              <div className="h-0.5 w-8 bg-ink-charcoal" />
              <div className="flex items-center gap-2 bg-electric-sun border-2 border-ink-charcoal px-4 py-1.5 shadow-hard-sm font-label-md text-label-md font-black uppercase tracking-wide">
                <span className="bg-ink-charcoal text-electric-sun rounded-full w-6 h-6 flex items-center justify-center text-sm font-black">
                  2
                </span>
                Questions
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full max-w-4xl flex flex-col gap-12 z-10">
            {/* Header */}
            <div className="flex justify-center mb-4">
              <div className="relative inline-block">
                <h1 className="font-display-lg text-display-lg uppercase font-black italic -rotate-3 bg-vivid-coral text-pure-white px-8 py-4 border-4 border-ink-charcoal shadow-hard relative z-10 tracking-tighter">
                  ADD QUESTIONS
                </h1>
                <div
                  aria-hidden="true"
                  className="absolute -top-4 -right-6 text-ink-charcoal rotate-12 z-0 opacity-10"
                >
                  <Zap size={80} fill="currentColor" strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Quiz title pill */}
            <div className="-mt-6 flex justify-center">
              <div className="bg-pure-white border-2 border-ink-charcoal px-6 py-2 shadow-hard-sm font-label-md text-label-md uppercase tracking-wide text-ink-charcoal/70 max-w-full truncate">
                📝 &nbsp;{data.quiz.title}
              </div>
            </div>

            {/* Question Builder Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg font-black uppercase tracking-tight">
                Questions
              </h2>
              <div className="font-label-md text-label-md bg-surface-container-high border-2 border-ink-charcoal px-4 py-1 shadow-hard-sm">
                Total: {questions.length}
              </div>
            </div>

            {/* Empty state */}
            {questions.length === 0 && (
              <div className="border-4 border-dashed border-ink-charcoal/30 py-16 flex flex-col items-center gap-4 text-ink-charcoal/50">
                <Zap size={48} strokeWidth={1.5} />
                <p className="font-headline-sm text-headline-sm font-bold uppercase">
                  No questions yet
                </p>
                <p className="font-body-md text-body-md">
                  Click "Add Question" below to get started
                </p>
              </div>
            )}

            {/* Question Cards */}
            <div className="flex flex-col gap-10">
              {questions.map((q, index) => (
                <QuestionCard key={q.id} questionId={q.id} number={index + 1} />
              ))}
            </div>

            <AddQuestionButton />

            {/* Divider */}
            <div className="w-full border-t-8 border-ink-charcoal border-dashed my-2" />

            {/* Publish button */}
            <div className="mb-8 flex justify-center">
              <motion.button
                id="publish-quiz-btn"
                onClick={publishQuiz}
                disabled={isSubmitting || questions.length === 0}
                whileHover={questions.length > 0 ? { scale: 1.01 } : {}}
                whileTap={questions.length > 0 ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-3 bg-leaf-green text-ink-charcoal border-4 border-ink-charcoal py-6 px-12 font-display-lg text-display-lg uppercase font-black tracking-tight shadow-[8px_8px_0px_0px_#2C2E2A] hover:shadow-[4px_4px_0px_0px_#2C2E2A] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-ink-charcoal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-leaf-green transition-colors duration-300 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={32} />
                      <span>Publishing Quiz...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={32} strokeWidth={3} fill="currentColor" />
                      Publish Quiz
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Quiz Maker Agent Chat FAB ── */}
      <AgentChatToggleFAB quizId={quizId} />
    </div>
  );
}
