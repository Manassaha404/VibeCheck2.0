import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/Auth/LoginForm';

export default function SigninPage() {
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
          <div className="text-center mb-4">
            <h1 className="font-display text-headline-sm mb-1">Welcome Back!</h1>
            <p className="font-body text-label-md text-[var(--color-on-surface-variant)] leading-tight">
              Ready to make some data look good?
            </p>
          </div>

          <LoginForm />

          <div className="mt-4 text-center font-body text-label-md">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold underline decoration-2 decoration-[var(--color-electric-sun)] underline-offset-4 hover:text-[var(--color-primary)] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
