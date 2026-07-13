"use client";

import React, { useRef, useEffect } from "react";
import {
  TrendingUp,
  BarChart2,
  ClipboardList,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";

export type ExploreTab = "trending" | "join-quiz" | "polls" | "petitions";

interface ExploreSidebarProps {
  activeTab: ExploreTab;
  setActiveTab: (tab: ExploreTab) => void;
}

const TABS = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "join-quiz", label: "Join Quiz", icon: Gamepad2 },
  { id: "polls", label: "Polls", icon: BarChart2 },
  { id: "petitions", label: "Petitions", icon: ClipboardList },
] as const;

function SidebarItem({
  tab,
  isActive,
  onClick,
}: {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const icon = iconRef.current;
    if (!container || !icon) return;

    // GSAP Magnetic effect for the icon on hover
    const xTo = gsap.quickTo(icon, "x", {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(icon, "y", {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Magnetic pull only affects the icon subtly
      const x = (clientX - centerX) * 0.15;
      const y = (clientY - centerY) * 0.15;

      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.button
      ref={containerRef}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left overflow-hidden group ${
        isActive
          ? "text-[var(--color-ink-charcoal)] font-bold shadow-hard-sm"
          : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] border-2 border-transparent"
      }`}
      whileHover={{ scale: isActive ? 1 : 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Framer motion layoutId for sliding background on active tab */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] rounded-xl"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ zIndex: 0 }}
        />
      )}

      <div
        ref={iconRef}
        className={`relative z-10 flex items-center justify-center p-1.5 rounded-md transition-colors duration-300 ${
          isActive
            ? "bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] shadow-[2px_2px_0_0_var(--color-ink-charcoal)]"
            : "group-hover:bg-[var(--color-pure-white)] group-hover:border-2 group-hover:border-[var(--color-ink-charcoal)] group-hover:shadow-[2px_2px_0_0_var(--color-ink-charcoal)]"
        }`}
      >
        <tab.icon
          size={18}
          strokeWidth={2.5}
          className={
            isActive
              ? "text-[var(--color-ink-charcoal)]"
              : "text-[var(--color-outline)] group-hover:text-[var(--color-ink-charcoal)]"
          }
        />
      </div>

      <span
        className={`text-label-md relative z-10 tracking-wide ${isActive ? "font-black" : "font-semibold"}`}
      >
        {tab.label}
      </span>
    </motion.button>
  );
}

export default function ExploreSidebar({
  activeTab,
  setActiveTab,
}: ExploreSidebarProps) {
  return (
    <aside className="bg-[var(--color-pure-white)] h-[calc(100vh-76px)] w-72 border-r-4 border-[var(--color-ink-charcoal)] hidden lg:flex flex-col p-5 gap-4 sticky top-[76px] z-10 shadow-[8px_0_0_0_rgba(0,0,0,0.05)]">
      <motion.div
        className="flex flex-col gap-3 flex-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          className="mb-4 px-2 flex items-center gap-2"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { type: "spring", stiffness: 300 },
            },
          }}
        >
          <div className="w-2 h-6 bg-[var(--color-electric-sun)] rounded-full border-2 border-[var(--color-ink-charcoal)]"></div>
          <h2 className="text-sm font-display font-black text-[var(--color-ink-charcoal)] uppercase tracking-widest">
            Discover
          </h2>
        </motion.div>

        {TABS.map((tab) => (
          <motion.div
            key={tab.id}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              },
            }}
          >
            <SidebarItem
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as ExploreTab)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Playful "For You" Card at bottom */}
      <motion.div
        className="mt-auto pt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
      >
        <div className="relative bg-[var(--color-sky-blue)] rounded-2xl p-4 border-4 border-[var(--color-ink-charcoal)] shadow-hard group overflow-hidden">
          {/* Decorative background dot pattern */}
          <div className="absolute inset-0 opacity-20 bg-dot-pattern mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-[var(--color-pure-white)] w-max px-3 py-1.5 rounded-full border-2 border-[var(--color-ink-charcoal)] shadow-[2px_2px_0_0_var(--color-ink-charcoal)]">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles
                  size={16}
                  className="text-[var(--color-electric-sun)]"
                />
              </motion.div>
              <span className="text-xs font-black font-display tracking-wide uppercase text-[var(--color-ink-charcoal)]">
                Tailored
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-ink-charcoal)] leading-tight mt-1">
              Your feed personalizes to your vibe!
            </p>
          </div>

          {/* Hover highlight sweep */}
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ mixBlendMode: "overlay" }}
          />
        </div>
      </motion.div>
    </aside>
  );
}
