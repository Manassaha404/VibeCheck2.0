"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import { useCreateFormStore } from '@/store/createFormStore';

export function SecuritySettingsSection() {
  const { passwordNeeded, setPasswordNeeded, password, setPassword } = useCreateFormStore();

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-6 relative">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
        <Lock className="text-primary w-7 h-7" />
        <h2 className="font-headline-sm text-headline-sm uppercase">Security</h2>
      </div>
      <div className="space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md cursor-pointer flex flex-col" htmlFor="toggle-password">
            <span>Password Protection</span>
            <span className="text-[12px] text-on-surface-variant font-normal">Require a key to enter</span>
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              className="toggle-checkbox absolute left-0 top-0 m-0 block w-6 h-6 rounded-full bg-pure-white border-2 border-ink-charcoal appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out peer checked:translate-x-6" 
              id="toggle-password" 
              name="toggle" 
              type="checkbox" 
              checked={passwordNeeded}
              onChange={(e) => setPasswordNeeded(e.target.checked)}
            />
            <label 
              className="toggle-label block overflow-hidden h-6 rounded-full border-2 border-ink-charcoal cursor-pointer transition-colors duration-200 bg-surface-variant peer-checked:bg-leaf-green" 
              htmlFor="toggle-password"
            ></label>
          </div>
        </div>
        
        {/* Hidden Password Field */}
        <div 
          className={`flex flex-col gap-2 mt-4 p-4 bg-canvas-cream border-2 border-ink-charcoal rounded-DEFAULT transition-opacity duration-200 ${passwordNeeded ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`} 
          id="password-field-container"
        >
          <label className="font-label-sm text-label-sm uppercase" htmlFor="form-password">Set Password</label>
          <input 
            className="w-full bg-pure-white border-2 border-ink-charcoal rounded-DEFAULT p-3 font-body-md text-body-md focus:outline-none focus:border-electric-sun" 
            id="form-password" 
            placeholder="••••••••" 
            type="password" 
            disabled={!passwordNeeded}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
