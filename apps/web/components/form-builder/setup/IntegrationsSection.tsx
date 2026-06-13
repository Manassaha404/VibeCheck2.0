"use client";

import React from 'react';
import { Blocks, CheckCircle2 } from 'lucide-react';
import { useUserInfoStore } from '../../../store/userInfoStore';
import { usePathname } from 'next/navigation';

export function IntegrationsSection() {
  const { googleDriveRefreshToken } = useUserInfoStore();
  const pathname = usePathname();

  const handleConnect = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/trpc', '') || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/google/drive?returnTo=${pathname}`;
  };

  const isConnected = !!googleDriveRefreshToken;

  return (
    <section className="bg-pure-white border-4 border-ink-charcoal rounded-DEFAULT shadow-[6px_6px_0px_0px_rgba(44,46,42,1)] p-6 relative">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-ink-charcoal pb-4">
        <Blocks className="text-primary w-7 h-7" />
        <h2 className="font-headline-sm text-headline-sm uppercase">Integrations</h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border-2 border-ink-charcoal rounded-DEFAULT bg-canvas-cream">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-pure-white border-2 border-ink-charcoal flex items-center justify-center rounded-DEFAULT">
               {/* Google Drive Logo from user URL */}
               <img 
                 src="https://imgs.search.brave.com/n8AbV7H1VwspJNw4Wc3SeZpGO99NfCW_SNM4YfAJ-7Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZmF2cG5nLmNvbS8x/MS80LzYvZ29vZ2xl/LWRyaXZlLWxvZ28t/d0NicnRqM0hfdC5q/cGc" 
                 alt="Google Drive" 
                 className="w-6 h-6 object-contain"
               />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-ink-charcoal text-label-lg">Google Drive</span>
              <span className="text-on-surface-variant text-[12px] leading-tight">Sync responses to a Spreadsheet</span>
            </div>
          </div>
          {isConnected ? (
            <div className="flex items-center gap-2 text-[#008933] font-bold text-sm uppercase px-4 py-2">
              <CheckCircle2 className="w-5 h-5" />
              Connected
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              className="px-4 py-2 border-2 border-ink-charcoal bg-pure-white shadow-[2px_2px_0px_0px_rgba(44,46,42,1)] hover:bg-surface-container-lowest hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(44,46,42,1)] transition-all font-bold text-sm uppercase"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
