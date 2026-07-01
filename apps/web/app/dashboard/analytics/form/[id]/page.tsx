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
import PageLoader from '@/components/PageLoader';
import { DashboardError } from '@/components/Dashboard/DashboardError';

// ── Main Page ───────────────────────────────────────────────────
export default function FormAnalyticsPage() {
  const params = useParams();
  const formSlug = params?.id as string;

  const { analytics, isLoading, isError, error, refetch } = useFormAnalytics(formSlug);

  if (isLoading) {
    return <PageLoader />;
  }

  // Carve out mood field for the dedicated MoodAndRating panel
  const moodField = analytics?.fields.find((f) => f.type === 'mood');

  // All other fields go to FieldAnalytics
  const otherFields: AnalyticsFieldItem[] =
    analytics?.fields.filter((f) => f.type !== 'mood') ?? [];

  return (
    <div className="text-ink-charcoal min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 space-y-16">
        {isError ? (
          <DashboardError
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
