"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CrowdCanvas } from "./CrowdCanvas";
import { ThumbsUp, BarChart2, ArrowRight, PlayCircle } from "lucide-react";

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 14 } 
  },
};

const textContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const charVariant: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    transition: { type: "spring", stiffness: 120, damping: 12 } 
  },
};

export default function HeroSection() {

  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden border-b-4 border-[var(--color-ink-charcoal)] bg-[var(--color-canvas-cream)]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none z-0" />

      {/* Animated Crowd Background */}
      <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center text-center mt-20">
        <div className="relative max-w-4xl mx-auto mb-8 w-full">
          
          {/* Interactive Floating UI Elements */}
          <motion.div 
            className="absolute -top-10 -right-4 md:-right-20 hidden md:flex flex-col gap-3 z-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-3 rounded-lg shadow-hard flex items-center gap-3 transform rotate-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center">
                <ThumbsUp size={16} className="text-[var(--color-ink-charcoal)]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <div className="h-2 w-16 bg-[var(--color-surface-variant)] rounded-full mb-1"></div>
                <div className="h-2 w-10 bg-[var(--color-surface-variant)] rounded-full"></div>
              </div>
            </div>
            <div className="bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] p-2 rounded-lg shadow-hard transform -rotate-3 self-end mr-4">
              <span className="font-display font-bold text-sm text-[var(--color-ink-charcoal)]">+84% Engagement</span>
            </div>
          </motion.div>

          <motion.div 
            className="absolute top-20 -left-4 md:-left-24 hidden md:flex flex-col gap-3 z-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] p-4 rounded-xl shadow-hard flex items-center gap-3 transform -rotate-6">
              <div className="w-10 h-10 rounded bg-[var(--color-primary-container)] border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center">
                <BarChart2 className="text-[var(--color-ink-charcoal)]" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--color-ink-charcoal)]">Live Poll</div>
                <div className="text-[10px] text-[var(--color-tertiary)] font-bold">1.2k responses</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.h1
              variants={fadeUpVariant}
              className="text-display-lg md:text-[5.5rem] leading-[1.1] font-display font-black text-[var(--color-ink-charcoal)] mb-6 drop-shadow-[4px_4px_0_rgba(142,212,98,1)]"
            >
              Ditch Boring Data.<br />
              <span className="text-[var(--color-pure-white)] bg-[var(--color-ink-charcoal)] px-6 py-2 border-4 border-[var(--color-ink-charcoal)] rounded-xl rotate-[-2deg] inline-block shadow-[8px_8px_0px_0px_#2C2E2A] mt-6 mb-2">
                Capture the Vibe.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariant}
              className="text-body-lg md:text-headline-sm text-[var(--color-ink-charcoal)] max-w-2xl mx-auto bg-[var(--color-canvas-cream)]/80 p-5 border-2 border-[var(--color-ink-charcoal)] rounded-xl backdrop-blur-sm shadow-hard mb-12"
            >
              Create polls, quizzes, petitions and forms in seconds. Gather real-time vibes
              from your community and turn data into decisions with a punch.
            </motion.p>

            <motion.div
              variants={fadeUpVariant}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/create"
                className="w-full sm:w-auto bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display text-headline-sm font-bold px-8 py-4 border-2 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard hover:bg-[var(--color-secondary-fixed)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                Start Collecting <ArrowRight strokeWidth={2.5} />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] font-display text-headline-sm font-bold px-8 py-4 border-2 border-[var(--color-ink-charcoal)] rounded-xl shadow-[4px_4px_0px_0px_#2C2E2A] hover:shadow-[0px_0px_0px_0px_#2C2E2A] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                View Demo <PlayCircle strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
