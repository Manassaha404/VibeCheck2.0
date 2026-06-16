'use client';

import React from 'react';
import {
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  List,
  CheckSquare,
  Star,
  Sliders,
  Smile,
  FileText,
  AlignLeft,
  UploadCloud,
} from 'lucide-react';
import type {
  FieldType,
  FieldAnalyticsData,
  TextFieldAnalytics,
  ChoiceFieldAnalytics,
  NumericFieldAnalytics,
  MoodFieldAnalytics,
  FileFieldAnalytics,
  DateFieldAnalytics,
  AnalyticsFieldItem,
} from './types';

export type { AnalyticsFieldItem };

// ── Icon map ─────────────────────────────────────────────────────
const FIELD_ICONS: Record<FieldType, React.ElementType> = {
  short_text:   Type,
  long_text:    AlignLeft,
  number:       Hash,
  email:        Mail,
  phone:        Phone,
  date:         Calendar,
  select:       List,
  multi_select: List,
  radio:        CheckSquare,
  checkbox:     CheckSquare,
  file:         UploadCloud,
  rating:       Star,
  scale:        Sliders,
  mood:         Smile,
};

// ── Card accent colors (cycling) ─────────────────────────────────
const CARD_COLORS = [
  '#00E5FF',
  '#ffffff',
  '#8ED462',
  '#F5E211',
  '#C084FC',
  '#FF9548',
];

// ── Bubble styles for text feed ───────────────────────────────────
const BUBBLE_STYLES = [
  'bg-pure-white border-4 border-ink-charcoal rounded-3xl rounded-tl-none font-bold text-lg shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]',
  'bg-electric-sun border-4 border-ink-charcoal rounded-3xl rounded-tr-none font-bold text-lg shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] self-end text-right ml-8',
  'bg-leaf-green border-4 border-ink-charcoal rounded-3xl rounded-tl-none font-bold text-lg shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] text-pure-white',
  'bg-[#00E5FF] border-4 border-ink-charcoal rounded-3xl rounded-tr-none font-bold text-lg shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] self-end text-right ml-8',
];

const BAR_ACCENT_COLORS = [
  'bg-[#FF007F]',
  'bg-leaf-green',
  'bg-electric-sun',
  'bg-ink-charcoal',
  'bg-[#00E5FF]',
  'bg-[#C084FC]',
  'bg-[#FF9548]',
];

// ── Sub-renderers ─────────────────────────────────────────────────

function TextCard({ data }: { data: TextFieldAnalytics }) {
  if (data.samples.length === 0) {
    return (
      <p className="text-ink-charcoal/40 font-bold uppercase text-center py-8">
        No responses yet
      </p>
    );
  }
  return (
    <div className="flex-grow space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
      {data.samples.map((sample, i) => (
        <div key={i} className={`p-4 ${BUBBLE_STYLES[i % BUBBLE_STYLES.length]}`}>
          {sample}
        </div>
      ))}
    </div>
  );
}

