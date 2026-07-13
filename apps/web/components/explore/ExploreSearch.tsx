import React from "react";
import { Search } from "lucide-react";

export default function ExploreSearch() {
  return (
    <div className="mb-12">
      <div className="relative w-full max-w-3xl mx-auto">
        <input
          type="text"
          className="w-full bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-full py-4 px-6 pl-14 text-body-lg focus:outline-none focus:border-[var(--color-electric-sun)] focus:ring-0 shadow-hard placeholder-[var(--color-outline)] transition-colors"
          placeholder="Search polls, quizzes, vibes..."
        />
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-ink-charcoal)]"
          size={24}
        />
      </div>
    </div>
  );
}
