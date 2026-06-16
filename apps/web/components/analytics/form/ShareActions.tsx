'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useUserInfoStore } from '@/store/userInfoStore';

interface ShareActionsProps {
  formSlug: string;
}

export function ShareActions({ formSlug }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const { username } = useUserInfoStore();
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://vibecheck.io'}/f/${username || 'username'}/${formSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="bg-canvas-cream border-4 border-ink-charcoal shadow-[16px_16px_0px_0px_rgba(44,46,42,1)] p-8 flex flex-col md:flex-row gap-12 items-center relative mt-8">
      {/* Header badge */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FF007F] text-pure-white font-black text-2xl px-8 py-3 border-4 border-ink-charcoal -rotate-2 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] whitespace-nowrap">
        SHARE THE VIBE!
      </div>

      {/* QR code */}
      <div className="w-full md:w-1/3 flex justify-center mt-4 md:mt-0">
        <div className="bg-pure-white border-4 border-ink-charcoal p-4 shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] transform hover:-rotate-3 transition-transform cursor-pointer">
          <div className="w-40 h-40 bg-ink-charcoal flex items-center justify-center text-pure-white p-2">
            <QRCode 
              value={shareUrl} 
              size={120} 
              style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
              bgColor="transparent" 
              fgColor="#FFFFFF" 
            />
          </div>
          <p className="text-center mt-2 font-black uppercase text-sm">Scan for vibes</p>
        </div>
      </div>

      {/* Link + stats */}
      <div className="w-full md:w-2/3 space-y-6">
        <div className="space-y-2">
          <label className="font-black uppercase text-xl block">Direct Link</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-grow bg-pure-white border-4 border-ink-charcoal p-4 font-bold text-lg focus:ring-0 focus:outline-none"
              readOnly
              type="text"
              value={shareUrl}
            />
            <button
              onClick={handleCopy}
              className={`border-4 border-ink-charcoal px-8 py-4 font-black text-2xl uppercase transition-all active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] hover:shadow-none flex items-center gap-2 ${
                copied
                  ? 'bg-leaf-green text-pure-white'
                  : 'bg-electric-sun hover:bg-pure-white'
              }`}
            >
              {copied ? (
                <>
                  <Check size={24} strokeWidth={3} />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy size={24} strokeWidth={3} />
                  COPY
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form URL display */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-[#FF007F] text-pure-white border-2 border-ink-charcoal px-3 py-1 font-black text-xs uppercase">
            LIVE FORM
          </div>
        </div>
      </div>
    </section>
  );
}
