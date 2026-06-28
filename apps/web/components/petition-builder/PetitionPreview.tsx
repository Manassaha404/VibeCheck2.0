"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { PetitionDraftFormValues } from "./schema";
import ReactMarkdown from "react-markdown";
import { Eye, Hand } from "lucide-react";

export function PetitionPreview() {
  const { control } = useFormContext<PetitionDraftFormValues>();

  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const targetAuthority = useWatch({ control, name: "targetAuthority" });
  const goal = useWatch({ control, name: "goal" });

  const displayTitle = title || "Save the Local Skatepark from Demolition";
  const displayDescription = description || "The downtown skatepark has been a sanctuary for youth since 1998. Now, developers want to bulldoze it for a parking lot. We cannot let corporate interests pave over our community spaces. Stand with us to demand the City Council designate the park as a protected recreational zone.";
  const displayTarget = targetAuthority || "City Council";
  const displayGoal = goal || 5000;

  return (
    <section className="w-full lg:w-1/2 relative z-10 flex flex-col gap-6 lg:pl-8 lg:border-l-4 border-ink-charcoal border-dashed mt-12 lg:mt-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-label-md text-label-md text-tertiary uppercase tracking-wider">Live Preview</h2>
        <div className="flex items-center gap-2 text-surface-dim">
          <Eye size={16} />
          <span className="font-label-sm text-label-sm">Signer View</span>
        </div>
      </div>

      {/* The Preview Card */}
      <div className="bg-pure-white border-4 border-ink-charcoal shadow-hard-lg flex flex-col relative overflow-hidden group/preview">
        {/* Decorative Graphic */}
        <div className="h-32 bg-electric-sun border-b-4 border-ink-charcoal relative flex items-center justify-center overflow-hidden">
          {/* Sticker */}
          <div className="absolute -right-4 -bottom-4 rotate-[-12deg] bg-pure-white border-4 border-ink-charcoal p-2 shadow-hard z-10">
            <span className="font-headline-sm text-headline-sm text-error uppercase block">Sign This!</span>
          </div>
          {/* Halftone pattern over electric sun */}
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none"></div>
        </div>

        <div className="p-8 flex flex-col gap-6 relative">
          {/* Target Badge */}
          <div className="inline-flex">
            <span className="bg-canvas-cream border-2 border-ink-charcoal px-3 py-1 font-label-md text-label-md text-ink-charcoal uppercase shadow-hard-sm">
              Target: {displayTarget}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ink-charcoal break-words">
            {displayTitle}
          </h2>

          {/* Progress Bar Component */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-end">
              <span className="font-headline-sm text-headline-sm text-primary">3,421</span>
              <span className="font-label-md text-label-md text-tertiary">
                of <span>{displayGoal.toLocaleString()}</span> signatures
              </span>
            </div>
            <div className="w-full h-8 bg-surface-container border-2 border-ink-charcoal overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-leaf-green border-r-2 border-ink-charcoal transition-all duration-500 ease-out flex items-center justify-end px-2"
                style={{ width: '68%' }}
              >
                <div className="w-4 h-4 rounded-full bg-pure-white border-2 border-ink-charcoal opacity-50"></div>
              </div>
            </div>
          </div>

          {/* Description Snippet */}
          <div className="prose prose-lg font-body-lg text-body-lg text-on-surface mt-4 border-l-4 border-electric-sun pl-4">
            <div className="line-clamp-4 whitespace-pre-wrap">
              <ReactMarkdown 
                components={{
                  a: ({node, href, children, ...props}) => (
                    <a 
                      {...props}
                      href={href}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sky-blue font-bold underline decoration-2 hover:bg-sky-blue hover:text-ink-charcoal transition-colors px-1"
                    >
                      {children}
                    </a>
                  )
                }}
              >
                {displayDescription}
              </ReactMarkdown>
            </div>
          </div>

          {/* Mock Sign Button */}
          <button className="w-full mt-6 bg-electric-sun border-4 border-ink-charcoal py-4 font-headline-sm text-headline-sm text-ink-charcoal shadow-hard-lg opacity-70 cursor-not-allowed uppercase tracking-widest">
            Sign Petition (Preview)
          </button>
        </div>
      </div>

      {/* Floating Character Graphic */}
      <div className="absolute -bottom-12 -right-8 w-32 h-32 bg-canvas-cream border-4 border-ink-charcoal rounded-full shadow-hard-lg items-center justify-center rotate-12 hidden xl:flex z-20">
        <Hand size={64} className="text-leaf-green" />
      </div>
    </section>
  );
}
