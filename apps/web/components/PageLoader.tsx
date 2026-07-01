import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PageLoader() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 space-y-10">
        <div className="animate-pulse flex flex-col gap-8 w-full">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="h-10 w-1/3 bg-[var(--color-surface-container-high)] rounded-lg"></div>
            <div className="h-6 w-1/4 bg-[var(--color-surface-container)] rounded-lg"></div>
          </div>
          
          {/* Main Content Area Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-[var(--color-pure-white)] border-2 border-[var(--color-outline-variant)] rounded-xl"></div>
            <div className="h-64 bg-[var(--color-pure-white)] border-2 border-[var(--color-outline-variant)] rounded-xl"></div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[260px] bg-[var(--color-pure-white)] border-2 border-[var(--color-outline-variant)] rounded-xl p-5 flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-md bg-[var(--color-surface-container-high)]" />
                  <div className="h-6 w-14 rounded-md bg-[var(--color-surface-container-high)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-3/4 rounded bg-[var(--color-surface-container-high)]" />
                  <div className="h-4 w-full rounded bg-[var(--color-surface-container)]" />
                </div>
                <div className="h-px bg-[var(--color-outline-variant)] mt-auto" />
                <div className="flex justify-between">
                  <div className="h-4 w-28 rounded bg-[var(--color-surface-container)]" />
                  <div className="h-4 w-10 rounded bg-[var(--color-surface-container)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