function ChoiceCard({ data }: { data: ChoiceFieldAnalytics }) {
  if (data.options.length === 0) {
    return (
      <p className="text-ink-charcoal/40 font-bold uppercase text-center py-8">
        No responses yet
      </p>
    );
  }
  return (
    <div className="space-y-5 flex-grow">
      {data.options.map((opt, i) => (
        <div key={opt.label} className="w-full">
          <div className="flex justify-between font-bold mb-1 uppercase text-base">
            <span className="truncate max-w-[70%]">{opt.label}</span>
            <span className="ml-2 flex-shrink-0">
              {opt.pct}%{' '}
              <span className="font-normal opacity-60">({opt.count})</span>
            </span>
          </div>
          <div className="w-full h-7 bg-canvas-cream border-4 border-ink-charcoal">
            <div
              className={`h-full border-r-4 border-ink-charcoal transition-all duration-700 ${BAR_ACCENT_COLORS[i % BAR_ACCENT_COLORS.length]}`}
              style={{ width: `${Math.max(opt.pct, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function NumericCard({ data }: { data: NumericFieldAnalytics }) {
  const maxDistCount = Math.max(...data.distribution.map((d) => d.count), 1);
  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div className="flex gap-4 flex-wrap">
        {[
          { label: 'Avg', value: data.average.toFixed(1) },
          { label: 'Min', value: data.min },
          { label: 'Max', value: data.max },
          { label: 'Answers', value: data.totalAnswered.toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 min-w-[80px] bg-electric-sun border-4 border-ink-charcoal p-3 flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]"
          >
            <span className="text-xs font-black uppercase">{s.label}</span>
            <span className="text-2xl font-black">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 mt-2">
        {data.distribution.map((entry, i) => {
          const widthPct = Math.round((entry.count / maxDistCount) * 100);
          return (
            <div key={entry.label} className="flex items-center gap-2">
              <span className="w-14 text-xs font-black text-right shrink-0">{entry.label}</span>
              <div className="flex-grow h-6 bg-canvas-cream border-2 border-ink-charcoal">
                <div
                  className={`h-full border-r-2 border-ink-charcoal ${BAR_ACCENT_COLORS[i % BAR_ACCENT_COLORS.length]}`}
                  style={{ width: `${Math.max(widthPct, 1)}%` }}
                />
              </div>
              <span className="w-8 text-xs font-bold">{entry.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoodCard({ data }: { data: MoodFieldAnalytics }) {
  const MOOD_EMOJI: Record<string, string> = {
    happy: '😄', excited: '🤩', neutral: '😐', sad: '😔',
    angry: '😡', love: '😍', surprised: '😲',
  };
  if (data.distribution.length === 0) {
    return <p className="text-ink-charcoal/40 font-bold uppercase text-center py-8">No responses yet</p>;
  }
  return (
    <div className="space-y-4 flex-grow">
      {data.distribution.map((entry, i) => (
        <div key={entry.mood} className="flex items-center gap-3">
          <span className="text-2xl w-8 text-center">
            {MOOD_EMOJI[entry.mood.toLowerCase()] ?? entry.mood}
          </span>
          <div className="flex-grow">
            <div className="flex justify-between font-bold mb-1 text-sm uppercase">
              <span>{entry.mood}</span>
              <span>{entry.pct}%</span>
            </div>
            <div className="w-full h-6 bg-canvas-cream border-2 border-ink-charcoal">
              <div
                className={`h-full border-r-2 border-ink-charcoal ${BAR_ACCENT_COLORS[i % BAR_ACCENT_COLORS.length]}`}
                style={{ width: `${Math.max(entry.pct, 2)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold w-12 text-right opacity-70">{entry.count}</span>
        </div>
      ))}
    </div>
  );
}

function FileCard({ data }: { data: FileFieldAnalytics }) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-8 gap-4">
      <UploadCloud size={64} strokeWidth={1.5} className="opacity-30" />
      <div className="bg-electric-sun border-4 border-ink-charcoal p-6 text-center shadow-[8px_8px_0px_0px_rgba(44,46,42,1)]">
        <span className="font-display-lg text-[64px] font-black leading-none">{data.totalUploads}</span>
        <p className="font-bold uppercase text-lg mt-1">Files Uploaded</p>
      </div>
    </div>
  );
}

function DateCard({ data }: { data: DateFieldAnalytics }) {
  const maxCount = Math.max(...data.distribution.map((d) => d.count), 1);
  if (data.distribution.length === 0) {
    return <p className="text-ink-charcoal/40 font-bold uppercase text-center py-8">No responses yet</p>;
  }
  return (
    <div className="flex-grow">
      <div className="h-40 flex items-end gap-2 border-b-4 border-l-4 border-ink-charcoal pb-1 pl-2 mb-2">
        {data.distribution.map((entry, i) => (
          <div
            key={entry.label}
            className={`flex-1 border-2 border-ink-charcoal group relative hover:-translate-y-1 transition-transform ${BAR_ACCENT_COLORS[i % BAR_ACCENT_COLORS.length]}`}
            style={{ height: `${Math.max((entry.count / maxCount) * 100, 4)}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-ink-charcoal text-pure-white px-2 py-0.5 text-xs font-bold whitespace-nowrap pointer-events-none">
              {entry.count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs font-bold uppercase">
        {data.distribution.map((entry) => (
          <span key={entry.label} className="flex-1 text-center">{entry.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Analytics dispatcher ──────────────────────────────────────────
function renderAnalytics(analytics: FieldAnalyticsData) {
  switch (analytics.kind) {
    case 'text':    return <TextCard data={analytics} />;
    case 'choice':  return <ChoiceCard data={analytics} />;
    case 'numeric': return <NumericCard data={analytics} />;
    case 'mood':    return <MoodCard data={analytics} />;
    case 'file':    return <FileCard data={analytics} />;
    case 'date':    return <DateCard data={analytics} />;
  }
}

function getSubtitle(analytics: FieldAnalyticsData): string {
  switch (analytics.kind) {
    case 'text':    return `${analytics.totalAnswered} recent entries`;
    case 'choice':  return `${analytics.totalAnswered} total selections`;
    case 'numeric': return `${analytics.totalAnswered} responses`;
    case 'mood':    return `${analytics.totalAnswered} mood responses`;
    case 'file':    return `${analytics.totalUploads} file uploads`;
    case 'date':    return `${analytics.totalAnswered} date entries`;
  }
}

// ── Field Card ────────────────────────────────────────────────────
function FieldCard({ field, colorIdx }: { field: AnalyticsFieldItem; colorIdx: number }) {
  const Icon = FIELD_ICONS[field.type] ?? FileText;
  const bgColor = CARD_COLORS[colorIdx % CARD_COLORS.length];

  return (
    <div
      className="border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-8 flex flex-col h-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute -top-4 -right-4 bg-ink-charcoal text-pure-white text-xs font-black px-3 py-1 uppercase border-2 border-ink-charcoal">
        {field.type.replace('_', ' ')}
      </div>

      <div className="flex items-start gap-3 mb-4 border-b-4 border-ink-charcoal pb-4">
        <Icon size={28} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-headline-md text-xl uppercase font-black leading-tight">
            {field.label}
          </h3>
          <p className="font-bold text-sm opacity-70 mt-1 bg-pure-white/60 inline-block px-2 border border-ink-charcoal">
            {getSubtitle(field.analytics)}
          </p>
        </div>
      </div>

      {renderAnalytics(field.analytics)}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────
interface FieldAnalyticsProps {
  fields: AnalyticsFieldItem[];
}

export function FieldAnalytics({ fields }: FieldAnalyticsProps) {
  if (fields.length === 0) {
    return (
      <section className="bg-canvas-cream border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-12 text-center">
        <p className="font-headline-lg text-headline-lg font-black uppercase opacity-30">
          No fields to analyze
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <h2 className="font-headline-lg text-headline-lg uppercase border-b-4 border-ink-charcoal pb-4">
        Field Breakdown
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {fields.map((field, i) => (
          <FieldCard key={field.fieldId} field={field} colorIdx={i} />
        ))}
      </div>
    </section>
  );
}
