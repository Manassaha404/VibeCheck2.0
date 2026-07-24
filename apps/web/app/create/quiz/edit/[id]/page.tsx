"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizHero from "@/components/create-quiz/QuizHero";
import QuizBasicInfo from "@/components/create-quiz/QuizBasicInfo";
import QuizSettings from "@/components/create-quiz/QuizSettings";
import QuestionCard from "@/components/create-quiz/QuestionCard";
import AddQuestionButton from "@/components/create-quiz/AddQuestionButton";
import EditButton from "@/components/create-quiz/EditButton";
import { useQuizStore } from "@/store/quizStore";
import { useLoadQuizData } from "@/hook/quiz/host/useLoadQuizData";
import { numberToUuid } from "@/utils/uuid";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import AgentChatToggleFAB from "@/components/agent-chat/AgentChatToggleFAB";
import PageLoader from "@/components/PageLoader";
import { ContentErrorState } from "@/components/ui/ContentErrorState";

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = numberToUuid(params.id as string);

  const { data, isLoading, isError, isInitialized } = useLoadQuizData(quizId);

  const questions = useQuizStore((s) => s.questions);

  if (isLoading || !isInitialized) {
      return (
        <>
          <Navbar />
          <PageLoader />
          <Footer />
        </>
  
      );
    }

  if (isError) {
      return (
        <>
          <Navbar />
          <ContentErrorState kind="quiz" />
          <Footer />
        </>
      );
    }

  return (
    <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col bg-dot-pattern selection:bg-electric-sun selection:text-ink-charcoal">
      <Navbar />

      <main className="flex-grow relative overflow-hidden py-8 md:py-16 px-4 md:px-10 flex justify-center w-full">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center">
          {/* Back Button Container */}
          <div className="w-full max-w-4xl flex justify-start mb-6">
            <Link
              href={`/dashboard/quiz/${params.id}`}
              className="bg-[var(--color-pure-white)] text-label-md font-body font-bold text-[var(--color-ink-charcoal)] px-6 py-3 border-2 border-[var(--color-ink-charcoal)] shadow-hard btn-press transition-all flex items-center justify-center gap-2 uppercase self-start w-max"
            >
              <ArrowLeft size={20} />
              Back to Session Hub
            </Link>
          </div>

          {/* Main Form Column */}
          <div className="w-full max-w-4xl flex flex-col gap-12 z-10">
            <QuizHero />

            <div className="flex flex-col items-center text-center gap-4 w-full">
              <QuizBasicInfo />
            </div>

            <QuizSettings />

            {/* Divider */}
            <div className="w-full border-t-8 border-ink-charcoal border-dashed my-4" />

            {/* Question Builder Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg font-black uppercase tracking-tight">
                Questions
              </h2>
              <div className="font-label-md text-label-md bg-surface-container-high border-2 border-ink-charcoal px-4 py-1 shadow-hard-sm">
                Total: {questions.length}
              </div>
            </div>

            {/* Question Cards */}
            <div className="flex flex-col gap-10">
              {questions.map((q, index) => (
                <QuestionCard key={q.id} questionId={q.id} number={index + 1} />
              ))}
            </div>

            <AddQuestionButton />

            <EditButton quizId={quizId} />
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Quiz Maker Agent Chat FAB ── */}
      <AgentChatToggleFAB quizId={quizId} />
    </div>
  );
}
