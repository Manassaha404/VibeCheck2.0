'use client';

import React from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResponsesHeaderProps {
  formTitle: string;
  formSlug: string;
  totalResponses: number;
  lastResponseAt: string | null; // ISO string
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ResponsesHeader({
  formTitle,
  formSlug,
  totalResponses,
  lastResponseAt,
}: ResponsesHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
      {/* Left: title + subtitle */}
      <div className="flex flex-col gap-3">
        {/* Back button */}
        <button
          onClick={() => router.push(`/dashboard/analytics/form/${formSlug}`)}
          className="flex items-center gap-2 font-black uppercase text-sm border-2 border-ink-charcoal bg-pure-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-100 w-fit"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Back to Analytics
        </button>

        {/* Hero title */}
        <h1
          className="font-black uppercase text-ink-charcoal tracking-tighter leading-none"
          style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            lineHeight: '1',
            textShadow: '4px 4px 0px #F5E211',
          }}
        >
          RESPONSES:<br />THE RAW VIBE
        </h1>

        {/* Form subtitle */}
        <p className="font-bold text-lg text-ink-charcoal bg-pure-white inline-block px-4 py-2 border-4 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] rotate-1 w-fit max-w-xl truncate">
          All unfiltered feedback for &ldquo;{formTitle}&rdquo;
        </p>
      </div>

      {/* Right: stat cards */}
      <div className="flex gap-4 shrink-0">
        {/* Total responses */}
        <div className="bg-electric-sun border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-4 w-44 flex flex-col items-center justify-center -rotate-1">
          <span className="text-xs font-black uppercase tracking-widest text-ink-charcoal mb-1">
            Total Responses
          </span>
          <span className="font-black text-5xl text-ink-charcoal leading-none">
            {totalResponses.toLocaleString()}
          </span>
        </div>

        {/* Last response */}
        <div className="bg-[#c1c9b6] border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-4 w-44 flex flex-col items-center justify-center rotate-1">
          <span className="text-xs font-black uppercase tracking-widest text-ink-charcoal mb-1">
            Last Response
          </span>
          <span className="font-black text-2xl text-ink-charcoal text-center mt-1 leading-tight">
            {lastResponseAt ? timeAgo(lastResponseAt) : '—'}
          </span>
          <Zap size={18} className="mt-1 text-ink-charcoal" strokeWidth={3} />
        </div>
      </div>
    </header>
  );
}
