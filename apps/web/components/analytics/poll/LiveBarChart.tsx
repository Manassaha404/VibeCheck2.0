"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefreshCw, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface LiveBarChartProps {
  options: PollOption[];
  lastUpdated?: string;
}

const CHART_COLORS = [
  "#F5E211", // electric-sun
  "#8ED462", // leaf-green
  "#dadad4", // surface-dim
  "#adf67f", // primary-fixed
  "#FF9548", // tangerine
  "#C084FC", // lavender
];

// Custom Bar Chart Bars (neubrutalist style)
function BarRow({
  option,
  index,
  maxVotes,
}: {
  option: PollOption;
  index: number;
  maxVotes: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width: `${option.percentage}%`,
        duration: 1.5,
        delay: index * 0.15,
        ease: "power3.out",
      }
    );
  }, [option.percentage]);

  const bgColors = [
    "bg-electric-sun",
    "bg-leaf-green",
    "bg-[#dadad4]",
    "bg-[#adf67f]",
    "bg-tangerine",
    "bg-lavender",
  ];
  const bg = bgColors[index % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col gap-2"
    >
      <div className="flex justify-between items-end mb-1">
        <span className="font-headline-sm text-headline-sm text-ink-charcoal line-clamp-1">
          {option.text}
        </span>
        <span className="font-headline-sm text-headline-sm text-ink-charcoal font-black ml-4 flex-shrink-0">
          {option.percentage}%
        </span>
      </div>
      <div className="h-12 w-full bg-canvas-cream border-2 border-ink-charcoal rounded-full overflow-hidden">
        <div
          ref={barRef}
          className={`h-full ${bg} border-r-2 border-ink-charcoal flex items-center justify-end pr-4`}
          style={{ width: "0%" }}
        >
          <span className="text-label-sm text-ink-charcoal hidden md:block font-body font-bold">
            {option.votes.toLocaleString()} votes
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Custom tooltip for recharts
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
        <p className="font-label-md text-ink-charcoal font-semibold">{label}</p>
        <p className="font-headline-sm text-ink-charcoal">
          {payload[0]?.value ?? 0}% &nbsp;
          <span className="text-label-md text-ink-charcoal/60">of votes</span>
        </p>
      </div>
    );
  }
  return null;
};

export function LiveBarChart({ options, lastUpdated = "Just now" }: LiveBarChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [updatedAt, setUpdatedAt] = useState(lastUpdated);

  const maxVotes = Math.max(...options.map((o) => o.votes));

  // Recharts data format
  const rechartsData = options.map((opt, i) => ({
    name: opt.text.length > 16 ? opt.text.slice(0, 16) + "…" : opt.text,
    fullName: opt.text,
    value: opt.percentage,
    votes: opt.votes,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <section className="bg-pure-white border-2 border-ink-charcoal rounded-xl p-6 md:p-10 shadow-hard-lg flex flex-col gap-8 relative">
      {/* Chart type toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          id="bar-chart-btn"
          onClick={() => setChartType("bar")}
          className={`p-2 border-2 border-ink-charcoal rounded-lg transition-all ${
            chartType === "bar"
              ? "bg-electric-sun shadow-hard-sm"
              : "bg-canvas-cream hover:bg-electric-sun/50"
          }`}
          title="Bar Chart"
        >
          <BarChart2 size={20} className="text-ink-charcoal" />
        </button>
        <button
          id="pie-chart-btn"
          onClick={() => setChartType("pie")}
          className={`p-2 border-2 border-ink-charcoal rounded-lg transition-all ${
            chartType === "pie"
              ? "bg-electric-sun shadow-hard-sm"
              : "bg-pure-white hover:bg-electric-sun/50"
          }`}
          title="Pie Chart"
        >
          <PieChartIcon size={20} className="text-ink-charcoal" />
        </button>
      </div>

      <h2 className="font-headline-md text-headline-md text-ink-charcoal">
        Live Standings
      </h2>

      <AnimatePresence mode="wait">
        {chartType === "bar" ? (
          /* ── Neubrutalist Bar Rows ── */
          <motion.div
            key="bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
            id="chart-container"
          >
            {options.map((option, i) => (
              <BarRow key={option.id} option={option} index={i} maxVotes={maxVotes} />
            ))}

            {/* Recharts horizontal bar underneath */}
            <div className="mt-4 pt-4 border-t-2 border-dashed border-ink-charcoal/30">
              <p className="text-label-sm text-ink-charcoal/50 font-body mb-3 uppercase tracking-wider">
                Vote Distribution
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={rechartsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "Hanken Grotesk", fill: "#2C2E2A" }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {rechartsData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} stroke="#2C2E2A" strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          /* ── Recharts Pie Chart ── */
          <motion.div
            key="pie"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
            className="flex flex-col items-center gap-4"
          >
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={rechartsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {rechartsData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.fill}
                      stroke="#2C2E2A"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0]?.payload as { fullName: string; value: number; votes: number } | undefined;
                      if (!d) return null;
                      return (
                        <div className="bg-pure-white border-2 border-ink-charcoal rounded-xl px-4 py-3 shadow-hard">
                          <p className="font-label-md text-ink-charcoal font-semibold">
                            {d.fullName}
                          </p>
                          <p className="font-headline-sm text-ink-charcoal">
                            {d.value}%
                          </p>
                          <p className="text-label-sm text-ink-charcoal/60 font-body">
                            {d.votes.toLocaleString()} votes
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        fontFamily: "Hanken Grotesk",
                        fontSize: "13px",
                        color: "#2C2E2A",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="pt-4 border-t-2 border-ink-charcoal border-dashed flex justify-between items-center text-ink-charcoal/60 text-label-md font-body">
        <span>
          Last updated:{" "}
          <span id="time-updated" className="font-semibold text-ink-charcoal">
            {updatedAt}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <RefreshCw size={14} className="animate-spin" />
          Auto-refreshing
        </span>
      </div>
    </section>
  );
}
