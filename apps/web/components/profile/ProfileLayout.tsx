import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Select all the direct children elements we want to stagger
    const elements = containerRef.current.querySelectorAll(".stagger-item");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      },
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-canvas-cream)] text-[var(--color-ink-charcoal)] relative py-12 px-4 sm:px-6 lg:px-8 font-body bg-dot-pattern">
      <div className="max-w-3xl mx-auto" ref={containerRef}>
        <div className="stagger-item mb-10 text-center sm:text-left bg-[var(--color-electric-sun)] border-4 border-[var(--color-ink-charcoal)] shadow-neubrutalist p-8 transform -rotate-1">
          <h1 className="text-display-lg font-display text-[var(--color-ink-charcoal)]">
            Account Settings
          </h1>
          <p className="text-body-lg text-[var(--color-ink-charcoal)] mt-2 font-bold">
            Manage your profile and connected integrations.
          </p>
        </div>

        <div className="space-y-10">{children}</div>
      </div>
    </div>
  );
};
