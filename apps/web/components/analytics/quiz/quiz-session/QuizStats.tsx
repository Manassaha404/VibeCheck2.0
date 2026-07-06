import React from "react";
import { TrendingUp } from "lucide-react";

export function QuizStats({ totalQuestions, totalParticipants }: { totalQuestions: number; totalParticipants: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-6 flex flex-col justify-between gap-2 h-full">
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-body text-[var(--color-ink-charcoal)] opacity-70">Total Questions</span>
          <span className="text-[32px] md:text-headline-lg font-display font-extrabold text-[var(--color-ink-charcoal)] leading-[1]">{totalQuestions}</span>
        </div>
        <div className="w-full flex items-center h-5 mt-2">
          <div className="w-full h-3 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-leaf-green)] border-r-2 border-[var(--color-ink-charcoal)] w-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-6 flex flex-col justify-between gap-2 h-full">
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-body text-[var(--color-ink-charcoal)] opacity-70">Total Participants</span>
          <span className="text-[32px] md:text-headline-lg font-display font-extrabold text-[var(--color-ink-charcoal)] leading-[1]">{totalParticipants.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 h-5 text-label-sm font-body text-[var(--color-leaf-green)] font-bold">
          <TrendingUp className="w-4 h-4" /> +12% this week
        </div>
      </div>
    </div>
  );
}
