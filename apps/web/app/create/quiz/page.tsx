"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizHero from "@/components/create-quiz/QuizHero";
import QuizBasicInfo from "@/components/create-quiz/QuizBasicInfo";
import { useInitDraftQuiz } from "@/hook/quiz/host/useInitDraftQuiz";
import { useQuizStore } from "@/store/quizStore";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CreateQuizPage() {
  const { initDraft, isSubmitting } = useInitDraftQuiz();
  const title = useQuizStore((s) => s.info.title);

  return (
    <div className="bg-canvas-cream text-ink-charcoal font-body min-h-screen flex flex-col bg-dot-pattern selection:bg-electric-sun selection:text-ink-charcoal">
      <Navbar />

      <main className="flex-grow relative overflow-hidden py-8 sm:py-16 px-3 sm:px-6 md:px-10 flex justify-center w-full">
        <div className="w-full max-w-[1280px] mx-auto flex justify-center">
          {/* Main Form Column */}
          <div className="w-full max-w-4xl flex flex-col gap-8 sm:gap-12 z-10">
            <QuizHero />

            {/* Step indicator */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 w-full">
              <div className="flex items-center gap-1 sm:gap-2 bg-electric-sun border-2 border-ink-charcoal px-3 sm:px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] sm:shadow-hard-sm font-label-md text-xs sm:text-label-md font-black uppercase tracking-wide">
                <span className="bg-ink-charcoal text-electric-sun rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-black">
                  1
                </span>
                <span className="hidden sm:inline">Quiz Info</span>
                <span className="sm:hidden">Info</span>
              </div>
              <div className="h-0.5 w-4 sm:w-8 bg-ink-charcoal/30" />
              <div className="flex items-center gap-1 sm:gap-2 border-2 border-ink-charcoal/30 px-3 sm:px-4 py-1.5 font-label-md text-xs sm:text-label-md font-black uppercase tracking-wide text-ink-charcoal/40">
                <span className="border border-ink-charcoal/30 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-black">
                  2
                </span>
                Questions
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 w-full">
              <QuizBasicInfo />
            </div>

            {/* Continue button */}
            <div className="mt-4 mb-8 flex justify-center">
              <button
                id="continue-to-questions-btn"
                onClick={initDraft}
                disabled={isSubmitting || !title.trim()}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-ink-charcoal text-pure-white border-4 border-ink-charcoal py-4 sm:py-6 px-4 sm:px-12 font-display-lg text-2xl sm:text-display-lg uppercase font-black tracking-tight shadow-[4px_4px_0px_0px_#F5C800] sm:shadow-[8px_8px_0px_0px_#F5C800] hover:translate-x-[2px] hover:translate-y-[2px] sm:hover:translate-x-[4px] sm:hover:translate-y-[4px] active:shadow-none transition-all duration-200 relative overflow-hidden group text-center"
              >
                {/* Hover sweep */}
                <div className="absolute inset-0 bg-electric-sun -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-ink-charcoal transition-colors duration-300 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={32} />
                      <span>Creating Draft...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Continue to Questions</span>
                      <span className="sm:hidden">Questions</span>
                      <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
