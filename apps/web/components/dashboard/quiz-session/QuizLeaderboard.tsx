import React from "react";
import { Trophy } from "lucide-react";

export function QuizLeaderboard() {
  return (
    <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-hard p-6">
      <h3 className="text-headline-sm font-display text-[var(--color-ink-charcoal)] border-b-2 border-[var(--color-ink-charcoal)] pb-4 mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-[var(--color-electric-sun)] fill-current" /> Top 10 Leaderboard
      </h3>
      <ul className="flex flex-col gap-3 text-body-md font-body">
        {/* Top 3 highlighted */}
        <li className="flex items-center justify-between p-3 bg-[var(--color-electric-sun)] bg-opacity-20 border-2 border-[var(--color-ink-charcoal)] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-headline-sm font-display font-bold w-8 text-center text-[var(--color-ink-charcoal)]">1</span>
            <span className="font-bold">Alex Johnson</span>
          </div>
          <span className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-2 py-1 text-label-sm font-body font-bold">980 pts</span>
        </li>
        <li className="flex items-center justify-between p-3 bg-[var(--color-leaf-green)] bg-opacity-20 border-2 border-[var(--color-ink-charcoal)] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-headline-sm font-display font-bold w-8 text-center text-[var(--color-ink-charcoal)] opacity-80">2</span>
            <span className="font-bold">Sam Smith</span>
          </div>
          <span className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-2 py-1 text-label-sm font-body font-bold">945 pts</span>
        </li>
        <li className="flex items-center justify-between p-3 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-headline-sm font-display font-bold w-8 text-center text-[var(--color-ink-charcoal)] opacity-60">3</span>
            <span className="font-bold">Jamie Doe</span>
          </div>
          <span className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-2 py-1 text-label-sm font-body font-bold">910 pts</span>
        </li>
        {/* Rest of list */}
        <li className="flex items-center justify-between p-2 border-b-2 border-[var(--color-ink-charcoal)] border-dashed border-opacity-20">
          <div className="flex items-center gap-3">
            <span className="text-label-md font-body font-bold w-8 text-center opacity-50">4</span>
            <span>Taylor Swift</span>
          </div>
          <span className="text-label-sm font-body font-bold opacity-70">890 pts</span>
        </li>
        <li className="flex items-center justify-between p-2 border-b-2 border-[var(--color-ink-charcoal)] border-dashed border-opacity-20">
          <div className="flex items-center gap-3">
            <span className="text-label-md font-body font-bold w-8 text-center opacity-50">5</span>
            <span>Jordan Lee</span>
          </div>
          <span className="text-label-sm font-body font-bold opacity-70">850 pts</span>
        </li>
        <li className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <span className="text-label-md font-body font-bold w-8 text-center opacity-50">6</span>
            <span>Casey Jones</span>
          </div>
          <span className="text-label-sm font-body font-bold opacity-70">820 pts</span>
        </li>
      </ul>
    </div>
  );
}
