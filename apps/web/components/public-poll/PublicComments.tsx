"use client";

import React from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicPollComments } from "@/hook/poll/usePublicPollComments";
import { cn } from "@/lib/utils";

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
      <div className="mt-16 w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-12 bg-canvas-cream border-[4px] border-ink-charcoal shadow-hard-xl rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="bg-vivid-coral p-5 border-[4px] border-ink-charcoal shadow-hard rounded-full mb-6 rotate-[-10deg] animate-float-slow relative z-10">
          <MessageSquare size={36} strokeWidth={3} className="text-ink-charcoal" />
        </div>
        <h4 className="text-headline-lg text-ink-charcoal mb-4 relative z-10 text-center">It's quiet... too quiet</h4>
        <p className="text-center text-ink-charcoal text-body-lg relative z-10 max-w-md font-bold">
          No comments yet. Be the first to vibe check and leave your mark!
        </p>
      </div>
    );
  }

  const colors = ["bg-electric-sun", "bg-vivid-coral", "bg-leaf-green", "bg-sky-blue", "bg-lavender", "bg-mint", "bg-tangerine"];

  return (
    <div className="mt-20 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-12 pb-6 border-b-[4px] border-ink-charcoal relative">
        <div className="bg-electric-sun p-4 border-[4px] border-ink-charcoal shadow-hard rounded-full relative overflow-hidden group hover:animate-wiggle cursor-default">
          <MessageSquare size={32} strokeWidth={3} className="text-ink-charcoal relative z-10 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-vivid-coral translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </div>
        <h3 className="text-headline-lg text-ink-charcoal tracking-wide">
          Vibers Say...
        </h3>
        <div className="ml-auto bg-pure-white border-[4px] border-ink-charcoal px-5 py-2 text-headline-sm text-ink-charcoal rounded-2xl shadow-hard">
          {comments.length}
        </div>
      </div>

      <div className="flex flex-col gap-10 pl-6 sm:pl-16">
        <AnimatePresence>
          {comments.map((comment, i) => {
            const isEven = i % 2 === 0;
            const colorClass = colors[i % colors.length];
            const initialLetter = comment.username.replace("@", "").charAt(0).toUpperCase();

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className="relative group w-full"
              >
                {/* Avatar */}
                <div className={cn(
                  "absolute -left-14 sm:-left-20 top-0 sm:top-2 w-14 h-14 flex items-center justify-center text-headline-sm border-[4px] border-ink-charcoal rounded-full shadow-hard z-20 transition-transform group-hover:scale-110 group-hover:-rotate-12",
                  colorClass
                )}>
                    {initialLetter}
                </div>

                {/* Chat Bubble Tail */}
                <div className="absolute -left-5 top-5 w-8 h-8 bg-pure-white border-l-[4px] border-b-[4px] border-ink-charcoal rotate-45 z-10 group-hover:bg-canvas-cream transition-colors duration-200" />

                {/* Comment Card */}
                <div
                  className="bg-pure-white border-[4px] border-ink-charcoal p-6 sm:p-8 shadow-hard relative z-10 hover-lift transition-all group-hover:bg-canvas-cream"
                  style={{
                    borderRadius: isEven ? "24px 32px 32px 32px" : "32px 24px 32px 32px",
                  }}
                >
                  <div className="flex justify-between items-baseline mb-4 border-b-[3px] border-ink-charcoal pb-3">
                    <span className="text-headline-sm uppercase font-black text-ink-charcoal">
                      {comment.username}
                    </span>
                    <span className="text-label-sm text-ink-charcoal bg-electric-sun border-[3px] border-ink-charcoal px-3 py-1 rounded-full shadow-hard-sm transform rotate-2 group-hover:rotate-0 transition-transform">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="text-body-lg text-ink-charcoal leading-relaxed whitespace-pre-wrap break-words">
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
