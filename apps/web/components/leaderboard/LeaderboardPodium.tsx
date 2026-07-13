"use client";

import React from "react";
import { Crown, Medal } from "lucide-react";

interface PodiumData {
  rank: number;
  name: string;
  username: string;
  score: number;
  avatar: string;
}

const PODIUM_STYLES = [
  {
    rankIdx: 0,
    bg: "bg-[var(--color-electric-sun)]",
    accentColor: "text-[var(--color-ink-charcoal)]",
    badgeBg: "bg-[var(--color-electric-sun)]",
    icon: (
      <Crown
        size={22}
        strokeWidth={2.5}
        className="text-[var(--color-ink-charcoal)]"
      />
    ),
    rotation: "rotate-0",
    height: "h-[320px] md:h-[340px]",
    avatarSize: "w-28 h-28",
    order: "order-1 md:order-2",
    yOffset: "md:-translate-y-10",
  },
  {
    rankIdx: 1,
    bg: "bg-[var(--color-sky-blue)]",
    accentColor: "text-[var(--color-ink-charcoal)]",
    badgeBg: "bg-[var(--color-sky-blue)]",
    icon: (
      <Medal
        size={18}
        strokeWidth={2.5}
        className="text-[var(--color-ink-charcoal)]"
      />
    ),
    rotation: "-rotate-2",
    height: "h-[260px] md:h-[270px]",
    avatarSize: "w-20 h-20",
    order: "order-2 md:order-1",
    yOffset: "",
  },
  {
    rankIdx: 2,
    bg: "bg-[var(--color-vivid-coral)]",
    accentColor: "text-[var(--color-pure-white)]",
    badgeBg: "bg-[var(--color-vivid-coral)]",
    icon: (
      <Medal
        size={16}
        strokeWidth={2.5}
        className="text-[var(--color-pure-white)]"
      />
    ),
    rotation: "rotate-2",
    height: "h-[240px] md:h-[250px]",
    avatarSize: "w-16 h-16",
    order: "order-3",
    yOffset: "",
  },
];

const SCORE_COLORS = [
  "text-[var(--color-ink-charcoal)]",
  "text-[var(--color-ink-charcoal)]",
  "text-[var(--color-pure-white)]",
];

export function LeaderboardPodium({ data = [] }: { data?: PodiumData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-display font-bold text-headline-sm text-[var(--color-ink-charcoal)] opacity-50">
          No participants yet.
        </p>
      </div>
    );
  }

  // Create an array up to 3 elements long with their respective styles
  const podiumEntries = data.slice(0, 3).map((entry, idx) => ({
    ...entry,
    ...PODIUM_STYLES[idx],
    scoreColor: SCORE_COLORS[idx],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-24 items-end max-w-5xl mx-auto relative z-10">
      {podiumEntries.map((entry, idx) => (
        <div
          key={entry.rank}
          className={[
            entry.bg,
            entry.rotation,
            entry.order,
            entry.yOffset,
            entry.height,
            "border-4 border-[var(--color-ink-charcoal)]",
            "shadow-[8px_8px_0px_0px_var(--color-ink-charcoal)]",
            "p-6 flex flex-col items-center justify-center relative",
            "transition-all duration-200",
            "hover:-translate-y-2 hover:rotate-0 hover:shadow-[14px_14px_0px_0px_var(--color-ink-charcoal)]",
            "cursor-default",
          ].join(" ")}
        >
          {/* Rank badge */}
          <div
            className={[
              entry.badgeBg,
              "absolute -top-6 -left-5 border-4 border-[var(--color-ink-charcoal)]",
              "shadow-hard rounded-full flex items-center justify-center flex-col gap-0.5 z-20",
              entry.rankIdx === 0 ? "w-16 h-16" : "w-12 h-12",
            ].join(" ")}
          >
            {entry.icon}
            <span
              className={[
                "font-black font-display leading-none text-sm",
                entry.accentColor,
              ].join(" ")}
            >
              #{entry.rank}
            </span>
          </div>

          {/* Stripe accent bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--color-ink-charcoal)] opacity-20" />

          {/* Avatar */}
          <img
            src={entry.avatar}
            alt={entry.name}
            className={[
              entry.avatarSize,
              "rounded-full border-4 border-[var(--color-ink-charcoal)]",
              "bg-[var(--color-pure-white)] shadow-hard mb-4 object-cover",
              entry.rankIdx === 0
                ? "ring-4 ring-[var(--color-pure-white)] ring-offset-2 ring-offset-[var(--color-electric-sun)]"
                : "",
            ].join(" ")}
          />

          <h3
            className={[
              "font-display font-black uppercase text-center leading-tight mb-1",
              entry.rankIdx === 0 ? "text-headline-md" : "text-headline-sm",
              entry.accentColor,
            ].join(" ")}
          >
            {entry.username}
          </h3>

          <p
            className={[
              "font-body font-bold",
              entry.rankIdx === 0 ? "text-headline-sm" : "text-body-lg",
              entry.scoreColor,
            ].join(" ")}
          >
            {entry.score.toLocaleString()} pts
          </p>
        </div>
      ))}
    </div>
  );
}
