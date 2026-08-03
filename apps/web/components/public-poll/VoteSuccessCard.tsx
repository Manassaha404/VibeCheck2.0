"use client";

import React, { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  QrCode,
  Trophy,
  Sparkles,
  Star,
  Zap,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

const TORN_EDGE_CLIP =
  "polygon(0% 0%,100% 0%,100% 95%,93.75% 100%,87.5% 95%,81.25% 100%,75% 95%,68.75% 100%,62.5% 95%,56.25% 100%,50% 95%,43.75% 100%,37.5% 95%,31.25% 100%,25% 95%,18.75% 100%,12.5% 95%,6.25% 100%,0% 95%)";

const OfficialStamp = () => {
  const pathId = useId();
  return (
    <motion.div
      initial={{ scale: 1.6, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: -14 }}
      transition={{ type: "spring", bounce: 0.45, delay: 0.55, duration: 0.7 }}
      className="relative w-[104px] h-[104px] md:w-[124px] md:h-[124px] shrink-0"
    >
      <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full">
        <circle
          cx="70"
          cy="70"
          r="66"
          fill="none"
          stroke="var(--color-vivid-coral)"
          strokeWidth="6"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="var(--color-vivid-coral)"
          strokeWidth="2"
          strokeDasharray="3 4"
        />
        <path
          id={pathId}
          d="M 70,70 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
          fill="none"
        />
        <text
          fill="var(--color-vivid-coral)"
          fontFamily="'Hanken Grotesk', sans-serif"
          fontWeight={700}
          fontSize="10.5"
          letterSpacing="2"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            OFFICIAL RESULT • VIBE CONFIRMED •
          </textPath>
        </text>
        <g transform="translate(70,72)">
          <path
            d="M -16,4 L -6,14 L 18,-12"
            fill="none"
            stroke="var(--color-vivid-coral)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </motion.div>
  );
};

const TicketStub = ({
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
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{
        duration: 0.5,
        delay: 0.08 * index,
        type: "spring",
        bounce: 0.4,
      }}
      className={cn(
        "relative flex border-[4px] border-ink-charcoal bg-pure-white overflow-hidden transition-shadow",
        isSelected
          ? "shadow-hard-xl z-10"
          : "shadow-hard hover:shadow-hard-lg z-0",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center px-5 md:px-7 py-6 shrink-0 w-[112px] md:w-[150px]",
          color,
        )}
      >
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay pointer-events-none" />
        <span className="relative font-display font-black text-ink-charcoal text-[40px] md:text-[56px] leading-none tracking-tighter">
          {pct}
          <span className="text-headline-sm md:text-headline-md align-top">
            %
          </span>
        </span>
        <span className="relative text-label-sm uppercase tracking-widest text-ink-charcoal/70 mt-1">
          {votes.toLocaleString()} {votes === 1 ? "vote" : "votes"}
        </span>
      </div>

      <div className="relative w-0 border-l-[3px] border-dashed border-ink-charcoal shrink-0">
        <span className="absolute -top-[9px] -left-[9px] w-[18px] h-[18px] rounded-full bg-canvas-cream border-[3px] border-ink-charcoal" />
        <span className="absolute -bottom-[9px] -left-[9px] w-[18px] h-[18px] rounded-full bg-canvas-cream border-[3px] border-ink-charcoal" />
      </div>

      <div className="relative flex-1 flex items-center px-6 md:px-8 py-6 min-h-[104px] md:min-h-[128px] overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{
            duration: 1,
            delay: 0.3 + index * 0.08,
            type: "spring",
            bounce: 0.15,
          }}
          className={cn("absolute inset-y-0 left-0 opacity-15", color)}
        />
        <h3 className="relative text-headline-sm md:text-headline-md text-ink-charcoal uppercase font-black leading-tight">
          {option.text}
        </h3>

        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 8 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.5 }}
            className="absolute top-3 right-3 md:top-4 md:right-4 bg-electric-sun border-[3px] border-ink-charcoal px-2.5 py-1 shadow-hard-sm flex items-center gap-1.5"
          >
            <Ticket size={16} strokeWidth={3} className="text-ink-charcoal" />
            <span className="text-label-sm uppercase font-black text-ink-charcoal tracking-wide">
              Your pick
            </span>
          </motion.div>
        )}
      </div>
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
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const topOption = [...options].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
  )[0];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "VibeCheck Poll", url: currentUrl });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 md:gap-14">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
          style={{ clipPath: TORN_EDGE_CLIP }}
          className="relative bg-electric-sun border-[4px] border-ink-charcoal border-b-0 pt-10 md:pt-16 px-8 md:px-16 pb-16 md:pb-24 shadow-[10px_10px_0_0_var(--color-ink-charcoal)] overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: -4 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative z-10 bg-pure-white border-[4px] border-ink-charcoal px-6 py-2 shadow-hard mb-8 inline-flex items-center gap-3"
          >
            <Zap size={22} className="text-ink-charcoal fill-ink-charcoal" />
            <span className="font-display font-black text-headline-sm text-ink-charcoal uppercase tracking-widest">
              Ballot Counted
            </span>
          </motion.div>

          <h1 className="text-display-lg md:text-[60px] lg:text-[72px] leading-[0.95] text-ink-charcoal font-black uppercase max-w-4xl relative z-10">
            {question}
          </h1>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-pure-white border-[4px] border-ink-charcoal px-8 py-4 shadow-hard flex items-center gap-4 -rotate-1"
          >
            <span className="font-body text-label-md md:text-headline-sm uppercase text-ink-charcoal tracking-widest font-black">
              Total Ballots
            </span>
            <span className="font-display text-headline-md md:text-headline-lg bg-ink-charcoal text-pure-white px-4 py-1 rounded-sm">
              {totalVotes.toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -right-4 top-16 bg-sky-blue border-[4px] border-ink-charcoal p-4 shadow-hard z-0 hidden lg:block rotate-12"
          >
            <Star size={36} className="text-ink-charcoal fill-ink-charcoal" />
          </motion.div>
        </motion.div>
      </div>

      {topOption && totalVotes > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="w-full bg-lavender border-[4px] border-ink-charcoal shadow-hard-lg flex flex-col md:flex-row items-center overflow-hidden card-lift group"
        >
          <div className="bg-ink-charcoal p-8 md:p-10 flex items-center justify-center self-stretch w-full md:w-auto">
            <Trophy
              size={56}
              className="text-electric-sun group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
            />
          </div>
          <div className="p-8 md:p-10 flex-1 flex flex-col md:flex-row items-center gap-6 relative">
            <div className="flex-1 text-center md:text-left">
              <span className="font-display font-black text-ink-charcoal uppercase tracking-[0.2em] text-label-md bg-pure-white border-2 border-ink-charcoal inline-block px-3 py-1 shadow-hard-sm mb-3 -rotate-2">
                Crowd Favorite
              </span>
              <h2 className="text-headline-lg text-ink-charcoal font-black uppercase leading-none">
                {topOption.text}
              </h2>
            </div>
            <OfficialStamp />
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-5 md:gap-6 relative z-10">
        {options.map((opt, idx) => (
          <TicketStub
            key={opt.pollOptionId}
            option={opt}
            index={idx}
            totalVotes={totalVotes}
            isSelected={opt.pollOptionId === selectedOptionId}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        <button
          onClick={handleShare}
          className={cn(
            "h-20 md:h-24 border-[4px] border-ink-charcoal shadow-hard-lg btn-press flex items-center justify-center gap-4 transition-colors group relative overflow-hidden",
            copied
              ? "bg-leaf-green text-ink-charcoal"
              : "bg-mint text-ink-charcoal",
          )}
        >
          <div className="absolute inset-0 bg-pure-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <Sparkles size={30} strokeWidth={2.5} />
                <span className="font-display font-black text-headline-sm uppercase tracking-widest">
                  Link Copied!
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <Share2
                  size={30}
                  strokeWidth={2.5}
                  className="group-hover:animate-wiggle"
                />
                <span className="font-display font-black text-headline-sm uppercase tracking-widest">
                  Share Poll
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setIsQrOpen(true)}
          className="h-20 md:h-24 bg-vivid-coral text-ink-charcoal border-[4px] border-ink-charcoal shadow-hard-lg btn-press flex items-center justify-center gap-4 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-pure-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <QrCode
            size={30}
            strokeWidth={2.5}
            className="relative z-10 group-hover:scale-110 transition-transform"
          />
          <span className="relative z-10 font-display font-black text-headline-sm uppercase tracking-widest">
            QR Code
          </span>
        </button>
      </motion.div>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="bg-canvas-cream border-[4px] border-ink-charcoal shadow-hard-xl rounded-none max-w-sm sm:max-w-md p-0 overflow-hidden">
          <div className="bg-vivid-coral border-b-[4px] border-ink-charcoal p-6 flex items-center justify-center">
            <DialogTitle className="text-headline-md text-ink-charcoal text-center font-black uppercase tracking-widest">
              Scan & Vote
            </DialogTitle>
          </div>
          <div className="p-10 flex flex-col items-center bg-dot-pattern">
            <div className="bg-pure-white p-6 border-[4px] border-ink-charcoal shadow-hard rotate-2 hover:rotate-0 transition-transform duration-300">
              <QRCode value={currentUrl} size={220} fgColor="#2C2E2A" />
            </div>
            <div className="mt-8 bg-pure-white border-2 border-ink-charcoal px-4 py-2 shadow-hard-sm -rotate-1">
              <p className="text-label-md font-black text-ink-charcoal uppercase text-center tracking-widest">
                Share the Vibe!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
