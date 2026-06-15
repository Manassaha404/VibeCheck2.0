import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Trash2 } from "lucide-react";
import { useAgentChat } from "@/hook/agent/useAgentChat";

export function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    handleSend,
    handleClearHistory,
    isGenerating,
    isReady,
  } = useAgentChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-electric-sun border-2 border-ink-charcoal rounded-full shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] transition-all z-50 flex items-center justify-center group"
          title="Chat with Agent"
        >
          <MessageSquare className="w-6 h-6 text-ink-charcoal group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[32rem] bg-pure-white border-2 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] rounded-lg flex flex-col z-50 overflow-hidden font-body-md transition-all animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-electric-sun border-b-2 border-ink-charcoal">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-ink-charcoal" />
              <h3 className="font-headline-sm text-headline-sm font-bold tracking-tight uppercase text-ink-charcoal">
                Vibe Agent
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {/* Clear history */}
              <button
                onClick={handleClearHistory}
                disabled={!isReady || isGenerating}
                className="p-1 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Clear conversation history"
              >
                <Trash2 className="w-4 h-4 text-ink-charcoal" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-pure-white border-2 border-transparent hover:border-ink-charcoal rounded transition-colors"
              >
                <X className="w-5 h-5 text-ink-charcoal" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-canvas-cream space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded border-2 border-ink-charcoal flex items-center justify-center ${msg.role === "user" ? "bg-mint" : "bg-lavender"}`}>
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-ink-charcoal" />
                    ) : (
                      <Bot className="w-5 h-5 text-ink-charcoal" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded border-2 border-ink-charcoal ${
                      msg.role === "user"
                        ? "bg-pure-white rounded-tr-none"
                        : "bg-pure-white rounded-tl-none"
                    } shadow-[2px_2px_0px_0px_rgba(44,46,42,1)]`}
                  >
                    <p className="text-label-md leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%] flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded border-2 border-ink-charcoal flex items-center justify-center bg-lavender">
                    <Bot className="w-5 h-5 text-ink-charcoal" />
                  </div>
                  <div className="px-4 py-2 rounded border-2 border-ink-charcoal bg-pure-white rounded-tl-none shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-ink-charcoal" />
                    <span className="text-label-md">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-pure-white border-t-2 border-ink-charcoal">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isReady ? "Ask agent to build..." : "Loading form..."}
                className="flex-1 bg-surface-container-low border-2 border-ink-charcoal rounded px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-sun focus:border-ink-charcoal transition-all placeholder:text-ink-charcoal/50"
                disabled={isGenerating || !isReady}
              />
              <button
                onClick={handleSend}
                disabled={isGenerating || !input.trim() || !isReady}
                className="p-2 bg-electric-sun border-2 border-ink-charcoal rounded shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] transition-all flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-ink-charcoal" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

