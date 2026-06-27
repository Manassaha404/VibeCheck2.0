"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, QrCode, Trophy, CheckCheck, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
        "relative flex flex-col p-5 md:p-6 border-[4px] border-ink-charcoal rounded-2xl transition-all duration-200 group overflow-hidden",
        isSelected ? `shadow-hard-xl ${color}` : "shadow-hard hover-lift bg-pure-white cursor-pointer hover:bg-canvas-cream"
      )}
    >
      <div className="flex justify-between items-center mb-5 z-10">
        <div className="flex items-center gap-3">
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="bg-pure-white border-[3px] border-ink-charcoal rounded-full p-1"
            >
              <CheckCheck size={20} strokeWidth={3} className="text-ink-charcoal" />
            </motion.div>
          )}
          <span className="font-headline-sm text-ink-charcoal text-xl md:text-2xl group-hover:text-shadow-yellow transition-all">
            {option.text}
          </span>
        </div>
        <span className={cn(
          "font-headline-md text-ink-charcoal px-3 py-1 border-[3px] border-ink-charcoal rounded-lg shadow-hard-sm transform rotate-2 group-hover:rotate-0 transition-transform",
          isSelected ? "bg-pure-white" : color
        )}>
          {pct}%
        </span>
      </div>

      {/* Progress Track */}
      <div className={cn(
        "w-full h-6 border-[3px] border-ink-charcoal rounded-full overflow-hidden relative z-10 shadow-inner",
        isSelected ? "bg-ink-charcoal" : "bg-pure-white"
      )}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, type: "spring", bounce: 0.2 }}
          className={cn(
            "absolute top-0 left-0 h-full border-r-[3px] border-ink-charcoal flex items-center justify-end pr-2", 
            isSelected ? "bg-pure-white" : color
          )}
        >
          {pct > 15 && <Star size={12} className="text-ink-charcoal opacity-60 fill-ink-charcoal animate-wiggle" />}
        </motion.div>
      </div>

      {/* Decorative dots in background */}
      <div className={cn(
        "absolute right-0 bottom-0 w-32 h-32 bg-dot-pattern opacity-20 pointer-events-none rounded-tl-full transition-transform duration-500 group-hover:scale-110",
        isSelected ? "mix-blend-overlay opacity-30" : ""
      )} />
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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const topOption = [...options].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
  )[0];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "VibeCheck Poll", url: currentUrl });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } else {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onShare?.();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-canvas-cream border-[4px] border-ink-charcoal p-8 md:p-14 rounded-2xl shadow-hard-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-electric-sun border-[3px] border-ink-charcoal px-5 py-2 rounded-full mb-8 shadow-hard hover:animate-wiggle cursor-default"
          >
            <Sparkles size={20} strokeWidth={3} className="text-ink-charcoal" />
            <span className="font-label-md font-black text-ink-charcoal uppercase tracking-widest">
              Vibe Recorded!
            </span>
          </motion.div>

          <h1 className="text-display-lg text-ink-charcoal leading-tight max-w-4xl relative z-10">
            {question}
          </h1>
        </div>

        {/* Decorative elements */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: 12 }} 
          transition={{ type: "spring", delay: 0.5 }}
          className="absolute -right-6 -top-6 bg-lavender border-[4px] border-ink-charcoal p-5 rounded-full shadow-hard hidden md:block animate-float-slow"
        >
          <span className="text-4xl">✌️</span>
        </motion.div>

        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: -15 }} 
          transition={{ type: "spring", delay: 0.7 }}
          className="absolute right-1/4 -bottom-8 bg-mint border-[4px] border-ink-charcoal p-4 rounded-full shadow-hard hidden md:block animate-float-medium"
        >
          <span className="text-3xl">🎯</span>
        </motion.div>

        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: -25 }} 
          transition={{ type: "spring", delay: 0.6 }}
          className="absolute -left-4 top-1/3 bg-electric-sun border-[4px] border-ink-charcoal p-3 rounded-full shadow-hard hidden md:block animate-wiggle"
        >
          <Star size={24} className="text-ink-charcoal fill-ink-charcoal" />
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Left: Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
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
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-leaf-green border-[4px] border-ink-charcoal rounded-2xl p-8 shadow-hard-lg flex flex-col items-center justify-center text-center tilt-card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-pure-white border-l-[4px] border-b-[4px] border-ink-charcoal rounded-bl-[2rem] opacity-50 flex items-center justify-center">
              <Star size={24} className="text-ink-charcoal opacity-40 animate-wiggle" />
            </div>
            <span className="font-label-sm text-ink-charcoal uppercase tracking-[0.2em] mb-2 mt-4">
              Total Votes
            </span>
            <span className="font-display text-7xl text-ink-charcoal tracking-tight">
              {totalVotes.toLocaleString()}
            </span>
          </motion.div>

          {topOption && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-sky-blue border-[4px] border-ink-charcoal rounded-2xl p-8 shadow-hard-lg flex flex-col relative overflow-hidden card-lift group"
            >
              <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none mix-blend-overlay" />
              <span className="font-label-sm text-ink-charcoal uppercase tracking-[0.2em] mb-3 z-10 flex items-center gap-2">
                Top Answer <Sparkles size={16} />
              </span>
              <span className="font-headline-sm text-ink-charcoal z-10 pr-10 leading-tight">
                {topOption.text}
              </span>
              <Trophy
                size={100}
                strokeWidth={1.5}
                className="absolute -right-8 -bottom-8 text-pure-white opacity-40 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500"
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
              className={cn(
                "flex-grow font-headline-sm py-4 md:py-5 px-6 border-[4px] border-ink-charcoal rounded-2xl shadow-hard btn-press flex justify-center items-center gap-3 text-lg group transition-colors",
                copied ? "bg-leaf-green text-ink-charcoal" : "bg-tangerine text-ink-charcoal"
              )}
            >
              {copied ? (
                <>
                  <CheckCheck size={24} strokeWidth={2.5} className="animate-pop-in" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 size={24} strokeWidth={2.5} className="group-hover:animate-wiggle" />
                  Share Poll
                </>
              )}
            </button>
            <button
              onClick={() => setIsQrOpen(true)}
              aria-label="QR Code"
              className="w-16 md:w-20 bg-lavender text-ink-charcoal border-[4px] border-ink-charcoal rounded-2xl shadow-hard btn-press flex justify-center items-center shrink-0 group"
            >
              <QrCode size={28} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="bg-canvas-cream border-[4px] border-ink-charcoal shadow-hard-xl rounded-3xl max-w-sm sm:max-w-md p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-headline-md text-ink-charcoal text-center font-black">
              Scan to Vote
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 bg-pure-white border-[4px] border-ink-charcoal rounded-2xl shadow-inner mb-6 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-dot-pattern opacity-20 pointer-events-none rounded-tl-[100%] transition-transform duration-500 group-hover:scale-110" />
            <div className="relative z-10 bg-pure-white p-4 border-[3px] border-ink-charcoal rounded-xl shadow-hard">
              <QRCode value={currentUrl} size={180} fgColor="#2C2E2A" />
            </div>
          </div>
          <p className="text-body-lg font-bold text-ink-charcoal text-center">
            Let your friends scan this code to share their vibes!
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
