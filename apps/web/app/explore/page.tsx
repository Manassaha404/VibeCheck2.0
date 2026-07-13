"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreSearch from "@/components/explore/ExploreSearch";
import TrendingSection from "@/components/explore/TrendingSection";
import ForYouSection from "@/components/explore/ForYouSection";
import JoinQuizSection from "@/components/explore/JoinQuizSection";
import Dock, { DockItemData } from "@/components/ui/dock";
import { TrendingUp, BarChart2, ClipboardList, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ExploreTab = "trending" | "join-quiz" | "polls" | "petitions";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>("trending");

  const dockItems: DockItemData[] = [
    {
      icon: (
        <TrendingUp
          size={24}
          className={
            activeTab === "trending"
              ? "text-[var(--color-ink-charcoal)]"
              : "text-[var(--color-outline)]"
          }
        />
      ),
      label: "Trending",
      onClick: () => setActiveTab("trending"),
      isActive: activeTab === "trending",
    },
    {
      icon: (
        <Gamepad2
          size={24}
          className={
            activeTab === "join-quiz"
              ? "text-[var(--color-ink-charcoal)]"
              : "text-[var(--color-outline)]"
          }
        />
      ),
      label: "Join Quiz",
      onClick: () => setActiveTab("join-quiz"),
      isActive: activeTab === "join-quiz",
    },
    {
      icon: (
        <BarChart2
          size={24}
          className={
            activeTab === "polls"
              ? "text-[var(--color-ink-charcoal)]"
              : "text-[var(--color-outline)]"
          }
        />
      ),
      label: "Polls",
      onClick: () => setActiveTab("polls"),
      isActive: activeTab === "polls",
    },
    {
      icon: (
        <ClipboardList
          size={24}
          className={
            activeTab === "petitions"
              ? "text-[var(--color-ink-charcoal)]"
              : "text-[var(--color-outline)]"
          }
        />
      ),
      label: "Petitions",
      onClick: () => setActiveTab("petitions"),
      isActive: activeTab === "petitions",
    },
  ];

  return (
    <div className="bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] font-body min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements for vibe */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--color-lavender)] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--color-mint)] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-float-medium pointer-events-none" />

      <Navbar />

      <div className="flex flex-1 max-w-[1000px] mx-auto w-full relative z-10 mb-24">
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <ExploreSearch />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeTab === "trending" && (
                <div className="flex flex-col gap-12">
                  <TrendingSection />
                  <ForYouSection />
                </div>
              )}

              {activeTab === "join-quiz" && <JoinQuizSection />}

              {activeTab === "polls" && <ForYouSection type="poll" />}

              {activeTab === "petitions" && <ForYouSection type="petition" />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* The Animated Dock positioned fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none flex justify-center items-end">
        <Dock items={dockItems} className="pointer-events-auto" />
      </div>
    </div>
  );
}
