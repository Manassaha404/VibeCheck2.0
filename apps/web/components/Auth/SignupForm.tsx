"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "@/hook/auth/useSignup";

const signupSchema = z.object({
  firstName: z.string().trim().max(255).min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().max(255).min(2, "Last name must be at least 2 characters"),
  username: z.string().trim().max(255).min(2, "Username must be at least 2 characters"),
  email: z.email("Invalid email address").trim().max(330).min(2),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }
  });

  const { handleSignup, apiError, apiSuccess, isSigningUp } = useSignup();

  const onSubmit = async (data: SignupFormValues) => {
    await handleSignup(data);
  };

  const handleGoogleSignup = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/trpc', '') || 'http://localhost:8000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {apiError && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-body">
          {apiError}
        </div>
      )}
      {apiSuccess && (
        <div className="p-3 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] text-[var(--color-ink-charcoal)] rounded-lg text-sm font-body">
          {apiSuccess}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block font-body text-label-sm">First Name</label>
          <input
            type="text"
            placeholder="Jane"
            {...register("firstName")}
            className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="block font-body text-label-sm">Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block font-body text-label-sm">Username</label>
        <input
          type="text"
          placeholder="@janedoe"
          {...register("username")}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="block font-body text-label-sm">Email</label>
        <input
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="block font-body text-label-sm">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-lg px-3 py-2 font-body text-body-md focus:outline-none focus:border-4 focus:border-[var(--color-electric-sun)] transition-all"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isSigningUp}
        className="w-full mt-4 bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press hard-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting || isSigningUp ? "Creating Account..." : "Create Account"}
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t-2 border-[var(--color-ink-charcoal)]"></div>
        <span className="px-4 font-body text-label-md text-[var(--color-on-surface-variant)] font-bold">OR</span>
        <div className="flex-1 border-t-2 border-[var(--color-ink-charcoal)]"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] rounded-full py-3 font-display text-headline-sm text-[var(--color-ink-charcoal)] text-center btn-press shadow-[4px_4px_0px_0px_var(--color-ink-charcoal)] flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
          <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.806L1.248 17.4C3.208 21.348 7.28 24 12 24c2.923 0 5.377-1.054 7.183-2.86l-3.143-3.127Z" />
          <path fill="#4A90E2" d="M19.834 21.14c2.082-2.003 3.33-5.022 3.33-8.498 0-.616-.063-1.218-.175-1.802H12v4.004h6.588c-.3 1.282-1.073 2.45-2.222 3.24l3.468 3.055Z" />
          <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
        </svg>
        Sign up with Google
      </button>
    </form>
  );
}
