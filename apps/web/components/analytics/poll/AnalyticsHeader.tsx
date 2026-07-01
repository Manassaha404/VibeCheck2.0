"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, QrCode, X, Copy, Check, ExternalLink, Loader2, Zap } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

interface AnalyticsHeaderProps {
  question: string;
  pollId: string;
  slug: string;
  username: string;
  startedAt?: string;
  isLive?: boolean;
  status?: string;
}

export function AnalyticsHeader({
  question,
  pollId,
  slug,
  username,
  startedAt,
  isLive = true,
  status,
}: AnalyticsHeaderProps) {
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();
  const utils = trpc.useUtils();
  const activatePoll = trpc.poll.activateItem.useMutation({
    onSuccess: () => {
      utils.poll.getAnalytics.invalidate({ slug });
      router.refresh();
    }
  });

  const handleActivate = () => {
    activatePoll.mutate({ pollId });
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${username}/${slug}`
      : `/p/${username}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      {/* Left: Title + Meta */}
      <div className="flex flex-col gap-4 max-w-2xl">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-pure-white border-2 border-ink-charcoal rounded-full px-4 py-1 w-max shadow-hard-sm"
        >
          {isLive && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          )}
          <span className="font-label-md text-label-md text-ink-charcoal uppercase tracking-widest">
            {isLive ? "Live Results" : "Poll Results"}
          </span>
        </motion.div>

        {/* Poll Question */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-headline-lg text-ink-charcoal leading-tight"
        >
          {question}
        </motion.h1>

        {/* Meta */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-body-md text-ink-charcoal/60 font-body"
        >
          {startedAt ? `Started ${startedAt}` : "Poll Analytics"}
        </motion.p>
      </div>

      {/* Right: QR + Share */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center gap-4 w-full md:w-auto flex-wrap md:flex-nowrap"
      >
        {status === "archived" && (
          <button
            onClick={handleActivate}
            disabled={activatePoll.isPending}
            className="flex-grow md:flex-grow-0 bg-leaf-green text-ink-charcoal border-2 border-ink-charcoal font-headline-sm text-headline-sm px-6 py-4 rounded-xl shadow-hard transition-all hover-lift flex justify-center items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {activatePoll.isPending ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} strokeWidth={3} />}
            Activate
          </button>
        )}
        {/* QR Code Toggle */}
        <button
          id="qr-toggle-btn"
          onClick={() => setShowQR((v) => !v)}
          className="bg-pure-white border-2 border-ink-charcoal rounded-xl p-3 shadow-hard hover:bg-canvas-cream transition-all hover-lift flex-shrink-0"
          title="Show QR Code"
        >
          <QrCode size={32} className="text-ink-charcoal" />
        </button>

        {/* Share Button */}
        <button
          id="share-result-btn"
          onClick={() => setShowShare((v) => !v)}
          className="flex-grow md:flex-grow-0 bg-electric-sun text-ink-charcoal border-2 border-ink-charcoal font-headline-sm text-headline-sm px-6 py-4 rounded-xl shadow-hard transition-all hover-lift flex justify-center items-center gap-2 whitespace-nowrap"
        >
          <Share2 size={20} />
          Share Result
        </button>
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-charcoal/50 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-canvas-cream border-4 border-ink-charcoal rounded-2xl p-8 shadow-hard-xl flex flex-col items-center gap-6 max-w-sm w-full mx-4"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="font-headline-sm text-headline-sm text-ink-charcoal">
                  Scan to Vote
                </h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-2 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-pure-white border-4 border-ink-charcoal p-4 rounded-xl shadow-hard">
                <QRCode
                  value={shareUrl}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#2C2E2A"
                  level="H"
                />
              </div>

              <div className="w-full bg-pure-white border-2 border-ink-charcoal rounded-xl px-4 py-3 flex items-center gap-2">
                <ExternalLink size={16} className="text-ink-charcoal/60 flex-shrink-0" />
                <span className="text-label-md text-ink-charcoal truncate flex-1 font-body">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-canvas-cream rounded transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <Check size={16} className="text-leaf-green" />
                  ) : (
                    <Copy size={16} className="text-ink-charcoal/60" />
                  )}
                </button>
              </div>

              <p className="text-label-sm text-ink-charcoal/50 text-center font-body">
                Share this QR code so others can participate in your poll
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Dropdown */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-charcoal/50 backdrop-blur-sm"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-canvas-cream border-4 border-ink-charcoal rounded-2xl p-8 shadow-hard-xl flex flex-col gap-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-headline-sm text-ink-charcoal">
                  Share Poll Link
                </h3>
                <button
                  onClick={() => setShowShare(false)}
                  className="p-2 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-label-md text-ink-charcoal/60 font-body uppercase tracking-wider">
                  Poll URL
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-pure-white border-2 border-ink-charcoal rounded-xl px-4 py-3 text-body-md font-body text-ink-charcoal truncate"
                  />
                  <button
                    id="copy-link-btn"
                    onClick={handleCopy}
                    className={`px-4 py-3 border-2 border-ink-charcoal rounded-xl font-label-md transition-all shadow-hard hover-lift flex items-center gap-2 ${
                      copied
                        ? "bg-leaf-green text-ink-charcoal"
                        : "bg-electric-sun text-ink-charcoal"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-ink-charcoal pt-4 flex flex-col gap-3">
                <p className="text-label-md text-ink-charcoal/60 font-body uppercase tracking-wider">
                  Or scan QR code
                </p>
                <div className="flex justify-center bg-pure-white border-2 border-ink-charcoal rounded-xl p-4">
                  <QRCode
                    value={shareUrl}
                    size={140}
                    bgColor="#FFFFFF"
                    fgColor="#2C2E2A"
                    level="H"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
