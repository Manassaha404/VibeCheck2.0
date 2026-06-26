"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Trophy } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "white" | "green" | "yellow";
  index?: number;
}

function StatCard({ label, value, icon, accent = "white", index = 0 }: StatCardProps) {
  const bgMap = {
    white: "bg-pure-white",
    green: "bg-leaf-green",
    yellow: "bg-electric-sun",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        damping: 20,
        stiffness: 200,
      }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={`${bgMap[accent]} border-2 border-ink-charcoal rounded-xl p-6 shadow-hard flex flex-col justify-between h-48 relative overflow-hidden`}
    >
      <span className="text-label-md text-ink-charcoal/70 uppercase tracking-wider font-body font-semibold">
        {label}
      </span>
      <div className="flex items-end justify-between">
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", damping: 15 }}
          className="font-display text-display-lg leading-none text-ink-charcoal"
        >
          {value}
        </motion.span>
        <span className="text-ink-charcoal/80">{icon}</span>
      </div>
    </motion.div>
  );
}

interface AnalyticsStatsProps {
  totalVotes: number;
  engagementRate: number;
  topAnswer: string;
}

export function AnalyticsStats({
  totalVotes,
  engagementRate,
  topAnswer,
}: AnalyticsStatsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Total Votes"
        value={totalVotes.toLocaleString()}
        icon={<Users size={40} />}
        accent="white"
        index={0}
      />
      <StatCard
        label="Engagement Rate"
        value={`${engagementRate}%`}
        icon={<TrendingUp size={40} />}
        accent="yellow"
        index={1}
      />
      {/* Top Answer Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          damping: 20,
          stiffness: 200,
        }}
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
        className="bg-leaf-green border-2 border-ink-charcoal rounded-xl p-6 shadow-hard flex flex-col justify-between h-48 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <span className="text-label-md text-ink-charcoal uppercase tracking-wider font-body font-semibold">
            Top Answer
          </span>
          <span className="font-display text-headline-md text-ink-charcoal leading-tight line-clamp-2">
            &ldquo;{topAnswer}&rdquo;
          </span>
        </div>
        <Trophy
          size={120}
          className="absolute -bottom-6 -right-6 text-ink-charcoal opacity-10"
          strokeWidth={1.5}
        />
      </motion.div>
    </section>
  );
}
