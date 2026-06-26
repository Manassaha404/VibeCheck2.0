"use client";

import React from "react";
import { motion } from "framer-motion";
import { Share2, QrCode, Trophy, CheckCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultOption {
  pollOptionId: string;
  text: string;
  votes?: number;
  percentage?: number;
}

interface VoteSuccessCardProps {
  question: string;
  options: ResultOption[];
  totalVotes: number;
  selectedOptionId: string;
  onShare?: () => void;
}

const accentColors = [
  "bg-leaf-green",
  "bg-sky-blue",
  "bg-vivid-coral",
  "bg-lavender",
  "bg-tangerine",
  "bg-mint",
];

const ResultBar = ({
  option,
  index,
  totalVotes,
  isSelected,
}: {
  option: ResultOption;
  index: number;
  totalVotes: number;
  isSelected: boolean;
}) => {
  const votes = option.votes ?? 0;
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const color = accentColors[index % accentColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className={cn(
        "relative flex flex-col p-5 bg-pure-white border-[3px] border-ink-charcoal rounded-xl transition-all duration-200 group overflow-hidden",
        isSelected ? "shadow-hard-lg bg-surface" : "shadow-hard hover:shadow-hard-lg hover:-translate-y-1 hover:-translate-x-1"
      )}
    >
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-3">
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="bg-leaf-green border-2 border-ink-charcoal rounded-full p-1"
            >
              <CheckCheck size={18} strokeWidth={3} className="text-ink-charcoal" />
            </motion.div>
          )}
          <span className="font-headline-sm text-ink-charcoal text-xl md:text-2xl">{option.text}</span>
        </div>
        <span className="font-headline-md text-ink-charcoal">{pct}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-5 bg-canvas-cream border-[3px] border-ink-charcoal rounded-full overflow-hidden relative z-10">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, type: "spring", bounce: 0.2 }}
          className={cn("absolute top-0 left-0 h-full border-r-[3px] border-ink-charcoal", color)}
        />
      </div>

      {/* Decorative dots in background */}
      <div className="absolute right-0 bottom-0 w-24 h-24 bg-dot-pattern opacity-30 pointer-events-none rounded-tl-[100%]" />
    </motion.div>
  );
};

export const VoteSuccessCard = ({
  question,
  options,
  totalVotes,
  selectedOptionId,
  onShare,
}: VoteSuccessCardProps) => {
  const topOption = [...options].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
  )[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "VibeCheck Poll", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-canvas-cream border-[4px] border-ink-charcoal p-8 md:p-12 rounded-2xl shadow-hard-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: -2 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-electric-sun border-[3px] border-ink-charcoal px-4 py-2 rounded-full mb-6 shadow-hard"
          >
            <Sparkles size={18} strokeWidth={2.5} className="text-ink-charcoal" />
            <span className="font-label-md font-black text-ink-charcoal uppercase tracking-wider">
              Vibe Recorded!
            </span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-charcoal leading-[1.1] max-w-3xl">
            {question}
          </h1>
        </div>

        {/* Decorative elements */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: 12 }} 
          transition={{ type: "spring", delay: 0.5 }}
          className="absolute -right-6 -top-6 bg-lavender border-[4px] border-ink-charcoal p-4 rounded-full shadow-hard hidden md:block"
        >
          <span className="text-3xl">✌️</span>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Results */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {options.map((opt, idx) => (
            <ResultBar
              key={opt.pollOptionId}
              option={opt}
              index={idx}
              totalVotes={totalVotes}
              isSelected={opt.pollOptionId === selectedOptionId}
            />
          ))}
        </div>

        {/* Right: Stats & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-leaf-green border-[4px] border-ink-charcoal rounded-2xl p-6 shadow-hard-lg flex flex-col items-center justify-center text-center tilt-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-pure-white border-l-[4px] border-b-[4px] border-ink-charcoal rounded-bl-3xl opacity-50" />
            <span className="font-label-sm text-ink-charcoal uppercase tracking-widest mb-1 mt-2">
              Total Votes
            </span>
            <span className="font-display text-6xl text-ink-charcoal">
              {totalVotes.toLocaleString()}
            </span>
          </motion.div>

          {topOption && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-pure-white border-[4px] border-ink-charcoal rounded-2xl p-6 shadow-hard-lg flex flex-col relative overflow-hidden group"
            >
              <span className="font-label-sm text-ink-charcoal uppercase tracking-widest mb-2 z-10">
                Top Answer
              </span>
              <span className="font-headline-sm text-ink-charcoal z-10 pr-8">
                {topOption.text}
              </span>
              <Trophy
                size={80}
                strokeWidth={1.5}
                className="absolute -right-4 -bottom-6 text-electric-sun opacity-60 group-hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 mt-auto"
          >
            <button
              onClick={handleShare}
              className="flex-grow bg-tangerine text-ink-charcoal font-headline-sm py-4 px-6 border-[3px] border-ink-charcoal rounded-xl shadow-hard btn-press flex justify-center items-center gap-3"
            >
              <Share2 size={22} strokeWidth={2.5} />
              Share
            </button>
            <button
              aria-label="QR Code"
              className="w-16 h-16 bg-pure-white text-ink-charcoal border-[3px] border-ink-charcoal rounded-xl shadow-hard btn-press flex justify-center items-center shrink-0"
            >
              <QrCode size={24} strokeWidth={2.5} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
