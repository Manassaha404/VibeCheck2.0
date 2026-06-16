'use client';

import React from 'react';
import { ArrowRight, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnalyticsHeaderProps {
  formTitle: string;
  totalResponses: number;
  status: string;
  formSlug: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-leaf-green text-ink-charcoal',
  draft: 'bg-electric-sun text-ink-charcoal',
  closed: 'bg-[#FF007F] text-pure-white',
  archived: 'bg-ink-charcoal text-pure-white',
};

export function AnalyticsHeader({
  formTitle,
  totalResponses,
  status,
  formSlug,
}: AnalyticsHeaderProps) {
  const router = useRouter();
  const statusClass = STATUS_COLORS[status] ?? 'bg-canvas-cream text-ink-charcoal';

  return (
    <>
      <header className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="relative z-10">
          {/* Decorative boom badge */}
          <div className="absolute -top-12 -left-12 rotate-[-15deg] hidden md:block">
            <div className="bg-electric-sun text-ink-charcoal font-black text-2xl p-4 border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transform hover:scale-110 transition-transform cursor-crosshair">
              BOOM!
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display-lg text-display-lg md:text-[96px] md:leading-[90px] font-black uppercase text-ink-charcoal bg-pure-white inline-block p-4 border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] mb-4 -rotate-1 relative z-10">
            ANALYTICS:
          </h1>
          <br />
          <h2 className="font-display-lg text-display-lg md:text-[64px] md:leading-[70px] font-black uppercase text-pure-white bg-[var(--color-primary)] inline-block p-4 border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] rotate-1 relative z-20 max-w-[720px] break-words">
            {formTitle || 'YOUR FORM'}
          </h2>

          {/* Status chip */}
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`font-headline-sm text-sm font-black uppercase px-4 py-1 border-2 border-ink-charcoal inline-flex items-center gap-2 ${statusClass}`}
            >
              <Wifi size={14} strokeWidth={3} />
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Total Responses stat */}
        <div className="flex gap-4 md:gap-8 flex-col sm:flex-row w-full md:w-auto relative z-30">
          <div className="bg-electric-sun border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform w-full sm:w-48">
            <span className="font-headline-sm text-headline-sm uppercase font-bold text-center">
              Total Responses
            </span>
            <span className="font-display-lg text-display-lg mt-2">
              {totalResponses.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* CTA button */}
      <div className="flex justify-start w-full mt-8">
        <button
          onClick={() => router.push(`/dashboard/analytics/form/${formSlug}/responses`)}
          className="relative group bg-leaf-green text-pure-white font-display-lg text-[32px] md:text-[48px] uppercase font-black px-8 md:px-16 py-6 border-8 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(44,46,42,1)] hover:bg-[#FF007F] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-6 transition-all duration-200"
        >
          SEE ALL RESPONSES
          <ArrowRight className="transform group-hover:translate-x-2 transition-transform duration-200" size={40} strokeWidth={3} />
        </button>
      </div>
    </>
  );
}
