"use client";

import React, { useState } from "react";
import { MessageSquare, Bot, X } from "lucide-react";
import AgentChatPanel from "./AgentChatPanel";

export default function AgentChatToggleFAB({ quizId }: { quizId: string }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  return (
    <>
      {/* Floating Action Button */}
      {(!open || minimized) && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 p-4 bg-electric-sun border-2 border-ink-charcoal rounded-full shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transition-all z-50 flex items-center justify-center group"
          title="Chat with Quiz Maker Agent"
        >
          {minimized ? (
            <Bot className="w-6 h-6 text-ink-charcoal group-hover:scale-110 transition-transform" />
          ) : (
            <MessageSquare className="w-6 h-6 text-ink-charcoal group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}

      {/* Chat Panel — always mounted once opened so the realtime subscription
          is never torn down mid-flight when the user minimizes. */}
      {open && (
        <div className={minimized ? "hidden" : undefined}>
          <AgentChatPanel onClose={handleClose} onMinimize={handleMinimize} quizId={quizId} />
        </div>
      )}
    </>
  );
}
