import React from "react";
import { Search } from "lucide-react";

export default function ExploreSearch() {
  return (
    <div className="mb-6 sm:mb-10 md:mb-12">
      <div className="relative w-full max-w-3xl mx-auto">
        <input
          type="text"
          className="w-full bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-full py-3 sm:py-4 px-5 sm:px-6 pl-11 sm:pl-14 text-body-md sm:text-body-lg focus:outline-none focus:border-[var(--color-electric-sun)] focus:ring-0 shadow-hard placeholder-[var(--color-outline)] transition-colors"
          placeholder="Search polls, quizzes, vibes..."
        />
        <Search
          className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[var(--color-ink-charcoal)]"
          size={20}
        />
      </div>
    </div>
  );
}
