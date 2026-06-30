"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Check, Share2 } from 'lucide-react';

export default function ShareComponent({ username, slug }: { username: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = `${origin}/pe/${username}/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-pure-white border-4 border-ink-charcoal p-6 shadow-[4px_4px_0px_0px_rgba(44,46,42,1)] flex flex-col gap-6 h-full">
      <h3 className="font-headline-md text-headline-md uppercase flex items-center gap-2 border-b-2 border-ink-charcoal pb-2">
        <Share2 size={24} />
        Share Petition
      </h3>
      
      <div className="flex flex-col items-center justify-center flex-grow gap-4">
        <div className="bg-canvas-cream p-4 border-4 border-ink-charcoal shadow-[4px_4px_0px_0px_rgba(44,46,42,1)]">
          {origin ? (
            <QRCode value={shareUrl} size={150} fgColor="#2C2E2A" bgColor="#F5F1E4" />
          ) : (
            <div className="w-[150px] h-[150px] bg-canvas-cream" />
          )}
        </div>
        <p className="font-label-sm text-label-sm uppercase tracking-wider opacity-70">Scan to Sign</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <label className="font-label-md text-label-md uppercase tracking-wider">Share Link</label>
        <div className="flex border-2 border-ink-charcoal focus-within:ring-4 focus-within:ring-electric-sun transition-all group">
          <input 
            type="text" 
            readOnly 
            value={shareUrl} 
            className="flex-grow bg-canvas-cream p-3 font-body-md text-body-md focus:outline-none min-w-0"
          />
          <button 
            onClick={handleCopy}
            className="bg-electric-sun border-l-2 border-ink-charcoal p-3 hover:bg-leaf-green transition-colors flex items-center justify-center shrink-0 w-12"
            aria-label="Copy link"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
