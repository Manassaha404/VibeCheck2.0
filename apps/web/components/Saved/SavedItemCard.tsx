"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import {
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  ListIcon,
  FlagIcon,
} from "lucide-react";

interface SavedItemCardProps {
  item: any;
  index: number;
}

export const SavedItemCard: React.FC<SavedItemCardProps> = ({
  item,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
        },
      );
    }
  }, [index]);

  const type = item.polls
    ? "POLL"
    : item.forms
      ? "FORM"
      : item.petitions
        ? "PETITION"
        : "UNKNOWN";
  const data = item.polls || item.forms || item.petitions || {};

  const getHref = () => {
    switch (type) {
      case "POLL":
        return `/polls/${data.pollId}`;
      case "FORM":
        return `/forms/${data.formId}`;
      case "PETITION":
        return `/petitions/${data.petitionId}`;
      default:
        return "#";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "POLL":
        return (
          <ListIcon className="w-5 h-5 text-ink-charcoal" strokeWidth={2.5} />
        );
      case "FORM":
        return (
          <FileTextIcon
            className="w-5 h-5 text-ink-charcoal"
            strokeWidth={2.5}
          />
        );
      case "PETITION":
        return (
          <FlagIcon className="w-5 h-5 text-ink-charcoal" strokeWidth={2.5} />
        );
      default:
        return null;
    }
  };

  const getTypeStyle = () => {
    switch (type) {
      case "POLL":
        return "bg-sky-blue";
      case "FORM":
        return "bg-vivid-coral";
      case "PETITION":
        return "bg-mint";
      default:
        return "bg-canvas-cream";
    }
  };

  return (
    <div ref={cardRef} className="h-full">
      <Link href={getHref()} className="block h-full group outline-none">
        <motion.div
          whileHover={{ y: -6, x: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative h-full flex flex-col p-6 md:p-8 bg-pure-white border-[4px] border-ink-charcoal shadow-hard group-hover:shadow-hard-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

          <div
            className={`absolute top-0 left-0 right-0 h-3 border-b-[4px] border-ink-charcoal ${getTypeStyle()}`}
          />

          <div className="flex justify-between items-start mt-2 mb-6 relative z-10">
            <span
              className={`px-4 py-1 text-sm font-display font-black uppercase tracking-widest text-ink-charcoal border-[3px] border-ink-charcoal shadow-hard-sm flex items-center gap-2 ${getTypeStyle()} transform -rotate-2 group-hover:rotate-0 transition-transform`}
            >
              {getIcon()}
              {type}
            </span>
            <span className="text-sm font-bold text-ink-charcoal/60 flex items-center gap-2 bg-canvas-cream border-2 border-ink-charcoal px-3 py-1 shadow-hard-sm">
              <CalendarIcon
                className="w-4 h-4 text-ink-charcoal"
                strokeWidth={2.5}
              />
              {new Date(item.saves.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex-grow relative z-10 mb-6">
            <h3 className="text-2xl font-display font-black uppercase text-ink-charcoal mb-4 line-clamp-2 leading-tight group-hover:underline decoration-[4px] underline-offset-4">
              {data.title || data.question || "Untitled"}
            </h3>
            <p className="text-base font-body font-bold text-ink-charcoal/80 line-clamp-3">
              {data.description ||
                "No description provided for this item. Might be just vibes."}
            </p>
          </div>

          <div className="pt-5 border-t-[4px] border-ink-charcoal border-dashed flex items-center justify-between relative z-10">
            <div className="flex items-center text-sm font-bold text-ink-charcoal gap-2 bg-candy-pink/30 px-3 py-1 border-2 border-ink-charcoal">
              <UserIcon className="w-4 h-4" strokeWidth={2.5} />
              <span>Created by User</span>
            </div>

            <div className="bg-electric-sun text-ink-charcoal text-sm font-display font-black uppercase tracking-widest px-4 py-2 border-[3px] border-ink-charcoal shadow-hard-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              View &rarr;
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};
