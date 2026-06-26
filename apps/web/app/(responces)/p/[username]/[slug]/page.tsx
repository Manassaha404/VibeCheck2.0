"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PollCard } from "@/components/public-poll/PollCard";
import { VoteSuccessCard } from "@/components/public-poll/VoteSuccessCard";
import { PublicComments } from "@/components/public-poll/PublicComments";
import { Loader2, Smile } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetPublicPoll } from "@/hook/poll/useGetPublicPoll";
import socket from "@/lib/socket";

export default function PublicPollPage() {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;

  const {
    data,
    isLoading,
    error,
    voted,
    selectedOptionId,
    isSubmitting,
    localResults,
    localTotalVotes,
    handleSubmitVote,
  } = useGetPublicPoll(username, slug);

  const pollId = data?.poll?.pollId;

  useEffect(() => {
    if (!pollId) return;

    socket.connect();
    socket.emit("join:poll", pollId);
    socket.emit("view:poll", pollId);
    
    return () => {
      socket.emit("leave:poll", pollId);
      socket.disconnect();
    };
  }, [pollId]);

  if (isLoading) {
    return (
      <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-leaf-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="font-display-lg text-headline-lg" style={{ color: "var(--color-error)" }}>
          Oops!
        </h1>
        <p className="font-body-lg">
          We couldn't find this poll. It may have been deleted or the link is incorrect.
        </p>
      </div>
    );
  }



  return (
    <div className="bg-canvas-cream text-ink-charcoal font-body-md min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #2C2E2A 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: 0.06,
        }}
      />

      <Navbar />

      <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop pt-28 md:pt-36 pb-20 relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!voted ? (
            /* ── Poll form ────────────────────────────────────── */
            <motion.div
              key="poll-form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-3xl w-full mx-auto relative"
            >
              {/* Decorative: Kapow sticker (top-left) */}
              <div className="absolute -top-12 -left-12 hidden md:block rotate-[-15deg] z-20">
                <div
                  className="bg-electric-sun border-4 border-ink-charcoal px-4 py-2 font-headline-sm text-headline-sm uppercase hard-shadow"
                  style={{ borderRadius: "50% 50% 50% 10% / 50% 50% 50% 10%" }}
                >
                  Kapow!
                </div>
              </div>

              {/* Decorative: Smile circle (bottom-left) */}
              <div className="absolute -bottom-12 -left-12 hidden md:block z-20">
                <div className="w-28 h-28 bg-leaf-green border-4 border-ink-charcoal rounded-full flex items-center justify-center hard-shadow animate-pulse">
                  <Smile size={56} strokeWidth={2.5} className="text-ink-charcoal" />
                </div>
              </div>

              <PollCard
                title={data.poll.title}
                description={data.poll.description}
                question={data.question?.text || data.poll.title}
                options={data.options || []}
                isCommentsAllowed={data.poll.isCommentsAllowed}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitVote}
              />
            </motion.div>
          ) : (
            /* ── Success / Results screen ─────────────────────── */
            <motion.div
              key="vote-success"
              initial={{ opacity: 0, scale: 0.92, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <VoteSuccessCard
                question={data.question?.text || data.poll.title}
                options={localResults}
                totalVotes={localTotalVotes}
                selectedOptionId={selectedOptionId}
              />
              
              {data.poll.isCommentsAllowed && (
                <PublicComments 
                  username={username}
                  slug={slug}
                  pollId={data.poll.pollId}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
