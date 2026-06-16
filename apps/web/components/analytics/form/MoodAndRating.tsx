'use client';

import React from 'react';
import type { MoodFieldAnalytics, NumericFieldAnalytics } from './types';

export type { MoodFieldAnalytics as MoodFieldData, NumericFieldAnalytics as NumericFieldData };

// ── Mood display config ────────────────────────────────────────
const MOOD_DISPLAY: Record<string, { emoji: string; label: string }> = {
  happy:     { emoji: '😄', label: 'Super Hyped' },
  excited:   { emoji: '🤩', label: 'Hyped!' },
  neutral:   { emoji: '😐', label: 'Meh' },
  sad:       { emoji: '😔', label: 'Not a Vibe' },
  angry:     { emoji: '😡', label: 'Nope!' },
  love:      { emoji: '😍', label: 'Loving It' },
  surprised: { emoji: '😲', label: 'Whoa!' },
};

const getMoodDisplay = (key: string) =>
  MOOD_DISPLAY[key.toLowerCase()] ?? { emoji: key, label: key };

const PIE_COLORS = [
  '#8ED462',
  '#FF007F',
  '#F5E211',
  '#00E5FF',
  '#FF5733',
  '#C084FC',
];

function buildConicGradient(distribution: { pct: number }[]) {
  let acc = 0;
  return `conic-gradient(${distribution
    .map((d, i) => {
      const start = acc;
      acc += d.pct;
      return `${PIE_COLORS[i % PIE_COLORS.length]} ${start}% ${acc}%`;
    })
    .join(', ')})`;
}

// ── Props ─────────────────────────────────────────────────────
interface MoodAndRatingProps {
  moodField?: MoodFieldAnalytics | null;
}

// ── Component ─────────────────────────────────────────────────
export function MoodAndRating({ moodField }: MoodAndRatingProps) {
  const hasMood = moodField && moodField.distribution.length > 0;

  if (!hasMood) return null;

  const topMood = [...moodField.distribution].sort((a, b) => b.pct - a.pct)[0];
  const pieCss = buildConicGradient(moodField.distribution);

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-8 flex flex-col md:flex-row items-center gap-12 relative w-full">
      <div className="flex-1 w-full">
        <h2 className="font-headline-lg text-headline-lg uppercase mb-8 w-full border-b-4 border-ink-charcoal pb-4">
          General Mood
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12 w-full">
          <div
            className="relative w-64 h-64 border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: pieCss }}
          >
            <div className="w-28 h-28 bg-pure-white border-4 border-ink-charcoal rounded-full flex flex-col items-center justify-center shadow-[inset_4px_4px_0px_0px_rgba(44,46,42,1)]">
              <span className="text-3xl leading-none">
                {topMood ? getMoodDisplay(topMood.mood).emoji : '🤔'}
              </span>
              <span className="font-display-lg text-2xl font-black text-ink-charcoal mt-1">
                {topMood?.pct ?? 0}%
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 font-bold uppercase text-base flex-1">
            {moodField.distribution.map((entry, i) => {
              const display = getMoodDisplay(entry.mood);
              return (
                <div key={entry.mood} className="flex items-center gap-4 bg-canvas-cream p-4 border-2 border-ink-charcoal shadow-hard-sm">
                  <div
                    className="w-8 h-8 border-2 border-ink-charcoal flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-2xl">{display.emoji}</span>
                  <span className="text-lg">{display.label} ({entry.pct}%)</span>
                  <span className="ml-auto text-lg opacity-80">{entry.count.toLocaleString()} responses</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
