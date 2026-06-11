"use client";

import React from "react";
import Link from "next/link";

export type PollCardAccent = "leaf-green" | "electric-sun" | "canvas-cream" | "tertiary-fixed";

export interface PollCardProps {
  /** Category badge label */
  category: string;
  /** Poll question text */
  question: string;
  /** Number of votes formatted string, e.g. "3,402" */
  voteCount: string;
  /** Optional time left label, e.g. "Ends in 2h" */
  timeLeft?: string;
  /** Bottom bar accent color */
  accent?: PollCardAccent;
  /** href for the vote action */
  href?: string;
  id?: string;
  /** Optional progress bar (0-100) for a two-option poll */
  progressPercent?: number;
  progressLabels?: [string, string]; // [Yes label, No label]
  /** For multi-option polls */
  options?: string[];
}

const accentBg: Record<PollCardAccent, string> = {
  "leaf-green":    "var(--color-leaf-green)",
  "electric-sun":  "var(--color-electric-sun)",
  "canvas-cream":  "var(--color-canvas-cream)",
  "tertiary-fixed":"var(--color-tertiary-fixed)",
};

/**
 * PollCard — Versatile card for polls. Supports progress bar, option list,
 * or grid-of-options preview. Used in Trending and Public Polls sections.
 */
export default function PollCard({
  category,
  question,
  voteCount,
  timeLeft,
  accent = "canvas-cream",
  href = "#",
  id,
  progressPercent,
  progressLabels,
  options,
}: PollCardProps) {
  const accentColor = accentBg[accent];

  return (
    <article
      id={id}
      className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard card-lift flex flex-col overflow-hidden"
    >
      {/* Card body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Category badge */}
        <span className="inline-block bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-2 py-1 rounded-md font-bold w-fit">
          {category}
        </span>

        {/* Question */}
        <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] leading-tight flex-1">
          {question}
        </h3>

        {/* Optional time left */}
        {timeLeft && (
          <div className="flex items-center gap-1 text-[var(--color-on-surface-variant)] text-label-md">
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>schedule</span>
            {timeLeft}
          </div>
        )}

        {/* Progress bar variant */}
        {progressPercent !== undefined && progressLabels && (
          <div className="mt-auto">
            <div className="flex justify-between text-label-md font-bold mb-1">
              <span>{progressLabels[0]} ({progressPercent}%)</span>
              <span>{progressLabels[1]} ({100 - progressPercent}%)</span>
            </div>
            <div className="w-full h-4 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[var(--color-electric-sun)] border-r-2 border-[var(--color-ink-charcoal)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Option list variant */}
        {options && options.length > 0 && !progressPercent && (
          <div className="mt-auto flex flex-col gap-2">
            {options.slice(0, 3).map((opt, i) => (
              <div key={opt} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-[var(--color-ink-charcoal)] flex-shrink-0"
                  style={{ backgroundColor: i === 0 ? "var(--color-leaf-green)" : "var(--color-canvas-cream)" }}
                />
                <span className="text-label-md font-bold">{opt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div
        className="border-t-4 border-[var(--color-ink-charcoal)] p-4 flex justify-between items-center rounded-b-lg"
        style={{ backgroundColor: accentColor }}
      >
        <span className="text-label-md font-bold flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>groups</span>
          {voteCount}
        </span>
        <Link
          href={href}
          className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full text-label-md font-bold shadow-hard-sm btn-press"
        >
          Vote
        </Link>
      </div>
    </article>
  );
}
