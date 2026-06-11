"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface TrendingCardProps {
  badge?: string;
  title: string;
  description?: string;
  voteCount: string;
  href?: string;
  bgColor?: string;
  id?: string;
  index?: number;
  className?: string;
}

export default function TrendingCard({
  badge,
  title,
  description,
  voteCount,
  href = "#",
  bgColor = "var(--color-leaf-green)",
  id,
  index = 0,
  className = "",
}: TrendingCardProps) {
  return (
    <motion.article
      id={id}
      className={`border-4 border-[var(--color-ink-charcoal)] rounded-2xl p-8 shadow-hard flex flex-col justify-between relative overflow-hidden group ${className}`}
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 14,
        delay: index * 0.1,
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow: "8px 8px 0px 0px var(--color-ink-charcoal)",
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
    >
      <div className="relative z-10">
        {badge && (
          <motion.span
            className="inline-block bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-3 py-1 rounded-full mb-4 font-bold shadow-hard-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {badge}
          </motion.span>
        )}
        <h3 className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)] leading-tight mb-4">
          {title}
        </h3>
        {description && (
          <p className="text-body-lg text-[var(--color-ink-charcoal)] mb-8 max-w-md font-semibold">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 relative z-10 mt-auto pt-6">
        <div className="flex items-center gap-2 text-[var(--color-ink-charcoal)] font-bold text-label-md">
          <span className="material-symbols-outlined filled" style={{ fontSize: "1.25rem" }}>groups</span>
          {voteCount} Votes
        </div>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95, x: 2, y: 2 }}
          className="self-start"
        >
          <Link
            href={href}
            id={id ? `${id}-vote-btn` : undefined}
            className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-4 border-[var(--color-ink-charcoal)] px-6 py-2.5 rounded-full text-label-lg font-display font-bold shadow-hard inline-block hover:brightness-110 transition-all"
          >
            Vote Now →
          </Link>
        </motion.div>
      </div>

      {/* Decorative corner circle — spins subtly on hover */}
      <motion.div
        className="absolute -bottom-10 -right-10 w-36 h-36 border-4 border-[var(--color-ink-charcoal)] rounded-full opacity-25"
        aria-hidden="true"
        whileHover={{ scale: 1.3, opacity: 0.45, rotate: 45 }}
        transition={{ duration: 0.4 }}
      />
    </motion.article>
  );
}
