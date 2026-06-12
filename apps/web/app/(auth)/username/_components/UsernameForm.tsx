"use client";

import React, { useState } from "react";
import { useChangeUsername } from "@/hook/auth/useChangeUsername";
import { RefreshCw } from "lucide-react";

export function UsernameForm() {
  const [username, setUsername] = useState("");
  const { handleChangeUsername, apiError, isChangingUsername } = useChangeUsername();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await handleChangeUsername(username);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {apiError && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body text-center">
          {apiError}
        </div>
      )}

      <div className="space-y-1">
        <label className="block font-body text-label-sm">Username</label>
        <input
          type="text"
          placeholder="@vibeking99"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isChangingUsername}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isChangingUsername || !username.trim()}
        className="w-full mt-4 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press hard-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isChangingUsername ? "Saving..." : "Save Username"}
        {isChangingUsername && (
          <RefreshCw className="w-5 h-5 animate-spin" />
        )}
      </button>
    </form>
  );
}
