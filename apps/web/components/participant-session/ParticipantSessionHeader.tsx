import React from "react";

interface ParticipantSessionHeaderProps {
  quizTitle: string;
  sessionName: string;
  sessionStatus: "waiting" | "active" | "ended";
}

export default function ParticipantSessionHeader({
  quizTitle,
  sessionName,
  sessionStatus,
}: ParticipantSessionHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] px-3 sm:px-6 py-2 sm:py-3 border-4 border-[var(--color-ink-charcoal)] shadow-hard">
      <div className="flex flex-col min-w-0 flex-grow mr-2 sm:mr-4">
        <h2 className="font-display font-black text-sm sm:text-headline-sm uppercase truncate text-[var(--color-pure-white)]">
          {quizTitle}
        </h2>
        {sessionName && (
          <span className="font-body text-label-sm text-[var(--color-canvas-cream)] opacity-80 truncate">
            {sessionName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            sessionStatus === "active"
              ? "bg-[var(--color-leaf-green)] animate-pulse"
              : sessionStatus === "waiting"
                ? "bg-[var(--color-electric-sun)]"
                : "bg-[var(--color-vivid-coral)]"
          }`}
        />
        <span
          className={`font-body text-label-sm uppercase tracking-widest ${
            sessionStatus === "active"
              ? "text-[var(--color-leaf-green)]"
              : sessionStatus === "waiting"
                ? "text-[var(--color-electric-sun)]"
                : "text-[var(--color-vivid-coral)]"
          }`}
        >
          {sessionStatus === "waiting"
            ? "Waiting"
            : sessionStatus === "active"
              ? "Live"
              : "Ended"}
        </span>
      </div>
    </div>
  );
}
