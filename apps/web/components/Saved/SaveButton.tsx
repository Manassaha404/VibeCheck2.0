"use client";

import React from "react";
import { BookmarkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSaveItem } from "@/hook/saved/useSaveItem";
import { useUserInfoStore } from "@/store/userInfoStore";

interface SaveButtonProps {
  formId?: string;
  pollId?: string;
  petitionId?: string;
  className?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  formId,
  pollId,
  petitionId,
  className = "",
}) => {
  const { userId } = useUserInfoStore();
  const { isSaved, isLoading, toggleSave } = useSaveItem({
    formId,
    pollId,
    petitionId,
  });

  if (!userId) return null; // Don't show save button if not logged in

  return (
    <motion.button
      whileHover={{ y: -4, rotate: isSaved ? 0 : 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleSave}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 border-[3px] border-ink-charcoal shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] transition-all font-display font-black uppercase tracking-wider text-sm md:text-base ${
        isSaved
          ? "bg-vivid-coral text-ink-charcoal"
          : "bg-pure-white text-ink-charcoal hover:bg-electric-sun"
      } ${className}`}
      aria-label={isSaved ? "Remove from saved" : "Save this item"}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isSaved ? [1, 1.3, 1] : 1,
          rotate: isSaved ? [0, -15, 15, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <BookmarkIcon
          className="w-5 h-5 md:w-6 md:h-6"
          fill={isSaved ? "currentColor" : "none"}
          strokeWidth={2.5}
        />
      </motion.div>
      <span>{isSaved ? "Saved" : "Save"}</span>
    </motion.button>
  );
};
