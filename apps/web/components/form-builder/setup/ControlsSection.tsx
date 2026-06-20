"use client";

import React from 'react';
import { Settings, Info, Calendar } from 'lucide-react';
import { useCreateFormStore } from '@/store/formStore/createFormStore';

export function ControlsSection() {
  const { 
    allowResponseEdit, setAllowResponseEdit,
    responseLimit, setResponseLimit,
    expiresAt, setExpiresAt
  } = useCreateFormStore();

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-6 relative">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
        <Settings className="text-primary w-7 h-7" />
        <h2 className="font-headline-sm text-headline-sm uppercase">Controls</h2>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md flex items-center justify-between" htmlFor="max-responses">
            Max Responses
            <span title="Limit total submissions" className="cursor-help">
              <Info className="w-4 h-4 text-on-surface-variant" />
            </span>
          </label>
          <input 
            className="w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-3 font-body-md text-body-md focus:outline-none focus:border-electric-sun" 
            id="max-responses" 
            placeholder="Unlimited" 
            type="number" 
            value={responseLimit || ''}
            onChange={(e) => setResponseLimit(e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md flex items-center justify-between" htmlFor="expiry-time">
            Expiry Date/Time
            <span title="When form closes" className="cursor-help">
              <Calendar className="w-4 h-4 text-on-surface-variant" />
            </span>
          </label>
          <input 
            className="w-full bg-surface-container-lowest border-2 border-ink-charcoal rounded-DEFAULT p-3 font-body-md text-body-md focus:outline-none focus:border-electric-sun appearance-none" 
            id="expiry-time" 
            type="datetime-local" 
            value={expiresAt || ''}
            onChange={(e) => setExpiresAt(e.target.value || undefined)}
          />
        </div>

        <hr className="border-t-2 border-ink-charcoal/20" />

        {/* Toggle: Allow Response Edit */}
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md cursor-pointer flex flex-col" htmlFor="toggle-edit-response">
            <span>Allow Response Edit</span>
            <span className="text-[12px] text-on-surface-variant font-normal">Users can modify after submitting</span>
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
              id="toggle-edit-response" 
              name="toggle" 
              type="checkbox" 
              checked={allowResponseEdit}
              onChange={(e) => setAllowResponseEdit(e.target.checked)}
            />
            <label 
              className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" 
              htmlFor="toggle-edit-response"
            ></label>
          </div>
        </div>
      </div>
    </section>
  );
}
