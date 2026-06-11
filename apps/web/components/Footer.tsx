"use client";

import React from "react";
import Link from "next/link";
import { Camera, Hash } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  heading: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  logoText?: string;
  tagline?: string;
}

const defaultSections: FooterSection[] = [
  {
    heading: "Product",
    links: [
      { label: "Explore",    href: "/explore"    },
      { label: "Create",     href: "/create"     },
      { label: "Dashboard",  href: "/dashboard"},
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about"   },
      { label: "Blog",    href: "/blog"    },
      { label: "Careers", href: "/careers" },
      { label: "Press",   href: "/press"   },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms"   },
      { label: "Support", href: "/support" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Camera },
  { label: "X",         href: "#", icon: Hash },
];


export default function Footer({
  sections = defaultSections,
  logoText = "VibeCheck",
  tagline = "Turn opinions into action.",
}: FooterProps) {
  return (
    <footer
      id="site-footer"
      className="bg-[var(--color-ink-charcoal)] w-full border-t-4 border-[var(--color-leaf-green)] mt-24"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b-2 border-[var(--color-on-surface-variant)]">
          {/* Brand column */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link
              href="/"
              id="footer-logo"
              className="text-headline-md font-display font-black text-[var(--color-leaf-green)] hover:text-[var(--color-electric-sun)] transition-colors"
            >
              {logoText}
            </Link>
            <p className="text-body-md text-[var(--color-pure-white)] opacity-70">
              {tagline}
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-2">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    id={`footer-social-${s.label.toLowerCase()}`}
                    className="w-10 h-10 border-2 border-[var(--color-on-surface-variant)] flex items-center justify-center text-[var(--color-pure-white)] hover:border-[var(--color-electric-sun)] hover:text-[var(--color-electric-sun)] transition-colors rounded-sm"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-4">
              <h4 className="text-label-sm font-bold text-[var(--color-leaf-green)] tracking-widest uppercase">
                {section.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      id={`footer-link-${link.label.toLowerCase()}`}
                      className="text-body-md text-[var(--color-pure-white)] opacity-70 hover:opacity-100 hover:text-[var(--color-electric-sun)] transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-label-md text-[var(--color-pure-white)] opacity-50">
            © {new Date().getFullYear()} VibeCheck. All rights reserved.
          </p>
          <p className="text-label-sm text-[var(--color-on-surface-variant)]">
            Made with ☀️ by the VibeCheck team
          </p>
        </div>
      </div>
    </footer>
  );
}
