"use client";

import React from 'react';
import { useCreateFormStore } from '@/store/createFormStore';
import { useUserInfoStore } from '@/store/userInfoStore';

export function GeneralDetailsSection() {
  const { username } = useUserInfoStore();

  const { title, slug, isSlugManuallyEdited, setTitle, setSlug, setIsSlugManuallyEdited, description, setDescription } = useCreateFormStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!isSlugManuallyEdited) {
      const generatedSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManuallyEdited(true);
  };

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-6 md:p-8 relative">
      <div className="absolute -top-4 -left-4 bg-electric-sun border-2 border-ink-charcoal rounded-DEFAULT px-3 py-1 font-label-md text-label-md text-ink-charcoal shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] rotate-[-2deg]">
        01. The Basics
      </div>
      <div className="space-y-6 mt-4">
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md uppercase tracking-wider flex items-center gap-2" htmlFor="form-title">
             Form Title
          </label>
          <input 
            className="w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-0 transition-colors shadow-[4px_4px_0px_0px_rgba(245,226,17,0.3)]" 
            id="form-title" 
            placeholder="e.g. Weekly Vibe Check" 
            type="text" 
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md uppercase tracking-wider flex items-center gap-2" htmlFor="form-desc">
            Description
          </label>
          <textarea 
            className="w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-4 font-body-md text-body-md focus:outline-none focus:border-electric-sun focus:ring-0 transition-colors shadow-[4px_4px_0px_0px_rgba(245,226,17,0.3)] resize-y" 
            id="form-desc" 
            placeholder="Tell them why they should care..." 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md uppercase tracking-wider flex items-center gap-2" htmlFor="form-slug">
            Custom URL Slug
          </label>
          <div className="flex items-stretch border-2 border-ink-charcoal rounded-DEFAULT overflow-hidden shadow-[4px_4px_0px_0px_rgba(245,226,17,0.3)] transition-colors focus-within:border-electric-sun focus-within:shadow-[4px_4px_0px_0px_rgba(245,226,17,0.6)]">
            <span className="bg-canvas-cream px-4 py-4 flex items-center border-r-2 border-ink-charcoal font-body-md text-ink-charcoal font-bold select-none whitespace-nowrap">
              vibecheck.com/{username ? `${username}/` : 'f/'}
            </span>
            <input 
              className="flex-grow bg-pure-white p-4 font-body-lg text-body-lg focus:outline-none focus:ring-0 min-w-0" 
              id="form-slug" 
              placeholder="my-awesome-form" 
              type="text" 
              value={slug}
              onChange={handleSlugChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
