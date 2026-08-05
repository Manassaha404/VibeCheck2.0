import React from "react";
import { Hourglass, Users, Zap, CheckCircle2, Timer } from "lucide-react";

export function ParticipantWaitingState({
  participantCount,
}: {
  participantCount: number;
}) {
  return (
    <div className="relative flex-grow flex items-center justify-center">
      <div className="absolute -inset-2 bg-[var(--color-sky-blue)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-2 -z-10" />
      <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-6 text-center w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center animate-pulse">
          <Hourglass
            size={28}
            strokeWidth={2.5}
            className="text-[var(--color-ink-charcoal)]"
          />
        </div>
        <div>
          <h2 className="font-display font-black text-lg sm:text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
            Waiting for Host
          </h2>
          <p className="font-body text-sm sm:text-body-lg text-[var(--color-on-surface-variant)] mt-2 max-w-sm">
            Sit tight! The host will start the session soon. Get ready to answer
            fast!
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-4 sm:px-6 py-2 sm:py-3">
          <Users
            size={18}
            strokeWidth={2.5}
            className="text-[var(--color-ink-charcoal)]"
          />
          <span className="font-display font-black text-sm sm:text-headline-sm uppercase text-[var(--color-ink-charcoal)]">
            {participantCount} Player{participantCount !== 1 ? "s" : ""} Ready
          </span>
        </div>
      </div>
    </div>
  );
}

export function ParticipantReadyState() {
  return (
    <div className="relative flex-grow flex items-center justify-center">
      <div className="absolute -inset-2 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl rotate-1 -z-10" />
      <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-6 text-center w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-vivid-coral)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center animate-bounce">
          <Zap
            size={28}
            strokeWidth={2.5}
            className="text-[var(--color-pure-white)]"
          />
        </div>
        <h2 className="font-display font-black text-lg sm:text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
          Get Ready!
        </h2>
        <p className="font-body text-sm sm:text-body-lg text-[var(--color-on-surface-variant)] max-w-sm">
          The session is live! First question is coming any moment…
        </p>
      </div>
    </div>
  );
}

export function ParticipantEndedState({
  onReturnHome,
}: {
  onReturnHome: () => void;
}) {
  return (
    <div className="relative flex-grow flex items-center justify-center">
      <div className="absolute -inset-2 bg-[var(--color-vivid-coral)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-2 -z-10" />
      <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-6 text-center w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-error-container)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center">
          <CheckCircle2
            size={28}
            strokeWidth={2.5}
            className="text-[var(--color-error)]"
          />
        </div>
        <div>
          <h2 className="font-display font-black text-lg sm:text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
            Session Ended
          </h2>
          <p className="font-body text-sm sm:text-body-lg text-[var(--color-on-surface-variant)] mt-2 max-w-sm">
            This quiz session has concluded. The final leaderboard will be
            available shortly!
          </p>
        </div>
        <button
          onClick={onReturnHome}
          className="w-full sm:w-auto flex items-center justify-center gap-2 mt-2 sm:mt-4 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-3 font-display font-black uppercase text-label-md btn-press"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export function ParticipantAnswerLockedIn() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-[var(--color-leaf-green)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-4 sm:px-6 py-3 sm:py-4 animate-fade-up">
      <CheckCircle2
        size={20}
        strokeWidth={2.5}
        className="text-[var(--color-ink-charcoal)]"
      />
      <span className="font-display font-black text-sm sm:text-headline-sm uppercase text-[var(--color-ink-charcoal)]">
        Answer Locked In! ⚡
      </span>
    </div>
  );
}

export function ParticipantTimeUp() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-[var(--color-vivid-coral)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-4 sm:px-6 py-3 sm:py-4 animate-fade-up">
      <Timer
        size={20}
        strokeWidth={2.5}
        className="text-[var(--color-pure-white)]"
      />
      <span className="font-display font-black text-sm sm:text-headline-sm uppercase text-[var(--color-pure-white)]">
        Time&apos;s Up!
      </span>
    </div>
  );
}
