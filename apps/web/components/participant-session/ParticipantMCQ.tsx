import React from "react";
import { Check, X } from "lucide-react";

export interface AnswerOption {
  id: string;
  label: string;
  text: string;
  colorClass: string;
}

interface ParticipantMCQProps {
  options: AnswerOption[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
  allowMultiple?: boolean;
  selectedIds?: string[];
  disabled?: boolean;
  revealedOptionIds?: string[] | null;
}

export default function ParticipantMCQ({
  options,
  onSelect,
  selectedId,
  allowMultiple = false,
  selectedIds = [],
  disabled = false,
  revealedOptionIds = null,
}: ParticipantMCQProps) {
  const isRevealed =
    revealedOptionIds !== null && revealedOptionIds !== undefined;

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-5">
      {options.map((option) => {
        const isSelected = allowMultiple
          ? selectedIds.includes(option.id)
          : selectedId === option.id;

        const isCorrect = isRevealed && revealedOptionIds!.includes(option.id);
        const isWrong = isRevealed && !isCorrect;
        const wasMyAnswer = isSelected && isRevealed;

        return (
          <button
            key={option.id}
            onClick={() => !disabled && !isRevealed && onSelect(option.id)}
            disabled={disabled || isRevealed}
            className={[
              "border-4 border-[var(--color-ink-charcoal)] p-3 sm:p-5",
              "flex items-center gap-3 sm:gap-4 text-left transition-all duration-300",
              "focus:outline-none focus:ring-4 focus:ring-[var(--color-ink-charcoal)]/30",
              isCorrect
                ? "bg-[var(--color-leaf-green)] ring-4 ring-[var(--color-leaf-green)] shadow-[6px_6px_0px_0px_var(--color-leaf-green)] scale-[1.03] cursor-default"
                : isWrong
                  ? "opacity-40 cursor-not-allowed grayscale"
                  : disabled
                    ? "cursor-not-allowed opacity-60"
                    : "btn-press hover:brightness-95 cursor-pointer",
              !isRevealed && isSelected
                ? "ring-4 ring-[var(--color-ink-charcoal)] scale-[1.02] shadow-[6px_6px_0px_0px_var(--color-ink-charcoal)]"
                : "",
              !isRevealed
                ? option.colorClass
                : isCorrect
                  ? ""
                  : option.colorClass,
            ].join(" ")}
          >
            <span
              className={[
                "w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center",
                "font-display font-black text-sm sm:text-headline-sm transition-colors",
                isCorrect
                  ? "bg-[var(--color-ink-charcoal)] text-[var(--color-leaf-green)]"
                  : isWrong && wasMyAnswer
                    ? "bg-[var(--color-error)] text-[var(--color-pure-white)]"
                    : isSelected && !isRevealed
                      ? "bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)]"
                      : "bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)]",
              ].join(" ")}
            >
              {isCorrect ? (
                <Check size={20} strokeWidth={3} />
              ) : isWrong && wasMyAnswer ? (
                <X size={20} strokeWidth={3} />
              ) : isSelected && !isRevealed ? (
                <Check size={20} strokeWidth={3} />
              ) : (
                option.label
              )}
            </span>

            <span className="font-display text-sm sm:text-headline-sm font-bold text-[var(--color-ink-charcoal)] leading-tight">
              {option.text}
            </span>

            {isCorrect && (
              <span className="ml-auto flex-shrink-0 bg-[var(--color-ink-charcoal)] text-[var(--color-leaf-green)] text-label-sm font-bold px-2 py-1 uppercase tracking-widest animate-fade-up">
                ✓ Correct
              </span>
            )}

            {!isRevealed && allowMultiple && isSelected && (
              <span className="ml-auto flex-shrink-0 bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] text-label-sm font-bold px-2 py-1 uppercase tracking-widest">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
