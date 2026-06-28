"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { PetitionDraftFormValues } from "./schema";
import { PetitionTagsInput } from "./PetitionTagsInput";
import { Bold, Italic, Link as LinkIcon, Megaphone } from "lucide-react";

export function PetitionForm({ isSubmitting = false }: { isSubmitting?: boolean }) {
  const { register, formState: { errors } } = useFormContext<PetitionDraftFormValues>();

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="font-headline-sm text-headline-sm text-ink-charcoal mb-1 block" htmlFor="petition-title">
          Petition Title
        </label>
        <input
          {...register("title")}
          className="w-full bg-pure-white border-2 border-ink-charcoal shadow-hard p-4 font-headline-sm text-headline-sm text-ink-charcoal placeholder:text-surface-dim focus:outline-none focus:ring-4 focus:ring-electric-sun transition-all"
          id="petition-title"
          placeholder="Enter a high-impact title..."
          type="text"
        />
        {errors.title && <p className="text-error text-label-sm">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="font-headline-sm text-headline-sm text-ink-charcoal mb-1 block" htmlFor="petition-desc">
          The Pitch (Why should we care?)
        </label>
        <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard flex flex-col focus-within:ring-4 focus-within:ring-electric-sun transition-all">
          {/* Pseudo Rich Text Toolbar */}
          <div className="bg-surface-container border-b-2 border-ink-charcoal p-2 flex gap-2">
            <button 
              aria-label="Bold" 
              className="p-1 hover:bg-canvas-cream border-2 border-transparent hover:border-ink-charcoal rounded transition-colors" 
              type="button"
              onClick={() => {
                const textarea = document.getElementById("petition-desc") as HTMLTextAreaElement;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                const selectedText = value.substring(start, end);
                const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
                
                // Use setValue from useFormContext if available, otherwise just update value
                // Since this component uses useFormContext, we need to extract setValue
                const syntheticEvent = { target: { value: newText } } as React.ChangeEvent<HTMLTextAreaElement>;
                textarea.value = newText;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + 2, end + 2);
                }, 0);
              }}
            >
              <Bold size={18} />
            </button>
            <button 
              aria-label="Italic" 
              className="p-1 hover:bg-canvas-cream border-2 border-transparent hover:border-ink-charcoal rounded transition-colors" 
              type="button"
              onClick={() => {
                const textarea = document.getElementById("petition-desc") as HTMLTextAreaElement;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                const selectedText = value.substring(start, end);
                const newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
                
                textarea.value = newText;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(start + 1, end + 1);
                }, 0);
              }}
            >
              <Italic size={18} />
            </button>
            <button 
              aria-label="Link" 
              className="p-1 hover:bg-canvas-cream border-2 border-transparent hover:border-ink-charcoal rounded transition-colors" 
              type="button"
              onClick={() => {
                const textarea = document.getElementById("petition-desc") as HTMLTextAreaElement;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                const selectedText = value.substring(start, end);
                
                const url = prompt("Enter URL:");
                if (url !== null) {
                  const newText = value.substring(0, start) + `[${selectedText || "link text"}](${url})` + value.substring(end);
                  textarea.value = newText;
                  textarea.dispatchEvent(new Event('input', { bubbles: true }));
                  
                  setTimeout(() => {
                    textarea.focus();
                    if (!selectedText) {
                      textarea.setSelectionRange(start + 1, start + 10); // select "link text"
                    } else {
                      textarea.setSelectionRange(start + 1, end + 1);
                    }
                  }, 0);
                }
              }}
            >
              <LinkIcon size={18} />
            </button>
          </div>
          <textarea
            {...register("description")}
            className="w-full border-none p-4 font-body-md text-body-md text-ink-charcoal resize-y focus:ring-0 placeholder:text-surface-dim focus:outline-none"
            id="petition-desc"
            placeholder="Tell your story..."
            rows={6}
          />
        </div>
        {errors.description && <p className="text-error text-label-sm">{errors.description.message}</p>}
      </div>

      {/* Details Row */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Target Authority */}
        <div className="flex flex-col gap-2 flex-grow">
          <label className="font-headline-sm text-headline-sm text-ink-charcoal mb-1 block" htmlFor="petition-target">
            Target Authority
          </label>
          <input
            {...register("targetAuthority")}
            className="w-full bg-pure-white border-2 border-ink-charcoal shadow-hard p-4 font-body-lg text-body-lg text-ink-charcoal focus:outline-none focus:ring-4 focus:ring-electric-sun transition-all"
            id="petition-target"
            placeholder="e.g. City Council"
            type="text"
          />
          {errors.targetAuthority && <p className="text-error text-label-sm">{errors.targetAuthority.message}</p>}
        </div>

        {/* Signature Goal */}
        <div className="flex flex-col gap-2 w-full sm:w-1/3">
          <label className="font-headline-sm text-headline-sm text-ink-charcoal mb-1 block" htmlFor="petition-goal">
            Signature Goal
          </label>
          <input
            {...register("goal", { valueAsNumber: true })}
            className="w-full bg-pure-white border-2 border-ink-charcoal shadow-hard p-4 font-body-lg text-body-lg text-ink-charcoal focus:outline-none focus:ring-4 focus:ring-electric-sun transition-all"
            id="petition-goal"
            placeholder="5000"
            type="number"
          />
          {errors.goal && <p className="text-error text-label-sm">{errors.goal.message}</p>}
        </div>
      </div>

      {/* Tags Input */}
      <PetitionTagsInput />

      {/* Visibility */}
      <div className="bg-pure-white border-2 border-ink-charcoal shadow-hard p-6 flex flex-col gap-4">
        <h3 className="font-headline-sm text-headline-sm text-ink-charcoal">Visibility</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input {...register("visibility")} className="sr-only peer" type="radio" value="public" />
            <div className="w-6 h-6 rounded-full border-2 border-ink-charcoal flex items-center justify-center peer-checked:bg-electric-sun peer-checked:shadow-hard-sm transition-all">
              <div className="w-2 h-2 rounded-full bg-ink-charcoal opacity-0 peer-checked:opacity-100"></div>
            </div>
            <span className="font-body-lg text-body-lg text-ink-charcoal group-hover:text-primary transition-colors">
              Public (Discoverable)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group ml-4">
            <input {...register("visibility")} className="sr-only peer" type="radio" value="unlisted" />
            <div className="w-6 h-6 rounded-full border-2 border-ink-charcoal flex items-center justify-center peer-checked:bg-surface-variant peer-checked:shadow-hard-sm transition-all">
              <div className="w-2 h-2 rounded-full bg-ink-charcoal opacity-0 peer-checked:opacity-100"></div>
            </div>
            <span className="font-body-lg text-body-lg text-ink-charcoal group-hover:text-primary transition-colors">
              Unlisted (Link Only)
            </span>
          </label>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4">
        <button
          className="w-full bg-leaf-green border-2 border-ink-charcoal p-6 font-headline-md text-headline-md text-ink-charcoal shadow-hard-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all active:translate-x-[8px] active:translate-y-[8px] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          <Megaphone className="transition-transform group-hover:scale-110" size={32} />
          {isSubmitting ? "Publishing..." : "Publish Petition"}
        </button>
      </div>
    </div>
  );
}
