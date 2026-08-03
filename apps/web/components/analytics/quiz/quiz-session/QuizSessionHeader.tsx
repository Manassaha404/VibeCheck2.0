import React from "react";
import { Wifi, Rocket, Archive, Zap, Loader2 } from "lucide-react";
import { trpc } from "@/trpc/client";

interface QuizSessionHeaderProps {
  quizId?: string;
  status?: string;
  onStatusChange?: () => void;
}

export function QuizSessionHeader({
  quizId,
  status = "active",
  onStatusChange,
}: QuizSessionHeaderProps) {
  const activateQuiz = trpc.quiz.activateItem.useMutation({
    onSuccess: () => {
      onStatusChange?.();
    },
  });

  return (
    <header className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
      <div className="relative z-10">
        <div className="absolute -top-12 -left-12 rotate-[-15deg] hidden md:block">
          <div className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-black text-2xl p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard transform hover:scale-110 transition-transform cursor-crosshair">
            VIBE!
          </div>
        </div>

        <h1 className="font-display-lg text-display-lg md:text-[96px] md:leading-[90px] font-black uppercase text-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] inline-block p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard mb-4 -rotate-1 relative z-10">
          SESSION:
        </h1>
        <br />
        <h2 className="font-display-lg text-display-lg md:text-[64px] md:leading-[70px] font-black uppercase text-[var(--color-pure-white)] bg-[var(--color-primary)] inline-block p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard rotate-1 relative z-20 max-w-[720px] break-words">
          CONTROL HUB
        </h2>

        <div className="mt-8 font-body font-bold text-xl md:text-xl text-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)] inline-block p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard rotate-[-1deg] relative z-30 max-w-2xl">
          Manage your active quiz, track performance, and vibe with your
          audience in real-time.
        </div>

        <div className="mt-6 flex items-center gap-3">
          {status === "archived" ? (
            <>
              <span className="font-headline-sm text-sm font-black uppercase px-4 py-1.5 border-2 border-[var(--color-ink-charcoal)] inline-flex items-center gap-2 bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] shadow-hard">
                <Archive size={14} strokeWidth={3} />
                ARCHIVED
              </span>
              {quizId && (
                <button
                  onClick={() => activateQuiz.mutate({ quizId })}
                  disabled={activateQuiz.isPending}
                  className="font-headline-sm text-sm font-black uppercase px-4 py-1.5 border-2 border-[var(--color-ink-charcoal)] inline-flex items-center gap-2 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] hover:bg-opacity-90 shadow-hard btn-press disabled:opacity-50"
                >
                  {activateQuiz.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Zap size={14} strokeWidth={3} />
                  )}
                  ACTIVATE QUIZ
                </button>
              )}
            </>
          ) : (
            <span className="font-headline-sm text-sm font-black uppercase px-4 py-1.5 border-2 border-[var(--color-ink-charcoal)] inline-flex items-center gap-2 bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)] shadow-hard">
              <Wifi size={14} strokeWidth={3} />
              LIVE READY
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 md:gap-8 flex-col sm:flex-row w-full md:w-auto relative z-30">
        <div className="bg-electric-sun text-ink-charcoal border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform w-full sm:w-56 cursor-pointer group">
          <Rocket
            size={48}
            strokeWidth={2.5}
            className="group-hover:animate-wiggle mb-4"
          />
          <span className="font-headline-sm text-sm uppercase font-black text-center opacity-90">
            SYSTEM STATUS
          </span>
          <span className="font-display-lg text-[40px] mt-2 font-black leading-none text-center">
            READY
          </span>
        </div>
      </div>
    </header>
  );
}
