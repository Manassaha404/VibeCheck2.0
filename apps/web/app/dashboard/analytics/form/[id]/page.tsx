'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnalyticsHeader } from '@/components/analytics/form/AnalyticsHeader';
import { MoodAndRating } from '@/components/analytics/form/MoodAndRating';
import { VibesOverTime } from '@/components/analytics/form/VibesOverTime';
import { FieldAnalytics } from '@/components/analytics/form/FieldAnalytics';
import { ShareActions } from '@/components/analytics/form/ShareActions';
import { ExportSection } from '@/components/analytics/form/ExportSection';
import { useFormAnalytics } from '@/hook/form/useFormAnalytics';
import type {
  MoodFieldAnalytics,
  NumericFieldAnalytics,
  AnalyticsFieldItem,
  FieldAnalyticsData,
} from '@/components/analytics/form/types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ── Loading skeleton ────────────────────────────────────────────
function AnalyticsSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      <div className="space-y-4">
        <div className="h-24 bg-ink-charcoal/10 border-4 border-ink-charcoal/20 w-3/4" />
        <div className="h-16 bg-ink-charcoal/10 border-4 border-ink-charcoal/20 w-1/2" />
        <div className="h-12 bg-electric-sun/30 border-4 border-ink-charcoal/20 w-48 mt-4" />
      </div>
      <div className="h-64 bg-pure-white border-4 border-ink-charcoal/20 shadow-[8px_8px_0px_0px_rgba(44,46,42,0.1)] flex items-end gap-4 p-8">
        {[20, 45, 30, 60, 90, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-ink-charcoal/10 border-2 border-ink-charcoal/20"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="h-80 bg-pure-white border-4 border-ink-charcoal/20" />
        <div className="h-80 bg-leaf-green/20 border-4 border-ink-charcoal/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-pure-white border-4 border-ink-charcoal/20" />
        ))}
      </div>
    </div>
  );
}

// ── Error state ─────────────────────────────────────────────────
function AnalyticsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="bg-[#FF007F] border-4 border-ink-charcoal shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] p-12 text-center max-w-lg rotate-1">
        <AlertTriangle size={64} strokeWidth={2} className="text-pure-white mx-auto mb-4" />
        <h2 className="font-display-lg text-[48px] font-black uppercase text-pure-white mb-4">
          VIBE CHECK FAILED!
        </h2>
        <p className="font-bold text-pure-white/80 text-lg mb-8">{message}</p>
        <button
          onClick={onRetry}
          className="bg-electric-sun text-ink-charcoal font-black uppercase text-xl px-8 py-4 border-4 border-ink-charcoal shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] hover:bg-pure-white transition-colors flex items-center gap-3 mx-auto active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <RefreshCw size={24} strokeWidth={3} />
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export default function FormAnalyticsPage() {
  const params = useParams();
  const formSlug = params?.id as string;

  const { analytics, isLoading, isError, error, refetch } = useFormAnalytics(formSlug);

  // Carve out mood field for the dedicated MoodAndRating panel
  const moodField = analytics?.fields.find((f) => f.type === 'mood');

  // All other fields go to FieldAnalytics
  const otherFields: AnalyticsFieldItem[] =
    analytics?.fields.filter((f) => f.type !== 'mood') ?? [];

  return (
    <div className="text-ink-charcoal min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 space-y-16">
        {isLoading ? (
          <AnalyticsSkeleton />
        ) : isError ? (
          <AnalyticsError
            message={
              (error as { message?: string })?.message ??
              'Could not load analytics for this form.'
            }
            onRetry={refetch}
          />
        ) : analytics ? (
          <>
            {/* 1. Header — form title, total count, status */}
            <AnalyticsHeader
              formTitle={analytics.form.title}
              totalResponses={analytics.totalResponses}
              status={analytics.form.status}
              formSlug={analytics.form.slug}
            />

            {/* 2. Weekly response bar chart */}
            <VibesOverTime weeklyData={analytics.weeklyResponses} />

            {/* 3. Mood pie (only if mood field exists) */}
            {moodField && (
              <MoodAndRating
                moodField={
                  moodField.analytics.kind === 'mood'
                    ? (moodField.analytics as MoodFieldAnalytics)
                    : undefined
                }
              />
            )}

            {/* 4. Per-field analytics (all types except mood / rating) */}
            {otherFields.length > 0 && <FieldAnalytics fields={otherFields} />}

            {/* 5. Share panel */}
            <ShareActions formSlug={analytics.form.slug} />

            {/* 6. CSV export */}
            <ExportSection
              formSlug={analytics.form.slug}
              fields={analytics.fields.map((f) => ({
                fieldId: f.fieldId,
                label: f.label,
                type: f.type,
                analytics: f.analytics as FieldAnalyticsData,
              }))}
            />
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
