import React from 'react';

export interface AnswerOption {
  id: string;
  label: string;
  text: string;
  votes: number;
  colorClass: string; 
}

interface MultipleChoiceAnswersProps {
  options: AnswerOption[];
  totalVotes: number;
  revealedOptionIds?: string[] | null;
}

export default function MultipleChoiceAnswers({ options, totalVotes, revealedOptionIds = null }: MultipleChoiceAnswersProps) {
  const isRevealed = revealedOptionIds !== null;

  return (
    <div className="flex flex-col gap-6 mt-12 w-full">
      {options.map((option, index) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        // Alternate tilt for the badges
        const badgeRotation = index % 2 === 0 ? 'rotate-2' : '-rotate-2';

        const isCorrect = isRevealed && revealedOptionIds!.includes(option.id);
        const isWrong = isRevealed && !isCorrect;

        return (
          <div key={option.id} className={[
            "relative w-full h-16 border-4 border-[var(--color-ink-charcoal)] flex items-center overflow-hidden transition-all duration-500",
            isCorrect ? "bg-[var(--color-leaf-green)] shadow-[8px_8px_0px_0px_var(--color-leaf-green)] scale-[1.02] animate-pulse" : "bg-[var(--color-surface-container)] shadow-hard",
            isWrong ? "opacity-40 grayscale" : ""
          ].join(" ")}>
            {/* Progress bar background */}
            <div 
              className={`absolute top-0 left-0 h-full ${!isRevealed ? option.colorClass : isCorrect ? 'bg-[var(--color-leaf-green)]' : option.colorClass} border-r-4 border-[var(--color-ink-charcoal)] transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
            
            <div className="relative z-10 flex justify-between w-full px-6 items-center">
              <span className={[
                "font-display font-bold text-headline-sm z-20 flex items-center gap-2",
                isCorrect ? "text-[var(--color-pure-white)] mix-blend-normal drop-shadow-md" : "text-[var(--color-ink-charcoal)] mix-blend-hard-light"
              ].join(" ")}>
                {isCorrect && <span>✓</span>}
                {option.label}: {option.text}
              </span>
              <span className={`font-display font-bold text-headline-sm bg-[var(--color-pure-white)] px-3 py-1 border-2 border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] ${badgeRotation} z-20`}>
                {option.votes} Vibes
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
