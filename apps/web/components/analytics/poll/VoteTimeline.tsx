"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Activity } from "lucide-react";

interface VoteTimelineEntry {
  time: string;
  votes: number;
  cumulative: number;
}

interface VoteTimelineProps {
  data: VoteTimelineEntry[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-pure-white border-2 border-ink-charcoal rounded-xl px-4 py-3 shadow-hard">
        <p className="text-label-md text-ink-charcoal/60 font-body">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-headline-sm text-ink-charcoal">
            {p.value}{" "}
            <span className="text-label-md text-ink-charcoal/60 font-body">
              {p.name === "votes" ? "new votes" : "total votes"}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function VoteTimeline({ data }: VoteTimelineProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-pure-white border-2 border-ink-charcoal rounded-xl p-6 md:p-10 shadow-hard-lg flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className="bg-electric-sun border-2 border-ink-charcoal rounded-lg p-2 shadow-hard-sm">
          <Activity size={20} className="text-ink-charcoal" />
        </div>
        <h2 className="font-headline-md text-headline-md text-ink-charcoal">
          Vote Activity Over Time
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8ED462" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8ED462" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5E211" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F5E211" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C2E2A" strokeOpacity={0.1} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="votes"
            stroke="#8ED462"
            strokeWidth={3}
            fill="url(#voteGradient)"
            dot={{ fill: "#8ED462", stroke: "#2C2E2A", strokeWidth: 2, r: 4 }}
            activeDot={{ fill: "#8ED462", stroke: "#2C2E2A", strokeWidth: 2, r: 6 }}
            name="votes"
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#F5E211"
            strokeWidth={3}
            strokeDasharray="6 3"
            fill="url(#cumulativeGradient)"
            dot={{ fill: "#F5E211", stroke: "#2C2E2A", strokeWidth: 2, r: 4 }}
            name="cumulative"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-leaf-green rounded" />
          <span className="text-label-md text-ink-charcoal/70 font-body">New votes per interval</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-electric-sun rounded" style={{ borderTop: "2px dashed" }} />
          <span className="text-label-md text-ink-charcoal/70 font-body">Cumulative total</span>
        </div>
      </div>
    </motion.section>
  );
}
