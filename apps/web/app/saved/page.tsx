import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SavedBody } from "@/components/Saved/SavedBody";

export const metadata = {
  title: "Saved Items — VibeCheck",
  description: "View and manage your saved polls, forms, and petitions.",
};

export default function SavedPage() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body antialiased min-h-screen flex flex-col">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-grow w-full relative">
        <SavedBody />
      </main>

      <Footer />
    </div>
  );
}
