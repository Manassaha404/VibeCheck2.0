import React from "react";
import { Calendar, Hash } from "lucide-react";

export function SessionResultsHeader({
  title,
  date,
  id,
}: {
  title: string;
  date: string;
  id: string;
}) {
  return (
    <header className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-4">
      <div className="relative z-10 flex flex-col items-start gap-4">
        {/* Decorative Badge */}
        <span className="font-headline-sm text-sm font-black uppercase px-6 py-2 border-4 border-ink-charcoal shadow-hard-sm bg-[var(--color-pure-white)] text-ink-charcoal rotate-[-2deg] hover:rotate-0 transition-transform cursor-default mt-2">
          SESSION RESULTS
        </span>

        {/* Main Title */}
        <h1 className="font-display-lg text-[48px] md:text-[64px] leading-tight md:leading-[60px] font-black uppercase text-[var(--color-pure-white)] bg-[var(--color-primary)] inline-block p-4 border-4 border-ink-charcoal shadow-hard-xl rotate-1 relative z-20 max-w-[800px] break-words mb-2">
          {title}
        </h1>
      </div>

      {/* Info Blocks */}
      <div className="flex flex-col gap-4 font-body text-lg font-bold text-ink-charcoal z-30 mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex items-center justify-between md:justify-start gap-4 bg-[var(--color-leaf-green)] border-4 border-ink-charcoal px-6 py-3 shadow-hard hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex items-center gap-3">
            <Calendar size={24} strokeWidth={3} />
            <span className="uppercase">DATE</span>
          </div>
          <span className="font-black text-xl">{date}</span>
        </div>

        <div className="flex items-center justify-between md:justify-start gap-4 bg-[var(--color-canvas-cream)] border-4 border-ink-charcoal px-6 py-3 shadow-hard hover:-translate-y-1 transition-transform cursor-default">
          <div className="flex items-center gap-3">
            <Hash size={24} strokeWidth={3} />
            <span className="uppercase">SESSION ID</span>
          </div>
          <span className="font-black text-xl">{id}</span>
        </div>
      </div>
    </header>
  );
}
