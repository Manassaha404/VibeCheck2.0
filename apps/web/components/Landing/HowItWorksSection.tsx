"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "1",
    color: "var(--color-electric-sun)",
    title: "Build the Vibe",
    body: "Use our drag-and-drop neubrutalist builder to craft your campaign. No code, just pure aesthetic control.",
    x: "md:translate-x-0",
  },
  {
    num: "2",
    color: "var(--color-primary-container)",
    title: "Share the Link",
    body: "Distribute across our network of 60+ countries or embed directly into your own app or live venues.",
    x: "md:translate-x-8",
  },
  {
    num: "3",
    color: "var(--color-surface-variant)",
    title: "Watch it Pop",
    body: "See results roll in live with our high-contrast, visually satisfying analytics dashboards.",
    x: "md:translate-x-16",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = stepsRef.current?.querySelectorAll(".step-card");
    if (!cards) return;

    gsap.fromTo(cards,
      { x: -80, opacity: 0, scale: 0.9 },
      {
        x: 0, opacity: 1, scale: 1,
        stagger: 0.18,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none reset",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 px-4 md:px-10 bg-[var(--color-leaf-green)] border-y-4 border-[var(--color-ink-charcoal)] relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ── Left: Steps ── */}
          <div className="lg:w-1/2">
            <motion.h2
              id="how-it-works-heading"
              className="font-display font-black text-headline-lg md:text-display-lg text-[var(--color-ink-charcoal)] mb-12"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              How we <br />make it happen
            </motion.h2>

            <div ref={stepsRef} className="space-y-8 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-10 bottom-10 w-1 bg-[var(--color-ink-charcoal)] hidden md:block" />

              {steps.map((step) => (
                <motion.div
                  key={step.num}
                  className={`step-card flex gap-6 relative z-10 bg-[var(--color-pure-white)] p-6 rounded-xl border-2 border-[var(--color-ink-charcoal)] ${step.x}`}
                  style={{ boxShadow: "4px 4px 0px 0px var(--color-ink-charcoal)" }}
                  whileHover={{
                    x: 4, y: -2,
                    boxShadow: "6px 8px 0px 0px var(--color-ink-charcoal)",
                    transition: { type: "spring", stiffness: 400, damping: 20 },
                  }}
                >
                  <motion.div
                    className="w-12 h-12 shrink-0 border-2 border-[var(--color-ink-charcoal)] rounded-full flex items-center justify-center font-display font-black text-headline-sm"
                    style={{ backgroundColor: step.color }}
                    whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.4 } }}
                  >
                    {step.num}
                  </motion.div>
                  <div>
                    <h4 className="font-display font-black text-headline-sm mb-2">{step.title}</h4>
                    <p className="text-body-md">{step.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Floating UI Cards ── */}
          <div className="lg:w-1/2 relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square flex flex-col justify-center items-center">

              {/* Poll Question card */}
              <motion.div
                className="w-full bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl p-6 z-20"
                style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
                initial={{ rotate: -6, y: 30, opacity: 0 }}
                whileInView={{ rotate: -3, y: 0, opacity: 1 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
                  <span className="text-label-sm font-bold uppercase tracking-wider text-[var(--color-tertiary)]">
                    Live Poll
                  </span>
                </div>
                <h4 className="font-display font-black text-headline-sm mb-4">
                  What&apos;s the best remote work perk?
                </h4>
                <div className="space-y-3">
                  {["Flexible Hours", "No Commute"].map((opt) => (
                    <motion.div
                      key={opt}
                      className="w-full bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] rounded-lg p-3 flex justify-between items-center cursor-pointer"
                      whileHover={{ backgroundColor: "var(--color-electric-sun)", x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="text-label-md font-bold">{opt}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-[var(--color-ink-charcoal)] bg-[var(--color-pure-white)]" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Results card */}
              <motion.div
                className="w-5/6 bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] rounded-xl p-5 z-10 absolute bottom-0 right-0 translate-y-12 translate-x-4"
                style={{ boxShadow: "6px 6px 0px 0px var(--color-ink-charcoal)" }}
                initial={{ rotate: 8, y: 50, opacity: 0 }}
                whileInView={{ rotate: 6, y: 0, opacity: 1 }}
                whileHover={{ rotate: 2, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-label-sm font-bold uppercase tracking-wider text-[var(--color-ink-charcoal)]">Results</span>
                  <span className="text-label-sm font-bold bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-2 py-0.5 rounded-full">482 votes</span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-label-md font-bold text-sm">Flexible Hours</span>
                    <span className="text-label-md font-bold text-sm">62%</span>
                  </div>
                  <div className="w-full h-3 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--color-leaf-green)] border-r-2 border-[var(--color-ink-charcoal)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "62%" }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative accents */}
            <motion.span
              className="material-symbols-outlined absolute top-10 right-10 text-6xl text-[var(--color-pure-white)] select-none"
              aria-hidden="true"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              star
            </motion.span>
            <motion.span
              className="material-symbols-outlined absolute bottom-10 left-10 text-6xl text-[var(--color-ink-charcoal)] select-none"
              aria-hidden="true"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              favorite
            </motion.span>
          </div>

        </div>
      </div>
    </section>
  );
}
