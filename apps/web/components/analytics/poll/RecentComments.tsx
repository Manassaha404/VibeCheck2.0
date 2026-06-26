"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export interface Comment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
  avatarColor?: string;
}

const AVATAR_COLORS = [
  "bg-electric-sun",
  "bg-leaf-green",
  "bg-[#adf67f]",
  "bg-sky-blue",
  "bg-lavender",
  "bg-tangerine",
];

interface RecentCommentsProps {
  comments: Comment[];
}

function CommentAvatar({ username, color }: { username: string; color: string }) {
  const initial = username.replace("@", "").charAt(0).toUpperCase();
  return (
    <div
      className={`w-12 h-12 rounded-full ${color} border-2 border-ink-charcoal flex-shrink-0 flex items-center justify-center`}
    >
      <span className="font-headline-sm text-ink-charcoal text-lg font-black">{initial}</span>
    </div>
  );
}

export function RecentComments({ comments }: RecentCommentsProps) {
  if (!comments.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-pure-white border-2 border-ink-charcoal rounded-xl p-6 md:p-10 shadow-hard-lg flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className="bg-leaf-green border-2 border-ink-charcoal rounded-lg p-2 shadow-hard-sm">
          <MessageCircle size={20} className="text-ink-charcoal" />
        </div>
        <h2 className="font-headline-md text-headline-md text-ink-charcoal">
          Recent Comments
        </h2>
        <span className="ml-auto bg-canvas-cream border-2 border-ink-charcoal rounded-full px-3 py-0.5 text-label-sm text-ink-charcoal font-body font-bold">
          {comments.length}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {comments.map((comment, i) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.3, duration: 0.4 }}
            className="flex gap-4 group"
          >
            <CommentAvatar
              username={comment.username}
              color={comment.avatarColor ?? (AVATAR_COLORS[i % AVATAR_COLORS.length] ?? "bg-electric-sun")}
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-label-md text-ink-charcoal font-semibold font-body">
                  {comment.username}
                </span>
                <span className="text-label-sm text-ink-charcoal/50 font-body">
                  {comment.timeAgo}
                </span>
              </div>
              <p className="text-body-md text-ink-charcoal font-body leading-relaxed">
                {comment.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
