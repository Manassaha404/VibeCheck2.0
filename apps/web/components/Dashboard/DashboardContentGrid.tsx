"use client";

import React, { useState, useRef } from "react";
import { DashboardContentCard } from "./DashboardContentCard";
import type { DashboardItem } from "./DashboardContentCard";
import { Plus, ArrowRight, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type FilterTab = "all" | "poll" | "form" | "petition" | "archived";

interface DashboardContentGridProps {
  items: DashboardItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
}

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "poll", label: "Polls" },
  { key: "form", label: "Forms" },
  { key: "petition", label: "Petitions" },
  { key: "archived", label: "Archived" },
];

/** Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="bg-[var(--color-pure-white)] border-2 border-[var(--color-outline-variant)] rounded-xl p-5 flex flex-col gap-4 animate-pulse h-[260px]">
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-md bg-[var(--color-surface-container-high)]" />
        <div className="h-6 w-14 rounded-md bg-[var(--color-surface-container-high)]" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-3/4 rounded bg-[var(--color-surface-container-high)]" />
        <div className="h-4 w-full rounded bg-[var(--color-surface-container)]" />
      </div>
      <div className="h-px bg-[var(--color-outline-variant)] mt-auto" />
      <div className="flex justify-between">
        <div className="h-4 w-28 rounded bg-[var(--color-surface-container)]" />
        <div className="h-4 w-10 rounded bg-[var(--color-surface-container)]" />
      </div>
    </div>
  );
}

export function DashboardContentGrid({
  items,
  isLoading = false,
  isError = false,
  onRefresh,
}: DashboardContentGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".gsap-stagger-item", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: sectionRef });

  const filtered = items.filter((item) => {
    let matchesFilter = false;
    if (activeFilter === "all") {
      matchesFilter = true;
    } else if (activeFilter === "archived") {
      matchesFilter = item.status === "archived";
    } else {
      matchesFilter = item.type === activeFilter;
    }

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section ref={sectionRef} aria-labelledby="content-grid-heading">
      {/* Section title + header actions */}
      <div className="gsap-stagger-item flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <h2
          id="content-grid-heading"
          className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)]"
        >
          Your Content
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]"
            />
            <input
              id="content-search"
              type="search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-label-md border-2 border-[var(--color-ink-charcoal)] rounded-lg bg-[var(--color-pure-white)] focus:outline-none focus:border-[var(--color-primary)] w-44"
            />
          </div>

          {/* Refresh */}
          {onRefresh && (
            <button
              id="content-refresh"
              onClick={onRefresh}
              aria-label="Refresh content"
              className="p-2 border-2 border-[var(--color-ink-charcoal)] rounded-lg hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <RefreshCw size={15} className="text-[var(--color-ink-charcoal)]" />
            </button>
          )}

          {/* See all */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-[var(--color-primary)] hover:underline"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="gsap-stagger-item flex gap-2 mb-5 flex-wrap" role="tablist" aria-label="Content type filter">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              id={`filter-tab-${tab.key}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab.key)}
              className={`relative px-4 py-2 rounded-lg border-2 text-label-md font-bold transition-colors btn-press overflow-hidden ${
                isActive
                  ? "text-[var(--color-pure-white)] border-[var(--color-ink-charcoal)]"
                  : "bg-[var(--color-pure-white)] text-[var(--color-ink-charcoal)] border-[var(--color-ink-charcoal)] hover:bg-[var(--color-surface-container)]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-bg"
                  className="absolute inset-0 bg-[var(--color-ink-charcoal)]"
                  style={{ zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[var(--color-vivid-coral)] rounded-xl bg-[var(--color-error-container)] bg-opacity-20">
          <p className="text-headline-sm font-display text-[var(--color-error)]">
            Failed to load content
          </p>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-2 mb-4">
            There was a problem fetching your data.
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 bg-[var(--color-vivid-coral)] text-white border-2 border-[var(--color-ink-charcoal)] px-5 py-2.5 font-bold rounded-lg shadow-hard btn-press"
            >
              <RefreshCw size={16} /> Try again
            </button>
          )}
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[var(--color-outline-variant)] rounded-xl">
          <p className="text-headline-sm font-display text-[var(--color-on-surface-variant)]">
            {items.length === 0 ? "Nothing here yet" : "No results match your filter"}
          </p>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-2 mb-6">
            {items.length === 0
              ? "Create your first piece of content to get started."
              : "Try adjusting your search or filter."}
          </p>
          {items.length === 0 && (
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-5 py-2.5 font-bold rounded-lg shadow-hard btn-press"
            >
              <Plus size={18} />
              Create Now
            </Link>
          )}
        </div>
      )}

      {/* Real content grid */}
      {!isLoading && !isError && filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 gsap-stagger-item"
          role="tabpanel"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              >
                <DashboardContentCard item={item} onActionSuccess={onRefresh} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
