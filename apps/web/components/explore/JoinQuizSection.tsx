"use client";

import React from "react";
import { Gamepad2, ArrowRight, Loader2, Zap } from "lucide-react";
import { useJoinQuiz } from "@/hook/explore/useJoinQuiz";

export default function JoinQuizSection() {
  const { joinCode, setJoinCode, isJoining, handleJoin } = useJoinQuiz();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <section className="mb-16 max-w-2xl mx-auto w-full" id="join-quiz">
      <div className="flex items-center gap-3 mb-8 border-b-4 border-[var(--color-ink-charcoal)] pb-4">
        <Gamepad2 size={28} className="text-[var(--color-electric-sun)]" />
        <div>
          <h2 className="text-headline-md font-display font-extrabold text-[var(--color-ink-charcoal)]">
            Join a Quiz
          </h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">
            Enter a code to join instantly
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl shadow-hard p-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-[var(--color-electric-sun)]" />
            <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)]">
              Quick Join
            </h3>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 font-medium">
            Got a code? Enter it here to join instantly.
          </p>

          <div className="flex gap-3">
            <input
              id="join-code-input"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              maxLength={10}
              placeholder="ABCD12"
              className="flex-1 bg-[var(--color-canvas-cream)] border-4 border-[var(--color-ink-charcoal)] rounded-xl py-3 px-5 text-body-lg font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-[var(--color-electric-sun)] transition-colors shadow-hard-sm placeholder:text-[var(--color-outline)] placeholder:tracking-normal placeholder:font-sans placeholder:font-normal"
            />
            <button
              onClick={handleJoin}
              disabled={isJoining || !joinCode.trim()}
              className="bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] px-6 py-3 rounded-xl font-display font-bold shadow-hard hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isJoining ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowRight size={18} />
              )}
              {isJoining ? "Joining..." : "Join"}
            </button>
          </div>

          <div className="mt-8 border-2 border-dashed border-[var(--color-outline)] rounded-xl p-5 bg-[var(--color-canvas-cream)] text-center">
            <Gamepad2
              size={36}
              className="mx-auto mb-2 text-[var(--color-on-surface-variant)]"
            />
            <p className="text-sm font-semibold text-[var(--color-on-surface-variant)]">
              The host will give you a code when the session is ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
