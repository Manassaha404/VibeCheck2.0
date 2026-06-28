'use client';

import React from 'react';
import { ArrowRight, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderSection({ title, status, totalSignatures }: { title: string, status: string, totalSignatures: number }) {
  const router = useRouter();
  const statusClass = status === 'active' ? 'bg-[var(--color-leaf-green)] text-[var(--color-ink-charcoal)]' : 'bg-gray-300 text-gray-700';

  return (
    <div className="mb-16">
      <header className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="relative z-10">
          {/* Decorative boom badge */}
          <div className="absolute -top-12 -left-12 rotate-[-15deg] hidden md:block">
            <div className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-black text-2xl p-4 border-4 border-[var(--color-ink-charcoal)] shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transform hover:scale-110 transition-transform cursor-crosshair">
              BOOM!
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display-lg text-display-lg md:text-[96px] md:leading-[90px] font-black uppercase text-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)] inline-block p-4 border-4 border-[var(--color-ink-charcoal)] shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] mb-4 -rotate-1 relative z-10">
            ANALYTICS:
          </h1>
          <br />
          <h2 className="font-display-lg text-display-lg md:text-[64px] md:leading-[70px] font-black uppercase text-[var(--color-pure-white)] bg-[#FF007F] inline-block p-4 border-4 border-[var(--color-ink-charcoal)] shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] rotate-1 relative z-20 max-w-[720px] break-words">
            {title}
          </h2>

          {/* Status chip */}
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`font-headline-sm text-sm font-black uppercase px-4 py-1 border-2 border-[var(--color-ink-charcoal)] inline-flex items-center gap-2 ${statusClass}`}
            >
              <Wifi size={14} strokeWidth={3} />
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Total Responses stat */}
        <div className="flex gap-4 md:gap-8 flex-col sm:flex-row w-full md:w-auto relative z-30">
          <div className="bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform w-full sm:w-48">
            <span className="font-headline-sm text-headline-sm uppercase font-bold text-center text-[var(--color-ink-charcoal)]">
              Total Signatures
            </span>
            <span className="font-display-lg text-display-lg mt-2 text-[var(--color-ink-charcoal)]">
              {totalSignatures.toLocaleString()}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
