"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuizSessionHeader } from "@/components/dashboard/quiz-session/QuizSessionHeader";
import { QuizHeroCard } from "@/components/dashboard/quiz-session/QuizHeroCard";
import { QuizStats } from "@/components/dashboard/quiz-session/QuizStats";
import { PreviousSessions } from "@/components/dashboard/quiz-session/PreviousSessions";
import { QuizLeaderboard } from "@/components/dashboard/quiz-session/QuizLeaderboard";

export default function QuizSessionHub() {
  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] min-h-screen flex flex-col bg-dot-pattern">
      <Navbar />
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 pt-24 pb-12 flex flex-col gap-16">
        <QuizSessionHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <QuizHeroCard />
            <QuizStats />
            <PreviousSessions />
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <QuizLeaderboard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
