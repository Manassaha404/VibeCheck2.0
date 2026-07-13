import React from "react";
import Image from "next/image";

interface QuestionDisplayProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionText: string;
  /** Optional media image URL attached to the question */
  mediaUrl?: string | null;
  children?: React.ReactNode;
}

export default function QuestionDisplay({
  currentQuestionIndex,
  totalQuestions,
  questionText,
  mediaUrl,
  children,
}: QuestionDisplayProps) {
  return (
    <section className="relative w-full mt-4">
      <div className="absolute -inset-2 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-[4deg] z-0"></div>
      <div className="relative bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-8 md:p-12 z-10 min-h-[300px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] px-4 py-2 border-l-4 border-b-4 border-[var(--color-ink-charcoal)]">
          <span className="font-display font-bold text-headline-sm uppercase tracking-wide">
            Q{currentQuestionIndex} OF {totalQuestions}
          </span>
        </div>
        <h2
          className="font-display font-black text-[var(--color-ink-charcoal)] mb-6 mt-4 uppercase max-w-4xl leading-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
        >
          {questionText}
        </h2>

        {/* Media image — shown when question has an attached image */}
        {mediaUrl && (
          <div className="relative w-full max-h-[360px] border-4 border-[var(--color-ink-charcoal)] shadow-hard mb-8 overflow-hidden bg-[var(--color-surface-container)]">
            <img
              src={mediaUrl}
              alt="Question media"
              className="w-full h-full object-contain max-h-[360px]"
            />
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
