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

      <main className="flex-grow z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-16">
        <LiveBanner />
        <HeaderSection 
          title={petition.title} 
          status={petition.status} 
          totalSignatures={petition.totalSignatures} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <OverviewCard 
              title={petition.title} 
              totalSignatures={petition.totalSignatures} 
              target={petition.signaturesTarget} 
            />
            <GrowthChart data={growth} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            <LiveVibeFeed signatures={recentSignatures} />
          </div>
        </div>

        <div className="mt-6 w-full">
          <TopHubsMap topCities={topHubs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
