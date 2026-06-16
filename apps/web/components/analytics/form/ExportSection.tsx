'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { FieldType, FieldAnalyticsData } from './types';

export type { FieldAnalyticsData };

interface ExportField {
  fieldId: string;
  label: string;
  type: FieldType;
  analytics: FieldAnalyticsData;
}

interface ExportSectionProps {
  formSlug: string;
  fields: ExportField[];
}

type TimePeriod = '7d' | '14d' | '30d' | 'all';

function buildCsv(
  fields: ExportField[],
  selectedIds: Set<string>,
): string {
  const selected = fields.filter((f) => selectedIds.has(f.fieldId));
  if (selected.length === 0) return '';

  const headers = ['Field Label', 'Field Type', 'Total Answers', 'Analytics Summary'];
  const rows: string[][] = selected.map((f) => {
    const { analytics } = f;
    let summary = '';
    if (analytics.kind === 'text') {
      const samples = (analytics.samples as string[]) ?? [];
      summary = samples.slice(0, 5).join(' | ');
    } else if (analytics.kind === 'choice') {
      const options = (analytics.options as { label: string; pct: number }[]) ?? [];
      summary = options.map((o) => `${o.label}: ${o.pct}%`).join(' | ');
    } else if (analytics.kind === 'numeric') {
      summary = `Avg: ${analytics.average} | Min: ${analytics.min} | Max: ${analytics.max}`;
    } else if (analytics.kind === 'mood') {
      const dist = (analytics.distribution as { mood: string; pct: number }[]) ?? [];
      summary = dist.map((d) => `${d.mood}: ${d.pct}%`).join(' | ');
    } else if (analytics.kind === 'file') {
      summary = `${(analytics as { totalUploads: number }).totalUploads} uploads`;
    } else if (analytics.kind === 'date') {
      const dist = (analytics as { distribution: { label: string; count: number }[] }).distribution ?? [];
      summary = dist.map((d) => `${d.label}: ${d.count}`).join(' | ');
    }

    const totalAnswered = (() => {
      if ('totalAnswered' in analytics) return (analytics as { totalAnswered: number }).totalAnswered;
      if ('totalUploads' in analytics) return (analytics as { totalUploads: number }).totalUploads;
      return 0;
    })();


    return [
      `"${f.label.replace(/"/g, '""')}"`,
      f.type,
      String(totalAnswered),
      `"${summary.replace(/"/g, '""')}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function ExportSection({ formSlug, fields }: ExportSectionProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(fields.map((f) => f.fieldId)),
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleField = (id: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedFields.size === 0) return;
    setIsExporting(true);

    try {
      const csv = buildCsv(fields, selectedFields);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vibecheck-analytics-${formSlug}-${timePeriod}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal shadow-[16px_16px_0px_0px_rgba(44,46,42,1)] p-8 md:p-12 relative flex flex-col items-center mt-8">
      {/* Corner badge */}
      <div className="absolute -top-6 -left-6 bg-[#00E5FF] text-ink-charcoal font-black text-xl p-3 border-4 border-ink-charcoal -rotate-[10deg] shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] z-10 whitespace-nowrap">
        DATA DROP!
      </div>

      <h2 className="font-display-lg text-[48px] md:text-[64px] uppercase font-black text-ink-charcoal mb-8 text-center mt-4">
        Export Dem Vibes
      </h2>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Field Selection */}
        <div className="bg-canvas-cream border-4 border-ink-charcoal p-6 shadow-[8px_8px_0px_0px_rgba(44,46,42,1)]">
          <div className="flex items-center justify-between border-b-4 border-ink-charcoal pb-2 mb-4">
            <h3 className="font-headline-md text-headline-md font-bold uppercase">
              Select Fields
            </h3>
            <button
              onClick={() =>
                setSelectedFields(
                  selectedFields.size === fields.length
                    ? new Set()
                    : new Set(fields.map((f) => f.fieldId)),
                )
              }
              className="text-xs font-black uppercase border-2 border-ink-charcoal px-3 py-1 bg-pure-white hover:bg-electric-sun transition-colors"
            >
              {selectedFields.size === fields.length ? 'None' : 'All'}
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-center font-bold opacity-40 uppercase py-4">No fields</p>
          ) : (
            <div className="space-y-3 font-bold text-base uppercase flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
              {fields.map((field) => (
                <label
                  key={field.fieldId}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    checked={selectedFields.has(field.fieldId)}
                    onChange={() => toggleField(field.fieldId)}
                    className="w-5 h-5 border-4 border-ink-charcoal focus:ring-0 rounded-none bg-pure-white checked:bg-electric-sun accent-electric-sun"
                    type="checkbox"
                  />
                  <span className="group-hover:text-primary transition-colors truncate">
                    {field.label}
                  </span>
                  <span className="ml-auto text-xs font-normal opacity-50 shrink-0">
                    {field.type.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Time Period */}
        <div className="bg-canvas-cream border-4 border-ink-charcoal p-6 shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] flex flex-col">
          <h3 className="font-headline-md text-headline-md font-bold uppercase mb-4 border-b-4 border-ink-charcoal pb-2">
            Select Time Period
          </h3>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            className="w-full bg-pure-white border-4 border-ink-charcoal p-4 font-bold text-xl uppercase focus:ring-0 focus:outline-none mb-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] appearance-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="14d">Last 2 Weeks</option>
            <option value="30d">Last 1 Month</option>
            <option value="all">All Time</option>
          </select>

          {timePeriod === 'all' ? (
            <p className="font-bold text-sm uppercase opacity-60 mt-auto">Exporting all responses</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-black uppercase text-sm mb-1">Start Date</label>
                <input
                  className="w-full bg-pure-white border-4 border-ink-charcoal p-3 font-bold uppercase focus:ring-0 focus:outline-none shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-black uppercase text-sm mb-1">End Date</label>
                <input
                  className="w-full bg-pure-white border-4 border-ink-charcoal p-3 font-bold uppercase focus:ring-0 focus:outline-none shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export button */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <button
          onClick={handleExport}
          disabled={isExporting || selectedFields.size === 0}
          className="relative group bg-[#FF007F] text-pure-white font-display-lg text-[32px] md:text-[48px] uppercase font-black px-8 md:px-16 py-6 border-8 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] flex items-center gap-6 hover:bg-[#D9006C] transition-colors active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 size={48} strokeWidth={3} className="animate-spin" />
              EXPORTING...
            </>
          ) : (
            <>
              CSV EXPORT
              <Download size={48} strokeWidth={3} />
            </>
          )}

          {/* Hover star badge */}
          {!isExporting && (
            <div
              className="absolute -top-16 -right-16 bg-electric-sun text-ink-charcoal text-2xl p-6 border-4 border-ink-charcoal opacity-0 group-hover:opacity-100 transition-opacity rotate-12 pointer-events-none"
              style={{
                clipPath:
                  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            >
              KAPOW!
            </div>
          )}
        </button>

        {selectedFields.size === 0 && (
          <p className="font-bold uppercase text-sm opacity-60">
            Select at least one field to export
          </p>
        )}
      </div>
    </section>
  );
}
