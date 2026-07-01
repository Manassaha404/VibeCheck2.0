import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DashboardBody } from "@/components/Dashboard/DashboardBody";

export const metadata = {
  title: "Dashboard — VibeCheck",
  description:
    "Manage your polls, forms, and petitions. Track engagement, spot trends and keep the vibes flowing.",
};

export default function DashboardPage() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body antialiased min-h-screen flex flex-col">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-grow w-full">
        <DashboardBody />
      </main>

      <Footer />
    </div>
  );
}
