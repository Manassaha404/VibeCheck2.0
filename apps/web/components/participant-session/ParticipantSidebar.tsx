import React from "react";
import { Users, Trophy } from "lucide-react";

interface ParticipantSidebarProps {
  rank: number | null;
  score: number;
  participantCount: number;
}

export default function ParticipantSidebar({
  rank,
  score,
  participantCount,
}: ParticipantSidebarProps) {
  return (
    <>
      {/* ── Mobile / Tablet: compact horizontal stats strip ─────────────── */}
      <div className="lg:hidden w-full flex gap-2 sm:gap-3">
        {/* Rank pill */}
        <div className="flex-1 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex flex-col items-center justify-center py-3 px-2 gap-0.5 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-ink-charcoal) 2px, transparent 2px)",
              backgroundSize: "12px 12px",
            }}
          />
          <span className="font-body text-label-sm uppercase tracking-widest text-[var(--color-ink-charcoal)] opacity-70 relative z-10">
            Rank
          </span>
          <span className="font-display font-black text-headline-sm text-[var(--color-ink-charcoal)] leading-none relative z-10">
            {rank !== null ? `#${rank}` : "—"}
          </span>
        </div>

        {/* Score pill */}
        <div className="flex-1 bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex flex-col items-center justify-center py-3 px-2 gap-0.5">
          <span className="font-body text-label-sm uppercase tracking-widest text-[var(--color-on-surface-variant)]">
            Score
          </span>
          <span className="font-display font-black text-headline-sm text-[var(--color-primary)]">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Players pill */}
        <div className="flex-1 bg-[var(--color-sky-blue)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex flex-col items-center justify-center py-3 px-2 gap-0.5">
          <span className="font-body text-label-sm uppercase tracking-widest text-[var(--color-ink-charcoal)] opacity-70">
            Players
          </span>
          <span className="font-display font-black text-headline-sm text-[var(--color-ink-charcoal)]">
            {participantCount}
          </span>
        </div>
      </div>

      {/* ── Desktop: full vertical sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col gap-5">
        <div className="bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-6 flex flex-col items-center gap-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-ink-charcoal) 2px, transparent 2px)",
              backgroundSize: "12px 12px",
            }}
          />
          <h3 className="font-display font-black text-headline-sm uppercase text-[var(--color-ink-charcoal)] relative z-10">
            Your Rank
          </h3>
          <div className="w-28 h-28 rounded-full bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard flex items-center justify-center relative z-10">
            <span className="font-display font-black text-display-lg text-[var(--color-ink-charcoal)] leading-none">
              {rank !== null ? `#${rank}` : "—"}
            </span>
          </div>
          <div className="w-full bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-4 py-3 flex justify-between items-center relative z-10">
            <span className="font-body text-label-md font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              Score
            </span>
            <span className="font-display font-black text-headline-sm text-[var(--color-primary)]">
              {score.toLocaleString()} pts
            </span>
          </div>
        </div>

        <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-sky-blue)] border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center flex-shrink-0">
            <Users
              size={22}
              strokeWidth={2.5}
              className="text-[var(--color-ink-charcoal)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-headline-sm text-[var(--color-ink-charcoal)]">
              {participantCount}
            </span>
            <span className="font-body text-label-sm uppercase tracking-widest text-[var(--color-on-surface-variant)]">
              Players in room
            </span>
          </div>
        </div>

        <div className="bg-[var(--color-ink-charcoal)] border-4 border-[var(--color-ink-charcoal)] shadow-hard p-5 flex flex-col gap-2 relative overflow-hidden">
          <Trophy
            size={32}
            strokeWidth={2}
            className="text-[var(--color-electric-sun)]"
          />
          <p className="font-display font-black text-headline-sm uppercase text-[var(--color-pure-white)] leading-tight">
            Stay sharp,
            <br />
            crush it!
          </p>
          <p className="font-body text-label-sm text-[var(--color-pure-white)] opacity-80 uppercase tracking-wide">
            Rank updates after each answer
          </p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[var(--color-vivid-coral)] opacity-30" />
        </div>
      </aside>
    </>
  );
}
