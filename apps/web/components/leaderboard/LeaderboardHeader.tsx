"use client";

import React from "react";
import { Trophy, Zap, Star, Sparkles } from "lucide-react";

export function LeaderboardHeader() {
  return (
    <div className="text-center mb-20 md:mb-28 relative z-10 flex flex-col items-center">

      {/* Floating decorative confetti blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <div className="absolute -top-4 left-[10%] w-8 h-8 bg-[var(--color-vivid-coral)] border-2 border-[var(--color-ink-charcoal)] rotate-12 shadow-hard-sm animate-float-slow" />
        <div className="absolute top-8 right-[12%] w-6 h-6 bg-[var(--color-sky-blue)] border-2 border-[var(--color-ink-charcoal)] rounded-full shadow-hard-sm animate-float-medium" />
        <div className="absolute -top-2 right-[30%] w-5 h-5 bg-[var(--color-mint)] border-2 border-[var(--color-ink-charcoal)] rotate-45 shadow-hard-sm animate-float-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-12 left-[28%] w-4 h-4 bg-[var(--color-tangerine)] border-2 border-[var(--color-ink-charcoal)] rounded-full shadow-hard-sm animate-float-medium" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-2 left-[50%] w-5 h-5 bg-[var(--color-lavender)] border-2 border-[var(--color-ink-charcoal)] rotate-[-20deg] shadow-hard-sm animate-float-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main hero title block */}
      <div className="relative inline-block -rotate-1 mb-8">
        {/* Crown badge pinned above */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] rounded-full w-20 h-20 flex items-center justify-center shadow-hard-lg animate-wiggle">
          <Trophy size={36} strokeWidth={2.5} className="text-[var(--color-ink-charcoal)]" />
        </div>

        <div className="bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] pt-16 pb-8 px-10 md:px-16 shadow-hard-xl animate-border-shift">
          <h1 className="text-display-lg uppercase text-[var(--color-ink-charcoal)] leading-none tracking-tight text-center relative z-10">
            VIBE<br />
            <span className="relative inline-block">
              CHAMPIONS
              <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-[var(--color-pure-white)] -z-10 select-none" aria-hidden>CHAMPIONS</span>
            </span>
          </h1>

          {/* Inline accent icons */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <Star size={18} fill="currentColor" className="text-[var(--color-ink-charcoal)]" />
            <Zap size={18} fill="currentColor" className="text-[var(--color-ink-charcoal)]" />
            <Star size={18} fill="currentColor" className="text-[var(--color-ink-charcoal)]" />
          </div>
        </div>

        {/* Corner dot accent */}
        <div className="absolute -bottom-5 -right-5 w-14 h-14 border-4 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] rounded-full grid grid-cols-2 gap-1 p-2 z-20 shadow-hard">
          <div className="bg-[var(--color-ink-charcoal)] rounded-full" />
          <div className="bg-[var(--color-ink-charcoal)] rounded-full" />
          <div className="bg-[var(--color-ink-charcoal)] rounded-full" />
          <div className="bg-[var(--color-ink-charcoal)] rounded-full" />
        </div>

        {/* Small sparkle tag */}
        <div className="absolute -top-3 -right-8 bg-[var(--color-vivid-coral)] border-2 border-[var(--color-ink-charcoal)] px-2 py-0.5 rotate-12 shadow-hard-sm z-30">
          <Sparkles size={14} className="text-[var(--color-ink-charcoal)]" />
        </div>
      </div>

      {/* Subtitle strip */}
      <p className="text-headline-sm text-[var(--color-ink-charcoal)] max-w-xl bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 rotate-1 inline-block shadow-hard font-body font-semibold">
        🎉 &nbsp;Celebrating the loudest voices in the community.&nbsp; 🎉
      </p>
    </div>
  );
}
