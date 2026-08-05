import React from "react";
import { Timer } from "lucide-react";

interface ParticipantProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
}

export default function ParticipantProgress({
  currentQuestion,
  totalQuestions,
  timeLeft,
}: ParticipantProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex justify-between items-center bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-3 sm:p-4 rounded-xl shadow-hard relative overflow-hidden">
      <div className="flex flex-col z-10">
        <span className="font-body text-[10px] sm:text-label-md text-[var(--color-tertiary)] uppercase tracking-widest">
          Progress
        </span>
        <span className="font-display text-sm sm:text-headline-sm font-bold">
          Question {currentQuestion}/{totalQuestions}
        </span>
      </div>

      <div className="absolute left-0 bottom-0 h-2 bg-[var(--color-canvas-cream)] w-full border-t-2 border-[var(--color-ink-charcoal)]">
        <div
          className="h-full bg-[var(--color-leaf-green)] border-r-2 border-[var(--color-ink-charcoal)] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div
        className={`flex items-center gap-1.5 sm:gap-2 z-10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-hard ${timeLeft <= 10 ? "bg-[var(--color-vivid-coral)] text-[var(--color-pure-white)] animate-pulse" : "bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] animate-pulse"}`}
      >
        <Timer size={18} strokeWidth={2.5} className="fill-current sm:w-6 sm:h-6" />
        <span className="font-display text-sm sm:text-headline-sm font-black">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
