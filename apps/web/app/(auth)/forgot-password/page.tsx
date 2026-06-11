"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPassword } from "@/hook/auth/useForgotPassword";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address").min(1, "Email is required"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const { handleForgotPassword, apiError, isSubmitting: isSending, isSuccess } = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await handleForgotPassword({ email: data.email });
  };

  return (
    <div className="h-[100dvh] w-full bg-[var(--color-canvas-cream)] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--color-vivid-coral)] rounded-full border-4 border-[var(--color-ink-charcoal)] hard-shadow animate-float-slow hidden md:block" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-[var(--color-mint)] border-4 border-[var(--color-ink-charcoal)] rotate-12 hard-shadow animate-wiggle hidden md:block" />
      <div className="absolute top-1/4 right-10 w-28 h-28 bg-[var(--color-tangerine)] rounded-full border-4 border-[var(--color-ink-charcoal)] hard-shadow animate-float-medium hidden md:block" />
      <div className="absolute bottom-10 right-24 w-36 h-36 bg-[var(--color-sky-blue)] border-4 border-[var(--color-ink-charcoal)] -rotate-6 hard-shadow animate-float-slow hidden md:block" />
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-[var(--color-electric-sun)] rounded-xl border-4 border-[var(--color-ink-charcoal)] rotate-45 hard-shadow animate-float-slow hidden md:block" />

      <div className="max-w-md w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-2xl hard-shadow-xl p-6 sm:p-8 relative z-10">
        
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--color-electric-sun)] rounded-full border-2 border-[var(--color-ink-charcoal)] hard-shadow z-0 animate-wiggle" />
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[var(--color-leaf-green)] rounded-full border-2 border-[var(--color-ink-charcoal)] hard-shadow z-0 animate-float-slow" />

        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-[var(--color-surface-container-low)] border-2 border-[var(--color-ink-charcoal)] rounded-full flex items-center justify-center hard-shadow">
              <img 
                alt="Key Illustration" 
                className="w-12 h-12 object-contain mix-blend-multiply" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAvaiYi1rYiOtCEjFeDPoTtoGLYvfPtHJl0w4Zy5kTvnwjjcMfXD9_WLJFGac76Txo6kwEfVrWVmti9BRlsHRGt9daSRC_f3uhhuNv1cD2OlcyFj-IkQDF_MJ0vNc5eO7do9vJURg4DGk31V45yYckK0NOZkuumKiQ3tkYRxixIhnVz3vV1Caz3hrKILLcYWJlJJWpvl7x5ExOwNnz75zS_G1twMXoO1b4Zt10Z_XG8T_xXbsRjtFKksi-n70y0ecUdjt_w5NXB7c" 
              />
            </div>
            <h1 className="font-display text-headline-sm mb-1">Lost Your Key?</h1>
            <p className="font-body text-label-md text-[var(--color-on-surface-variant)] leading-tight">
              Enter your email address and we'll send you a link to retrieve your creative power.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-4 bg-green-100 border-2 border-green-500 text-green-800 rounded-lg text-center font-body mb-4">
              <p className="font-bold mb-2">Check your inbox!</p>
              <p className="text-sm">We've sent a password reset OTP to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body">
                  {apiError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-body text-label-sm" htmlFor="email">
                  Email Address
                </label>
                <input 
                  {...register("email")}
                  className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
                  id="email" 
                  placeholder="you@example.com" 
                  type="email" 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <button 
                type="submit" 
                disabled={isFormSubmitting || isSending}
                className="w-full mt-4 bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press hard-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isFormSubmitting || isSending ? "Sending..." : "Send Reset Link"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          <div className="mt-6 text-center border-t-2 border-[var(--color-ink-charcoal)] pt-4">
            <Link href="/signin" className="inline-flex items-center gap-2 font-body text-label-sm text-[var(--color-ink-charcoal)] hover:text-[var(--color-electric-sun)] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold underline decoration-2 decoration-[var(--color-electric-sun)] underline-offset-4">
                Wait, I remember it!
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
