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

  // Format mm:ss
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex justify-between items-center bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-4 rounded-xl shadow-hard relative overflow-hidden">
      <div className="flex flex-col z-10">
        <span className="font-body text-label-md text-[var(--color-tertiary)] uppercase tracking-widest">
          Progress
        </span>
        <span className="font-display text-headline-sm font-bold">
          Question {currentQuestion}/{totalQuestions}
        </span>
      </div>

      {/* Progress Bar Graphic */}
      <div className="absolute left-0 bottom-0 h-2 bg-[var(--color-canvas-cream)] w-full border-t-2 border-[var(--color-ink-charcoal)]">
        <div
          className="h-full bg-[var(--color-leaf-green)] border-r-2 border-[var(--color-ink-charcoal)] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Timer */}
      <div
        className={`flex items-center gap-2 z-10 px-4 py-2 rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-hard ${timeLeft <= 10 ? "bg-[var(--color-vivid-coral)] text-[var(--color-pure-white)] animate-pulse" : "bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] animate-pulse"}`}
      >
        <Timer size={24} strokeWidth={2.5} className="fill-current" />
        <span className="font-display text-headline-sm font-black">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
