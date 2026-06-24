"use client";

import React from 'react';
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";
import { Settings } from 'lucide-react';

type CreatePollFormInput = z.input<typeof createPollDto>;

export function PollSettingsSection() {
  const { register } = useFormContext<CreatePollFormInput>();

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-6 relative">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
        <Settings className="text-primary w-7 h-7" />
        <h2 className="font-headline-sm text-headline-sm uppercase">Poll Settings</h2>
      </div>
      <div className="space-y-6">
        
        {/* Public Poll */}
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md cursor-pointer flex flex-col" htmlFor="isPublic">
            <span>Public Poll</span>
            <span className="text-[12px] text-on-surface-variant font-normal">Anyone with the link can see and vote</span>
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
              id="isPublic" 
              type="checkbox" 
              {...register("isPublic")}
            />
            <label 
              className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" 
              htmlFor="isPublic"
            ></label>
          </div>
        </div>

        {/* Allow Comments */}
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md cursor-pointer flex flex-col" htmlFor="isCommentsAllowed">
            <span>Allow Comments</span>
            <span className="text-[12px] text-on-surface-variant font-normal">Let voters leave comments</span>
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
              id="isCommentsAllowed" 
              type="checkbox" 
              {...register("isCommentsAllowed")}
            />
            <label 
              className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" 
              htmlFor="isCommentsAllowed"
            ></label>
          </div>
        </div>

        {/* Multiple Votes */}
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md cursor-pointer flex flex-col" htmlFor="isMultipleOptionVoteAllowed">
            <span>Multiple Votes</span>
            <span className="text-[12px] text-on-surface-variant font-normal">Allow selecting multiple options</span>
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
              id="isMultipleOptionVoteAllowed" 
              type="checkbox" 
              {...register("isMultipleOptionVoteAllowed")}
            />
            <label 
              className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" 
              htmlFor="isMultipleOptionVoteAllowed"
            ></label>
          </div>
        </div>

      </div>
    </section>
  );
}
