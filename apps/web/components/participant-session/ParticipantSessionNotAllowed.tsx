import React from "react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ParticipantSessionNotAllowed() {
  const router = useRouter();

  return (
    <div className="bg-[var(--color-canvas-cream)] min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl p-8 flex flex-col gap-6 text-center items-center">
            <div className="absolute -inset-2 bg-[var(--color-vivid-coral)] border-4 border-[var(--color-ink-charcoal)] shadow-hard-xl -rotate-2 -z-10" />
            <div className="w-16 h-16 rounded-full bg-[var(--color-error-container)] border-4 border-[var(--color-ink-charcoal)] flex items-center justify-center shadow-hard">
              <AlertTriangle
                size={28}
                strokeWidth={2.5}
                className="text-[var(--color-error)]"
              />
            </div>
            <h1 className="font-display font-black text-headline-lg uppercase text-[var(--color-ink-charcoal)]">
              Session Already Started
            </h1>
            <p className="font-body text-body-md text-[var(--color-on-surface-variant)]">
              You cannot join a session that is already in progress.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 flex items-center justify-center gap-2 bg-[var(--color-surface-container)] border-4 border-[var(--color-ink-charcoal)] shadow-hard px-6 py-3 font-display font-bold uppercase text-label-md btn-press hover:bg-[var(--color-electric-sun)] transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
