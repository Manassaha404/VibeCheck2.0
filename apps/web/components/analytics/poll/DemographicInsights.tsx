"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Radar as RadarIcon } from "lucide-react";

interface DemographicEntry {
  label: string;
  value: number;
}

interface DemographicInsightsProps {
  data: DemographicEntry[];
}

export function DemographicInsights({ data }: DemographicInsightsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-pure-white border-2 border-ink-charcoal rounded-xl p-6 md:p-10 shadow-hard-lg flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className="bg-lavender border-2 border-ink-charcoal rounded-lg p-2 shadow-hard-sm">
          <RadarIcon size={20} className="text-ink-charcoal" />
        </div>
        <h2 className="font-headline-md text-headline-md text-ink-charcoal">
          Response Spread
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#2C2E2A" strokeOpacity={0.15} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 12, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
          />
          <PolarRadiusAxis
            tick={{ fontSize: 10, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
            axisLine={false}
          />
          <Radar
            name="Votes"
            dataKey="value"
            stroke="#2e6c00"
            fill="#8ED462"
            fillOpacity={0.45}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [typeof value === "number" ? `${value}%` : value, "Share"]}
            contentStyle={{
              background: "#FFFFFF",
              border: "2px solid #2C2E2A",
              borderRadius: "12px",
              fontFamily: "Hanken Grotesk",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.section>
  );
}
