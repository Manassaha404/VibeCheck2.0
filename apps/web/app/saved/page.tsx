import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SavedBody } from "@/components/Saved/SavedBody";

export const metadata = {
  title: "Saved Items | VibeCheck",
  description:
    "Access and manage all your bookmarked polls, quizzes, forms, and petitions in one place.",
};

export default function SavedPage() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full relative">
        <SavedBody />
      </main>
      <Footer />
    </div>
  );
}
