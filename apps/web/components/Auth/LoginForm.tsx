"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from 'next/link';
import { useLogin } from "@/hook/auth/useLogin";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { handleLogin, apiError, isLoggingIn } = useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin({
      emailOrUsername: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {apiError && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body">
          {apiError}
        </div>
      )}
      
      <div className="space-y-1">
        <label className="block font-body text-label-sm" htmlFor="email">
          Email or Username
        </label>
        <input 
          {...register("email")}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
          id="email" 
          placeholder="you@example.com" 
          type="text" 
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="block font-body text-label-sm" htmlFor="password">
          Password
        </label>
        <input 
          {...register("password")}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
          id="password" 
          placeholder="••••••••" 
          type="password" 
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="font-body text-label-sm text-[var(--color-primary)] hover:text-[var(--color-electric-sun)] hover:underline transition-colors">
            Forgot Password?
          </Link>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || isLoggingIn}
        className="w-full mt-4 bg-[var(--color-electric-sun)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press hard-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || isLoggingIn ? "Signing In..." : "Sign In"}
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t-2 border-[var(--color-ink-charcoal)]"></div>
        <span className="px-4 font-body text-label-md text-[var(--color-on-surface-variant)] font-bold">OR</span>
        <div className="flex-1 border-t-2 border-[var(--color-ink-charcoal)]"></div>
      </div>

      <button 
        type="button" 
        className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
          <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.806L1.248 17.4C3.208 21.348 7.28 24 12 24c2.923 0 5.377-1.054 7.183-2.86l-3.143-3.127Z" />
          <path fill="#4A90E2" d="M19.834 21.14c2.082-2.003 3.33-5.022 3.33-8.498 0-.616-.063-1.218-.175-1.802H12v4.004h6.588c-.3 1.282-1.073 2.45-2.222 3.24l3.468 3.055Z" />
          <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
        </svg>
        Sign in with Google
      </button>
    </form>
  );
}
