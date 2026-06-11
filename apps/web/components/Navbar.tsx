"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useUserInfoStore } from "@/store/userInfoStore";
import { useLogout } from "@/hook/auth/useLogout";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavbarProps {
  links?: NavLink[];
  logoText?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Explore", href: "/explore" },
  { label: "Create",  href: "/create" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar({ links = defaultLinks, logoText = "VibeCheck" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userId } = useUserInfoStore();
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <header
      className="w-full sticky top-0 z-50 border-b-2 border-[var(--color-ink-charcoal)] theme-transition"
      style={{
        backgroundColor: "var(--color-navbar-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 2px 0px 0px var(--color-shadow-hard)",
      }}
    >
      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center px-10 py-4 w-full max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-headline-md font-display font-black text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)] transition-colors"
          id="navbar-logo"
        >
          {logoText}
          <span
            className="ml-2 inline-block text-[var(--color-leaf-green)]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            ✓
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex gap-8" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              className={[
                "text-headline-sm font-display font-bold transition-colors",
                link.active
                  ? "text-[var(--color-primary)] border-b-4 border-[var(--color-electric-sun)] pb-1"
                  : "text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <Link
                href="/login"
                id="navbar-signin"
                className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                id="navbar-get-started"
                className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-2 text-headline-sm font-display font-bold shadow-hard btn-press"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              id="navbar-logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-2 text-headline-sm font-display font-bold shadow-hard btn-press"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden justify-between items-center px-4 py-4">
        <Link href="/" className="text-headline-sm font-display font-black text-[var(--color-ink-charcoal)]">
          {logoText}
        </Link>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle mobile menu"
            id="navbar-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-[var(--color-ink-charcoal)] p-1"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          id="navbar-mobile-menu"
          className="md:hidden flex flex-col border-t-2 border-[var(--color-ink-charcoal)] px-4 pb-4 gap-3 theme-transition"
          style={{ backgroundColor: "var(--color-canvas-cream)" }}
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-body-lg font-bold text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)] transition-colors py-2 border-b border-[var(--color-outline-variant)]"
            >
              {link.label}
            </Link>
          ))}
          {!userId ? (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="text-body-lg font-bold text-[var(--color-ink-charcoal)] py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 font-bold text-center shadow-hard mt-2"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 font-bold text-center shadow-hard mt-2"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
