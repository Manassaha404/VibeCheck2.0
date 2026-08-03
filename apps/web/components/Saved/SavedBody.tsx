"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSaved, SavedFilterType } from "@/hook/saved/useSaved";
import { SavedItemCard } from "./SavedItemCard";
import { BookmarkIcon, Loader2Icon } from "lucide-react";

const FILTERS: { label: string; value: SavedFilterType }[] = [
  { label: "All Items", value: "ALL" },
  { label: "Polls", value: "POLLS" },
  { label: "Forms", value: "FORMS" },
  { label: "Petitions", value: "PETITIONS" },
];

export const SavedBody = () => {
  const { savedItems, isLoading, error, filter, setFilter } = useSaved();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6"
      >
        <div>
          <h1
            className="text-display-lg font-black uppercase text-ink-charcoal tracking-tight flex items-center justify-center sm:justify-start gap-4"
            style={{
              WebkitTextStroke: "2px #2C2E2A",
              textShadow: "4px 4px 0px #2C2E2A",
              color: "var(--color-pure-white)",
            }}
          >
            <div className="bg-electric-sun p-2 border-[3px] border-ink-charcoal shadow-hard rotate-[-4deg]">
              <BookmarkIcon className="w-8 h-8 md:w-10 md:h-10 text-ink-charcoal fill-ink-charcoal" />
            </div>
            Saved Items
          </h1>
          <p className="mt-6 text-headline-sm font-body font-bold text-ink-charcoal/80 max-w-2xl bg-canvas-cream border-[3px] border-ink-charcoal p-4 shadow-hard-sm">
            Keep track of all the polls, forms, and petitions you've saved for
            later.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12 flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar"
      >
        <div className="flex space-x-4 p-2 bg-canvas-cream border-[3px] border-ink-charcoal shadow-hard-sm">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`relative px-6 py-3 font-display font-black uppercase tracking-wider text-sm md:text-base border-[3px] border-ink-charcoal transition-all whitespace-nowrap btn-press ${
                filter === f.value
                  ? "bg-electric-sun text-ink-charcoal shadow-hard"
                  : "bg-pure-white text-ink-charcoal hover:bg-candy-pink hover:shadow-hard-sm"
              }`}
            >
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <Loader2Icon
              className="w-12 h-12 text-ink-charcoal animate-spin mb-6"
              strokeWidth={3}
            />
            <p className="font-display font-black uppercase text-xl text-ink-charcoal tracking-widest animate-pulse">
              Loading Vibes...
            </p>
          </div>
        ) : error ? (
          <div className="text-center pt-20">
            <p className="text-vivid-coral font-display font-black uppercase text-2xl border-4 border-ink-charcoal bg-pure-white inline-block px-8 py-4 shadow-hard rotate-2">
              Failed to load saved items.
            </p>
            <p className="text-lg text-ink-charcoal mt-4 font-body font-bold">
              {error.message}
            </p>
          </div>
        ) : savedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center pt-20 bg-pure-white border-[4px] border-ink-charcoal p-12 shadow-hard-lg max-w-2xl mx-auto rotate-[-1deg]"
          >
            <div className="w-24 h-24 bg-canvas-cream border-[3px] border-ink-charcoal shadow-hard flex items-center justify-center mx-auto mb-8 rotate-12">
              <BookmarkIcon
                className="w-10 h-10 text-ink-charcoal"
                strokeWidth={2.5}
              />
            </div>
            <h3 className="text-3xl font-display font-black uppercase text-ink-charcoal mb-4">
              Nothing Here Yet!
            </h3>
            <p className="text-ink-charcoal font-body font-bold text-lg max-w-sm mx-auto">
              You haven't saved any{" "}
              {filter !== "ALL" ? filter.toLowerCase() : "items"} yet. Go
              explore the wild and smash that save button!
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {savedItems.map((item, index) => (
                <motion.div
                  key={item.saves.saveId}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <SavedItemCard item={item} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
