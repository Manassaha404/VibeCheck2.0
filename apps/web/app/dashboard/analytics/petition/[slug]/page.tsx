"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveBanner from '@/components/analytics/petition/LiveBanner';
import HeaderSection from '@/components/analytics/petition/HeaderSection';
import OverviewCard from '@/components/analytics/petition/OverviewCard';
import GrowthChart from '@/components/analytics/petition/GrowthChart';
import LiveVibeFeed from '@/components/analytics/petition/LiveVibeFeed';
import TopHubsMap from '@/components/analytics/petition/TopHubsMap';
import PetitionNotFound from '@/components/analytics/petition/PetitionNotFound';
import ShareComponent from '@/components/analytics/petition/ShareComponent';
import { useParams } from 'next/navigation';
import { usePetitionAnalytics } from '@/hook/petition/usePetitionAnalytics';

export default function PetitionAnalyticsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? null;
  const { analytics, isLoading, isError } = usePetitionAnalytics(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col font-body bg-dot-pattern relative overflow-x-hidden justify-center items-center">
        <p className="font-display text-headline-md text-[var(--color-ink-charcoal)]">Loading Analytics...</p>
      </div>
    );
  }

  if (isError || !analytics) {
    return <PetitionNotFound />;
  }

  const { petition, growth, recentSignatures, topHubs } = analytics;

  return (
    <div className="min-h-screen flex flex-col font-body bg-dot-pattern relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-ink-charcoal) 2px, transparent 2.5px)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }}
      />

      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 space-y-16 relative z-10">
        <div className="space-y-6">
          <LiveBanner />
          <HeaderSection
            title={petition.title}
            status={petition.status}
            totalSignatures={petition.totalSignatures}
          />
        </div>

        <OverviewCard
          title={petition.title}
          totalSignatures={petition.totalSignatures}
          target={petition.signaturesTarget}
        />

        <GrowthChart data={growth} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TopHubsMap topCities={topHubs} />
          <LiveVibeFeed signatures={recentSignatures} />
        </div>

        <ShareComponent username={petition.username} slug={petition.slug} />
      </main>

      <Footer />
    </div>
  );
}
