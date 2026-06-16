'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface WeeklyDataPoint {
  week: string;
  count: number;
}

interface VibesOverTimeProps {
  weeklyData: WeeklyDataPoint[];
}

const BAR_COLORS = [
  'bg-[var(--color-electric-sun)]',
  'bg-[var(--color-leaf-green)]',
  'bg-[var(--color-sky-blue)]',
  'bg-[var(--color-tangerine)]',
  'bg-[var(--color-vivid-coral)]',
  'bg-[var(--color-lavender)]',
];

export function VibesOverTime({ weeklyData }: VibesOverTimeProps) {
  const maxCount = Math.max(...weeklyData.map((d) => d.count), 1);
  const totalThisWeek = weeklyData[weeklyData.length - 1]?.count ?? 0;
  const totalPrevWeek = weeklyData[weeklyData.length - 2]?.count ?? 0;
  const isRising = totalThisWeek >= totalPrevWeek;

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal shadow-[16px_16px_0px_0px_rgba(44,46,42,1)] p-8 relative">
      {/* Rising / Falling badge */}
      <div
        className={`absolute -top-6 -right-6 text-pure-white font-black text-xl p-3 border-4 border-ink-charcoal rotate-[15deg] shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] z-10 flex items-center gap-1 ${
          isRising ? 'bg-[#FF5733]' : 'bg-ink-charcoal'
        }`}
      >
        <TrendingUp size={18} strokeWidth={3} />
        {isRising ? 'RISING!' : 'STEADY'}
      </div>

      <h2 className="font-headline-lg text-headline-lg border-b-4 border-ink-charcoal pb-4 mb-8 uppercase">
        Vibes Over Time
      </h2>

      {weeklyData.every((d) => d.count === 0) ? (
        <div className="h-64 flex items-center justify-center text-ink-charcoal/40 font-bold uppercase text-xl border-b-4 border-l-4 border-ink-charcoal">
          No responses yet
        </div>
      ) : (
        <div className="h-64 md:h-96 w-full flex items-end justify-between gap-2 md:gap-6 border-b-4 border-l-4 border-ink-charcoal pb-2 pl-4">
          {weeklyData.map((point, i) => {
            const heightPct = Math.max((point.count / maxCount) * 100, point.count > 0 ? 4 : 0);
            return (
              <div
                key={point.week}
                className={`w-full border-4 border-ink-charcoal relative group hover:-translate-y-2 transition-transform ${BAR_COLORS[i % BAR_COLORS.length]}`}
                style={{ height: `${heightPct}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-ink-charcoal text-pure-white px-3 py-1.5 font-bold text-sm pointer-events-none transition-opacity whitespace-nowrap border-2 border-electric-sun z-20">
                  {point.count.toLocaleString()} response{point.count !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between font-bold text-lg mt-4 pl-4 uppercase">
        {weeklyData.map((point) => (
          <span key={point.week}>{point.week}</span>
        ))}
      </div>
    </section>
  );
}
