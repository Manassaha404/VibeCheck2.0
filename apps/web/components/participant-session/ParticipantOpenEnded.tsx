import React, { useState } from "react";
import { Send } from "lucide-react";

interface ParticipantOpenEndedProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function ParticipantOpenEnded({
  onSubmit,
  disabled,
}: ParticipantOpenEndedProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      onSubmit(answer);
      setAnswer("");
    }
  };

  return (
    <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-xl p-6 md:p-8 shadow-hard relative mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label
          htmlFor="open-ended-answer"
          className="font-display text-headline-sm font-bold text-[var(--color-ink-charcoal)]"
        >
          Your Answer
        </label>
        <textarea
          id="open-ended-answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here..."
          className="w-full bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-xl p-4 font-body text-body-lg text-[var(--color-ink-charcoal)] placeholder-[var(--color-tertiary)] focus:outline-none focus:border-[var(--color-electric-sun)] focus:ring-4 focus:ring-[var(--color-electric-sun)]/30 resize-none transition-all"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="font-body text-label-md text-[var(--color-tertiary)]">
            {answer.length} characters
          </span>
          <button
            type="submit"
            disabled={!answer.trim() || disabled}
            className="flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-bold text-headline-sm border-2 border-[var(--color-ink-charcoal)] px-8 py-3 rounded-xl shadow-hard btn-press disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-leaf-green)] transition-colors"
          >
            Submit
            <Send size={24} strokeWidth={2.5} />
          </button>
        </div>
      </form>

      <div className="absolute -bottom-4 -left-4 bg-[var(--color-mint)] text-[var(--color-ink-charcoal)] font-display text-label-md font-black border-2 border-[var(--color-ink-charcoal)] px-3 py-1 transform -rotate-6 shadow-hard">
        Be Creative!
      </div>
    </div>
  );
}
