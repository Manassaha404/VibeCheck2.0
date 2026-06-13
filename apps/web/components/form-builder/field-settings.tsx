import React from "react";

export function FieldSettings() {
  return (
    <aside className="w-full md:w-80 border-l-2 border-ink-charcoal bg-pure-white flex flex-col h-full flex-shrink-0 z-20">
      <div className="p-4 border-b-2 border-ink-charcoal bg-electric-sun flex justify-between items-center">
        <h2 className="text-headline-sm text-ink-charcoal uppercase tracking-tight">Field Settings</h2>
      </div>
      <div className="p-6 overflow-y-auto space-y-8">
        {/* Field Type indicator */}
        <div className="flex items-center gap-3 bg-surface-container-low border-2 border-ink-charcoal p-3 rounded">
          <span className="material-symbols-outlined text-primary">short_text</span>
          <span className="text-label-md">Short Text Field</span>
        </div>
        {/* Label Setting */}
        <div className="space-y-2">
          <label className="text-label-md uppercase text-outline flex items-center gap-1">
            Question Label
            <span className="material-symbols-outlined text-[14px] cursor-help" title="The main text displayed above the input">info</span>
          </label>
          <textarea className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none resize-none" rows={2} defaultValue="What's your name?" />
        </div>
        {/* Placeholder Setting */}
        <div className="space-y-2">
          <label className="text-label-md uppercase text-outline">Placeholder Text</label>
          <input className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none" type="text" defaultValue="e.g. Jane Doe" />
        </div>
        {/* Help Text Setting */}
        <div className="space-y-2">
          <label className="text-label-md uppercase text-outline">Helper Text (Optional)</label>
          <input className="w-full border-2 border-ink-charcoal bg-pure-white p-3 rounded text-body-md focus:ring-4 focus:ring-electric-sun focus:border-ink-charcoal outline-none text-ink-charcoal/50" placeholder="Add some context..." type="text" />
        </div>
        <hr className="border-t-2 border-ink-charcoal/20" />
        {/* Validations */}
        <div className="space-y-4">
          <h3 className="text-headline-sm text-ink-charcoal">Rules</h3>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-1">
              <span className="text-label-md">Primary Identity Field</span>
              <span className="material-symbols-outlined text-[14px] text-ink-charcoal" title="Mark this as the primary field for identifying the user">info</span>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform translate-x-0 checked:bg-pure-white checked:bg-none focus:ring-0" name="toggle" type="checkbox" />
              <div className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant border-2 border-ink-charcoal cursor-pointer"></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group mt-4">
            <span className="text-label-md">Required Field</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input defaultChecked className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform translate-x-6 checked:bg-pure-white checked:bg-none focus:ring-0" name="toggle" type="checkbox" />
              <div className="toggle-label block overflow-hidden h-6 rounded-full bg-leaf-green border-2 border-ink-charcoal cursor-pointer"></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group mt-4">
            <span className="text-label-md">Limit Character Count</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform translate-x-0 checked:bg-pure-white checked:bg-none focus:ring-0" name="toggle" type="checkbox" />
              <div className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant border-2 border-ink-charcoal cursor-pointer"></div>
            </div>
          </label>
        </div>
      </div>
      <div className="mt-auto p-6 border-t-2 border-ink-charcoal bg-canvas-cream">
        <button className="w-full bg-pure-white text-error border-2 border-error px-4 py-3 rounded shadow-hard-sm text-label-md uppercase hover:bg-error-container transition-colors flex justify-center items-center gap-2">
          <span className="material-symbols-outlined">delete</span>
          Delete Field
        </button>
      </div>
    </aside>
  );
}
