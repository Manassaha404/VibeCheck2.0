"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Key, Lock, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { useVerifySignUpOtp } from "@/hook/auth/useVerifySignUpOtp";
import { useResendOtp } from "@/hook/auth/useResendOtp";

const inputColors = [
  'var(--color-electric-sun)',
  'var(--color-vivid-coral)',
  'var(--color-sky-blue)',
  'var(--color-mint)',
  'var(--color-lavender)',
  'var(--color-tangerine)'
];

export default function OTPVerificationPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleVerify, isPending } = useVerifySignUpOtp();
  const { handleResend, isResending } = useResendOtp();

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    if (e.target.value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Backspace auto-focuses previous input if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="bg-canvas-cream text-ink-charcoal min-h-screen flex items-center justify-center p-4 md:p-10 font-body-md bg-dot-pattern">
      <main className="w-full max-w-[600px] bg-pure-white border-4 border-ink-charcoal shadow-hard rounded-lg overflow-hidden flex flex-col relative self-center mx-auto">

        <div className="h-32 bg-electric-sun border-b-4 border-ink-charcoal relative overflow-hidden flex items-center justify-center">

          <div 
            className="absolute -bottom-4 z-10 w-48 h-48 bg-pure-white border-4 border-ink-charcoal rounded-full flex items-center justify-center" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtrS2fB2ZBaNzVVs2HQTlsM5zYm_h7uEQf1u-RU3uAFGznliOOPOBy62V5YAycNIoinbNVB78hgs1EzHFSB5lfJSjVdtA4kNnzSDhESuLKg7A9UO_C08mevECc2ToO0CDeJgHEC-_QqK461rbth_omKAIgUw92eNHiOv1M-wNkTEOWk-FaHJTkuZ-MQBCjw1-oTxz3HHJt8ckiUe4AwwhmHscDdEaspx3btVMXwbGkWKW8sB_9z43kiMTHFQAg91cJAb6z6gEFUfY')", 
              backgroundSize: "cover", 
              backgroundPosition: "center center" 
            }}
          ></div>
          

          <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-4 border-ink-charcoal accent-coral flex items-center justify-center shadow-hard-sm animate-float-slow">
            <Mail className="text-ink-charcoal w-5 h-5" />
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 rotate-12 border-4 border-ink-charcoal accent-tangerine flex items-center justify-center shadow-hard-sm animate-wiggle">
            <Key className="text-ink-charcoal w-6 h-6" />
          </div>
          <div className="absolute bottom-4 right-24 w-10 h-10 rounded-full border-4 border-ink-charcoal accent-mint flex items-center justify-center shadow-hard-sm animate-float-medium">
            <Lock className="text-ink-charcoal w-5 h-5" />
          </div>
          <div className="absolute top-1/2 left-24 w-8 h-8 rotate-45 border-4 border-ink-charcoal accent-lavender shadow-hard-sm"></div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex flex-col items-center pt-24 text-center z-20 bg-pure-white w-full">
          <h1 className="font-headline-lg text-headline-sm md:text-headline-lg text-ink-charcoal mb-4 uppercase flex flex-col sm:flex-row items-center gap-3 justify-center">
            <ShieldCheck className="w-10 h-10 hidden sm:block" style={{ color: 'var(--color-leaf-green)' }} />
            <span>VibeCheck <span className="bg-electric-sun px-3 py-1 border-2 border-ink-charcoal shadow-hard-sm inline-block rotate-2">Inbox!</span></span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md mt-2">
            We've sent a top-secret 6-digit code to your email. Enter it below to unlock the magic.
          </p>

          <form className="w-full flex flex-col items-center gap-8" onSubmit={(e) => e.preventDefault()}>

            <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center w-full mb-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  autoFocus={index === 0}
                  className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 border-4 border-ink-charcoal shadow-hard-sm rounded text-center font-display-lg text-display-lg text-ink-charcoal transition-all placeholder:text-surface-dim focus:outline-none focus:border-ink-charcoal focus:-translate-y-1 focus:shadow-hard"
                  maxLength={1}
                  placeholder="0"
                  type="number"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{ 
                    MozAppearance: 'textfield',
                    backgroundColor: otp[index] ? inputColors[index] : 'var(--color-pure-white)'
                  }}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            <button 
              type="button"
              onClick={() => handleVerify(id, otp.join(""))}
              disabled={isPending}
              className="w-full max-w-sm bg-leaf-green hover:bg-electric-sun transition-colors duration-300 text-ink-charcoal border-4 border-ink-charcoal py-4 px-8 rounded font-headline-md text-headline-md uppercase shadow-hard btn-press flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Verifying..." : "Verify"}
              {isPending ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
            </button>
          </form>
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Didn't receive the code?
            </p>
            <button 
              type="button"
              onClick={() => handleResend(id)}
              disabled={isResending}
              className="font-label-md text-label-md text-ink-charcoal accent-lavender px-4 py-2 border-2 border-ink-charcoal shadow-hard-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all uppercase flex items-center gap-2 group rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${isResending ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
      `}} />
    </div>
  );
}
