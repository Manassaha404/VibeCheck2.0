"use client";

import React, { useState, KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";
import { PetitionDraftFormValues } from "./schema";
import { X, Tag, Flame, Plus } from "lucide-react";
import { useTopTags } from "@/hook/tag/useTopTags";

export function PetitionTagsInput() {
  const { watch, setValue, formState: { errors } } = useFormContext<PetitionDraftFormValues>();
  const tags = watch("tags") || [];
  const [inputValue, setInputValue] = useState("");

  // Fetch top tags from cache
  const { data: topTagsData } = useTopTags();
  const topTags = topTagsData?.data || [];

  // Filter top tags based on user input
  const isTyping = inputValue.trim().length > 0;
  const suggestedTags = topTags
    .filter((tag: string) => 
      !tags.includes(tag) && 
      (isTyping ? tag.toLowerCase().includes(inputValue.toLowerCase()) : true)
    )
    .slice(0, 7);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tagText: string) => {
    const trimmed = tagText.replace(/,/g, "").trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setValue("tags", [...tags, trimmed], { shouldValidate: true });
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(t => t !== tagToRemove), { shouldValidate: true });
  };

  return (
    <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard-lg p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden card-lift animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-sky-blue)] border-b-2 border-ink-charcoal rounded-t-xl"></div>
      <h2 className="font-headline-sm text-headline-sm text-ink-charcoal flex items-center gap-2 mt-2">
        <Tag size={24} /> Tags
      </h2>
      <div className="flex flex-col gap-4">
        
        {/* Selected Tags Display */}
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-electric-sun border-2 border-ink-charcoal px-3 py-1 rounded-md font-label-md text-label-md text-ink-charcoal shadow-hard-sm animate-pop-in"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-error hover:text-pure-white rounded-full p-0.5 transition-colors ml-1"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {tags.length === 0 && (
            <span className="text-on-surface-variant font-body-sm text-body-sm italic flex items-center h-8">
              No tags added yet. Add some to help people find your petition!
            </span>
          )}
        </div>

        {/* Input */}
        <div className="relative flex items-center">
          <span className="absolute left-4 font-body-lg text-on-surface-variant font-bold">#</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="environment, local, community..."
            className="w-full bg-surface-dim border-2 border-ink-charcoal rounded-xl py-3 pl-8 pr-4 font-body-lg text-body-lg focus:outline-none focus:bg-pure-white focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal transition-all placeholder:font-normal"
            disabled={tags.length >= 10}
          />
        </div>
        
        {errors.tags && (
          <p className="text-error font-label-sm text-label-sm">
            {errors.tags.message}
          </p>
        )}

        {/* Suggestions Inline */}
        {tags.length < 10 && (
          <div className="flex flex-col gap-2 mt-1 bg-canvas-cream p-4 border-2 border-ink-charcoal border-dashed rounded-lg">
            <span className="font-label-sm text-label-sm text-ink-charcoal flex items-center gap-2 font-bold">
              {isTyping ? <><Tag size={16} /> Matching Tags</> : <><Flame size={16} className="text-error" /> Trending Tags</>}
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="group flex items-center gap-1 bg-pure-white border-2 border-ink-charcoal px-3 py-1 rounded-md font-label-md text-label-md text-ink-charcoal transition-all hover:bg-leaf-green hover:-translate-y-0.5 shadow-hard-sm"
                >
                  <Plus size={14} className="opacity-0 group-hover:opacity-100 -ml-1 transition-opacity w-0 group-hover:w-auto" />
                  {suggestion}
                </button>
              ))}
              {isTyping && !suggestedTags.includes(inputValue.toLowerCase().trim()) && inputValue.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => addTag(inputValue)}
                  className="group flex items-center gap-1 bg-pure-white border-2 border-ink-charcoal px-3 py-1 rounded-md font-label-md text-label-md text-ink-charcoal transition-all hover:bg-sky-blue hover:-translate-y-0.5 shadow-hard-sm"
                >
                  <Plus size={14} /> Create "{inputValue.trim().toLowerCase()}"
                </button>
              )}
              {suggestedTags.length === 0 && !isTyping && (
                <span className="text-on-surface-variant font-body-sm text-body-sm italic">
                  No trending tags right now.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
