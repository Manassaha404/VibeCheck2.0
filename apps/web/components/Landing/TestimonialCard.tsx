"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  accentColor?: string;
  id?: string;
  index?: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  avatar = "😀",
  accentColor = "var(--color-leaf-green)",
  id,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.figure
      id={id}
      className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl p-8 shadow-hard flex flex-col gap-6 cursor-default"
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 14,
        delay: index * 0.12,
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -6,
        rotate: index % 2 === 0 ? -1 : 1,
        boxShadow: "8px 8px 0px 0px var(--color-ink-charcoal)",
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
    >
      {/* Quote mark */}
      <motion.span
        className="text-[4rem] font-display font-black leading-none"
        style={{ color: accentColor }}
        aria-hidden="true"
        initial={{ scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: index * 0.12 + 0.2 }}
        viewport={{ once: true }}
      >
        "
      </motion.span>

      <blockquote className="text-body-lg text-[var(--color-ink-charcoal)] font-semibold -mt-6 flex-1">
        {quote}
      </blockquote>

      <figcaption className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-[var(--color-ink-charcoal)] flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
          whileHover={{ scale: 1.15, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {avatar}
        </motion.div>
        <div>
          <p className="text-label-md font-bold text-[var(--color-ink-charcoal)]">{author}</p>
          <p className="text-label-sm text-[var(--color-on-surface-variant)]">{role}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
