"use client";

import React, { use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignHeader from '@/components/petition-sign/SignHeader';
import SignatureForm from '@/components/petition-sign/SignatureForm';
import SignVibeCheck from '@/components/petition-sign/SignVibeCheck';
import SignRecentSigners from '@/components/petition-sign/SignRecentSigners';
import { useGetPetitionForSign } from '@/hook/petition/useGetPetitionForSign';
import { notFound } from 'next/navigation';

export default function PetitionSignPage({ params }: { params: Promise<{ username: string, slug: string }> }) {
  const { username, slug } = use(params);
  const { data, isLoading, isError } = useGetPetitionForSign(username, slug);

  if (isLoading) {
    return (
      <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex flex-col font-body-lg antialiased bg-dot-pattern">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="font-headline-md animate-pulse">Loading petition...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !data) {
    return notFound();
  }

  const { petition, totalSignatures, recentSignatures, hasSigned } = data;

  return (
    <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex flex-col font-body-lg antialiased bg-dot-pattern">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 relative z-10">
        <SignHeader title={petition.title} description={petition.description} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <SignatureForm petitionId={petition.petitionId} hasSigned={hasSigned} />
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SignVibeCheck totalSignatures={totalSignatures} signaturesTarget={petition.signaturesTarget} />
            <SignRecentSigners signers={recentSignatures} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
