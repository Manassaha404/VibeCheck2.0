"use client";

import React from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicPollComments } from "@/hook/poll/usePublicPollComments";

interface PublicCommentsProps {
  username: string;
  slug: string;
  pollId: string;
}

export function PublicComments({ username, slug, pollId }: PublicCommentsProps) {
  const { comments, isLoading } = usePublicPollComments({ username, slug, pollId });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-leaf-green" />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-16 w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-12 bg-canvas-cream border-4 border-dashed border-ink-charcoal/30 rounded-3xl">
        <div className="bg-candy-pink p-4 border-4 border-ink-charcoal hard-shadow-sm rounded-full mb-6 rotate-[-10deg]">
          <MessageSquare size={32} strokeWidth={2.5} className="text-ink-charcoal" />
        </div>
        <h4 className="font-display-sm text-2xl text-ink-charcoal mb-2">It's quiet... too quiet</h4>
        <p className="text-center text-ink-charcoal/70 font-body-lg">
          No comments yet. Be the first to vibe check and leave your mark!
        </p>
      </div>
    );
  }

  const colors = ["bg-electric-sun", "bg-candy-pink", "bg-leaf-green", "bg-sky-blue", "bg-lavender"];

  return (
    <div className="mt-20 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-10 pb-4 border-b-4 border-ink-charcoal">
        <div className="bg-electric-sun p-3 border-4 border-ink-charcoal shadow-hard rounded-full relative overflow-hidden">
          <MessageSquare size={28} strokeWidth={2.5} className="text-ink-charcoal relative z-10" />
          <div className="absolute inset-0 bg-candy-pink translate-y-full hover:translate-y-0 transition-transform duration-300" />
        </div>
        <h3 className="font-display-lg text-4xl uppercase text-ink-charcoal tracking-wide">
          Vibers Say...
        </h3>
        <div className="ml-auto bg-pure-white border-4 border-ink-charcoal px-4 py-1 font-headline-sm text-ink-charcoal rounded-full hard-shadow-sm">
          {comments.length}
        </div>
      </div>

      <div className="flex flex-col gap-8 pl-4 sm:pl-12">
        <AnimatePresence>
          {comments.map((comment, i) => {
            const isEven = i % 2 === 0;
            const colorClass = colors[i % colors.length];
            const initialLetter = comment.username.replace("@", "").charAt(0).toUpperCase();

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: isEven ? -30 : 30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                className="relative group w-full"
              >
                {/* Avatar */}
                <div className="absolute -left-12 sm:-left-16 top-0 sm:top-2 w-12 h-12 flex items-center justify-center font-display-sm text-2xl border-4 border-ink-charcoal rounded-full hard-shadow-sm z-20 transition-transform group-hover:scale-110 group-hover:rotate-12"
                     style={{ backgroundColor: `var(--color-${colorClass?.replace("bg-", "")}, #FF5E5B)` }}>
                  <span className={`${colorClass} w-full h-full rounded-full flex items-center justify-center`}>
                    {initialLetter}
                  </span>
                </div>

                {/* Chat Bubble Tail */}
                <div className="absolute -left-4 top-4 w-6 h-6 bg-pure-white border-l-4 border-b-4 border-ink-charcoal rotate-45 z-10" />

                {/* Comment Card */}
                <div
                  className="bg-pure-white border-4 border-ink-charcoal p-6 hard-shadow relative z-10 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#2C2E2A] transition-all"
                  style={{
                    borderRadius: isEven ? "16px 24px 24px 24px" : "24px 16px 24px 24px",
                  }}
                >
                  <div className="flex justify-between items-baseline mb-3 border-b-2 border-ink-charcoal/10 pb-2">
                    <span className="font-display-sm text-lg sm:text-xl uppercase font-black text-ink-charcoal">
                      {comment.username}
                    </span>
                    <span className="font-body-md text-ink-charcoal/50 text-sm font-bold bg-canvas-cream px-3 py-1 rounded-full">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="font-body-lg text-ink-charcoal leading-relaxed whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
