import React from "react";
import { motion } from "framer-motion";

/* ─── Sub-components ──────────────────────────────────────────── */

function AnswerBar({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-label-md font-bold">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-4 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden">
        <motion.div
          className="h-full border-r-2 border-[var(--color-ink-charcoal)]"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
}

function WindowBar({ label }: { label: string }) {
  return (
    <div className="bg-[var(--color-ink-charcoal)] py-3 px-5 flex justify-between items-center flex-shrink-0">
      <span className="text-label-sm font-bold tracking-wider uppercase text-[var(--color-canvas-cream)]">
        {label}
      </span>
      <div className="flex gap-1.5" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--color-secondary-fixed)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--color-leaf-green)]" />
      </div>
    </div>
  );
}


export default function SeeItInActionSection() {
  return (
    <section
      id="see-it-in-action"
      className="py-24 px-4 md:px-10 bg-[var(--color-canvas-cream)] bg-dot-pattern border-b-4 border-[var(--color-ink-charcoal)] overflow-hidden"
      aria-labelledby="see-in-action-heading"
    >
      {/* Heading */}
      <motion.div 
        className="max-w-[1280px] mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2
          id="see-in-action-heading"
          className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)] inline-block border-b-8 border-[var(--color-electric-sun)] pb-2 mb-6"
        >
          See it in action
        </h2>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
          Stop squinting at boring spreadsheets. Our UI makes data consumption a
          tactile, visual experience.
        </p>
      </motion.div>

      {/* Cards — staggered entry, static tilt, hover straighten */}
      <div className="flex flex-col lg:flex-row gap-10 justify-center items-end max-w-5xl mx-auto">

        {/* ── Card 1: Live Poll Results — tilted left ── */}
        <motion.div
          className="flex-1 bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl overflow-hidden flex flex-col origin-bottom-right"
          initial={{ opacity: 0, y: 60, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 100, damping: 14 }}
          whileHover={{
            rotate: 0,
            y: -12,
            boxShadow: "8px 12px 0px 0px var(--color-ink-charcoal)",
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
          style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
        >
          <WindowBar label="Live Poll Results" />

          <div className="p-6 bg-[var(--color-canvas-cream)] flex-grow flex flex-col gap-6">
            {/* Header row */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-label-sm font-bold bg-[var(--color-ink-charcoal)] text-[var(--color-pure-white)] px-2 py-0.5 rounded uppercase">
                  Live Results
                </span>
                <h4 className="text-headline-sm font-display font-black mt-2">
                  What&apos;s the best remote work perk?
                </h4>
              </div>
              <motion.div 
                className="text-label-md font-bold shrink-0 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-3 py-1 rounded-full shadow-hard-sm whitespace-nowrap"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                482 votes
              </motion.div>
            </div>

            {/* Bars */}
            <div className="space-y-4">
              <AnswerBar label="Flexible Hours"    percent={84} color="var(--color-leaf-green)"        />
              <AnswerBar label="No Commute"         percent={62} color="var(--color-electric-sun)"      />
              <AnswerBar label="Home Office Budget" percent={45} color="var(--color-primary-container)" />
            </div>

          </div>
        </motion.div>

        {/* ── Card 2: Deep Analytics — tilted right ── */}
        <motion.div
          className="flex-1 bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-2xl overflow-hidden flex flex-col origin-bottom-left lg:-mt-10 lg:mb-10"
          initial={{ opacity: 0, y: 60, rotate: 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.15 }}
          whileHover={{
            rotate: 0,
            y: -12,
            boxShadow: "8px 12px 0px 0px var(--color-ink-charcoal)",
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
          style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
        >
          <WindowBar label="Deep Analytics" />

          <div className="p-6 bg-[var(--color-canvas-cream)] flex-grow flex flex-col gap-5">
            {/* Stats row */}
            <div className="flex justify-between items-center gap-4">
              <div className="bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] p-4 rounded-xl shadow-hard flex-1">
                <p className="text-label-sm font-bold uppercase mb-1">Total Responses</p>
                <p className="text-headline-md font-display font-black">1,287</p>
              </div>
              <div className="bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full shadow-hard text-label-md font-bold whitespace-nowrap">
                Engagement: 68%
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex flex-col flex-grow">
              <p className="text-label-sm font-bold uppercase mb-3">Vibes Over Time</p>
              <div className="flex-grow flex items-end gap-3 h-[120px] shrink-0">
                {[
                  { h: "40%", color: "#FF71D4" },
                  { h: "70%", color: "var(--color-electric-sun)" },
                  { h: "55%", color: "#21E6C1" },
                  { h: "90%", color: "var(--color-leaf-green)" },
                  { h: "78%", color: "var(--color-primary-container)" },
                ].map((bar, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 border-2 border-[var(--color-ink-charcoal)] rounded-t-lg"
                    style={{ backgroundColor: bar.color, transformOrigin: "bottom" }}
                    initial={{ height: "0%" }}
                    whileInView={{ height: bar.h }}
                    transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scaleY: 1.05 }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <span
                    key={d}
                    className="flex-1 text-center text-label-sm font-bold text-[var(--color-on-surface-variant)]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
