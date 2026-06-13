import React from "react";

export function FormPreviewCanvas() {
  return (
    <section className="flex-grow bg-canvas-cream overflow-y-auto relative p-8 flex justify-center items-start bg-dot-pattern">
      <div className="w-full max-w-3xl bg-pure-white border-2 border-ink-charcoal rounded-lg shadow-hard relative z-10 flex flex-col mt-4 mb-20">
        
        {/* Form Header */}
        <div className="border-b-2 border-ink-charcoal p-8 bg-electric-sun rounded-t-lg relative overflow-hidden group cursor-text">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-pure-white transition-opacity"></div>
          <input 
            className="w-full bg-transparent border-none text-headline-lg text-ink-charcoal placeholder:text-ink-charcoal/50 focus:ring-0 p-0 m-0 focus:outline-none mb-2" 
            placeholder="Form Title" 
            type="text" 
            defaultValue="Customer Feedback Poll" 
          />
          <textarea 
            className="w-full bg-transparent border-none text-body-lg text-ink-charcoal/80 placeholder:text-ink-charcoal/50 focus:ring-0 p-0 m-0 focus:outline-none resize-none overflow-hidden" 
            placeholder="Describe what this form is for..." 
            rows={1}
            defaultValue="Let us know how your recent experience was!"
          />
        </div>
        
        {/* Form Fields Canvas */}
        <div className="p-8 space-y-6 flex-grow min-h-[400px]">
          
          {/* Field 1: Active/Selected */}
          <div className="relative group cursor-pointer">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button className="bg-pure-white border-2 border-ink-charcoal rounded-full p-1 shadow-hard-sm btn-press text-ink-charcoal">
                <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
              </button>
            </div>
            <div className="border-4 border-electric-sun rounded bg-pure-white p-6 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex gap-1 bg-pure-white border-2 border-ink-charcoal rounded-full p-1 shadow-hard-sm z-20">
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                </button>
                <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-error hover:text-pure-white transition-colors">
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <label className="text-headline-sm text-ink-charcoal">What's your name?</label>
                <span className="text-error font-bold text-xl leading-none">*</span>
              </div>
              <input 
                className="w-full border-2 border-ink-charcoal bg-canvas-cream text-body-lg p-4 rounded focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal focus:bg-pure-white transition-all outline-none" 
                disabled 
                placeholder="e.g. Jane Doe" 
                type="text" 
              />
            </div>
          </div>

          {/* Field 2: Inactive */}
          <div className="relative group cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button className="bg-pure-white border-2 border-ink-charcoal rounded-full p-1 shadow-hard-sm btn-press text-ink-charcoal">
                <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
              </button>
            </div>
            <div className="border-2 border-transparent hover:border-ink-charcoal border-dashed rounded bg-pure-white p-6 transition-all">
              <div className="mb-2 flex items-center gap-2">
                <label className="text-headline-sm text-ink-charcoal">How did you hear about us?</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {["Social Media", "Friend / Colleague", "Search Engine", "Other"].map(option => (
                  <label key={option} className="flex items-center gap-3 p-3 border-2 border-ink-charcoal rounded bg-canvas-cream cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input 
                      className="w-5 h-5 text-leaf-green focus:ring-electric-sun border-2 border-ink-charcoal bg-pure-white" 
                      disabled 
                      name="source" 
                      type="radio" 
                    />
                    <span className="text-body-md">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Zone Indicator */}
          <div className="border-2 border-dashed border-primary bg-primary-fixed-dim/20 rounded-lg p-8 flex flex-col items-center justify-center text-primary gap-2 my-8">
            <span className="material-symbols-outlined text-[32px]">add_circle</span>
            <span className="text-label-md uppercase tracking-wider">Drop element here</span>
          </div>

        </div>

        {/* Form Footer Actions */}
        <div className="p-8 border-t-2 border-ink-charcoal bg-surface-container-low rounded-b-lg flex justify-end">
          <button className="bg-leaf-green text-ink-charcoal border-2 border-ink-charcoal px-8 py-3 rounded shadow-hard text-label-md uppercase btn-press cursor-pointer">
            Publish Form
          </button>
        </div>
      </div>

      {/* Floating Action Save */}
      <button className="fixed bottom-8 right-[320px] bg-leaf-green border-2 border-ink-charcoal p-4 rounded-full shadow-hard btn-press z-50 flex items-center justify-center text-ink-charcoal">
        <span className="material-symbols-outlined text-[28px]">save</span>
      </button>
    </section>
  );
}
