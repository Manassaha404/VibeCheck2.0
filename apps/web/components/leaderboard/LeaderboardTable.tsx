"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface TableData {
  rank: number;
  name: string;
  username: string;
  score: number;
  avatar: string;
}

const ACCENT_COLORS = [
  "bg-[var(--color-tangerine)]",
  "bg-[var(--color-mint)]",
  "bg-[var(--color-lavender)]",
  "bg-[var(--color-vivid-coral)]",
  "bg-[var(--color-sky-blue)]",
];

export function LeaderboardTable({ data = [] }: { data?: TableData[] }) {
  if (data.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 max-w-4xl mx-auto w-full mb-16">
      <div className="flex items-center gap-4 border-b-4 border-[var(--color-ink-charcoal)] pb-3">
        <div className="w-3 h-8 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)]" />
        <h2 className="text-headline-md uppercase font-display font-black leading-none">
          TOP VIBE-CASTERS
        </h2>
        <div className="ml-auto flex items-center gap-2 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] px-3 py-1 text-label-sm shadow-hard-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--color-vivid-coral)] inline-block animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-[8px_8px_0px_0px_var(--color-ink-charcoal)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-[var(--color-ink-charcoal)] text-[var(--color-canvas-cream)]">
              <th className="p-4 border-r-4 border-[var(--color-canvas-cream)] w-24 text-center font-display text-label-md uppercase tracking-widest">
                Rank
              </th>
              <th className="p-4 border-r-4 border-[var(--color-canvas-cream)] font-display text-label-md uppercase tracking-widest">
                Username
              </th>
              <th className="p-4 text-right font-display text-label-md uppercase tracking-widest">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <tr
                  key={row.rank}
                  className={[
                    "group transition-colors duration-150",
                    "hover:bg-[var(--color-electric-sun)]",
                    i < data.length - 1
                      ? "border-b-4 border-[var(--color-ink-charcoal)]"
                      : "",
                  ].join(" ")}
                >
                  <td className="p-0 border-r-4 border-[var(--color-ink-charcoal)] text-center relative w-24">
                    <div className="flex items-stretch h-full">
                      <div
                        className={[
                          "w-2 flex-shrink-0 self-stretch",
                          accentColor,
                        ].join(" ")}
                      />
                      <span className="flex-1 flex items-center justify-center py-5 font-display font-black text-headline-sm">
                        #{row.rank}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 border-r-4 border-[var(--color-ink-charcoal)]">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.username}
                        className={[
                          "w-9 h-9 rounded-full border-2 border-[var(--color-ink-charcoal)] flex-shrink-0 shadow-hard-sm object-cover bg-white",
                          accentColor,
                        ].join(" ")}
                      />
                      <span className="font-body font-bold text-body-lg">
                        {row.username}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right font-display font-black text-headline-sm">
                    {row.score.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
