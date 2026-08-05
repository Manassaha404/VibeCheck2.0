import React from "react";

interface ParticipantQuestionCardProps {
  questionText: string;
  mediaUrl?: string | null;
  questionNumber?: number;
  totalQuestions?: number;
}

export default function ParticipantQuestionCard({
  questionText,
  mediaUrl,
  questionNumber,
  totalQuestions,
}: ParticipantQuestionCardProps) {
  return (
    <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] p-6 sm:p-8 md:p-10 shadow-hard-lg relative z-20 flex flex-col gap-4 sm:gap-6">
      {questionNumber !== undefined && totalQuestions !== undefined && (
        <div className="absolute top-0 left-0 bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] px-3 sm:px-4 py-1.5 sm:py-2 border-r-4 border-b-4 border-[var(--color-ink-charcoal)]">
          <span className="font-display font-bold text-xs sm:text-label-md uppercase tracking-wider">
            Q{questionNumber} / {totalQuestions}
          </span>
        </div>
      )}

      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display text-xs sm:text-label-md font-black border-4 border-[var(--color-ink-charcoal)] px-2 sm:px-3 py-1 transform rotate-12 shadow-hard z-30">
        ZING!
      </div>

      <h1
        className="font-display font-extrabold text-[var(--color-ink-charcoal)] text-center leading-tight mt-3 sm:mt-4"
        style={{ fontSize: "clamp(1.1rem, 4vw, 2.5rem)", lineHeight: 1.1 }}
      >
        {questionText}
      </h1>

      {mediaUrl && (
        <div className="w-full border-4 border-[var(--color-ink-charcoal)] shadow-hard overflow-hidden bg-[var(--color-surface-container)] max-h-[200px] sm:max-h-[320px]">
          <img
            src={mediaUrl}
            alt="Question media"
            className="w-full h-full object-contain max-h-[200px] sm:max-h-[320px]"
          />
        </div>
      )}

      {!mediaUrl && (
        <p className="font-body text-sm sm:text-body-lg text-[var(--color-on-surface-variant)] text-center">
          Think fast, time is ticking!
        </p>
      )}
    </div>
  );
}
