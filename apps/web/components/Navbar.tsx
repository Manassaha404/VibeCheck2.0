"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Bookmark, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
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
  { label: "Create", href: "/create" },
  { label: "Dashboard", href: "/dashboard" },
];

const MotionLink = motion.create(Link);

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 32,
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const mobileNavVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
      opacity: { duration: 0.25 },
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

export default function Navbar({
  links = defaultLinks,
  logoText = "VibeCheck",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkmarkRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (logoRef.current) {
        tl.from(logoRef.current, { opacity: 0, y: -14, duration: 0.5 });
      }
      if (navRef.current) {
        tl.from(
          navRef.current.children,
          { opacity: 0, y: -10, duration: 0.4, stagger: 0.08 },
          "-=0.3",
        );
      }

      if (checkmarkRef.current) {
        gsap.to(checkmarkRef.current, {
          rotate: 14,
          scale: 1.15,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 1.4,
          transformOrigin: "center center",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const pathname = usePathname();
  const { userId, avatarUrl, username, fullName } = useUserInfoStore();
  const { handleLogout, isLoggingOut } = useLogout();

  const isLinkActive = (link: NavLink) =>
    link.active !== undefined
      ? link.active
      : pathname === link.href ||
        (link.href !== "/" && pathname.startsWith(link.href + "/"));

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
      <div className="hidden md:flex justify-between items-center px-10 py-4 w-full max-w-[1280px] mx-auto">
        <Link
          ref={logoRef}
          href="/"
          className="hover:opacity-80 transition-opacity relative h-10 w-48 block"
          id="navbar-logo"
        >
          <img
            src="/images/logo/logo.png"
            alt="VibeCheck"
            className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-40 w-auto max-w-none object-contain object-left pointer-events-none"
          />
        </Link>

        <nav ref={navRef} className="flex gap-8" aria-label="Main navigation">
          {links.map((link) => {
            const isActive = isLinkActive(link);

            return (
              <Link
                key={link.label}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase()}`}
                className={[
                  "relative text-headline-sm font-display font-bold transition-colors pb-1",
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute left-0 right-0 -bottom-0.5 h-1 bg-[var(--color-electric-sun)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

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
              <MotionLink
                href="/signup"
                id="navbar-get-started"
                whileHover={{
                  x: 4,
                  y: 4,
                  boxShadow: "0px 0px 0px 0px var(--color-shadow-hard)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-2 text-headline-sm font-display font-bold shadow-hard"
              >
                Get Started
              </MotionLink>
            </>
          ) : (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <motion.button
                id="navbar-avatar-btn"
                whileHover={{ scale: 1.08, rotate: -3 }}
                whileTap={{ scale: 0.94 }}
                animate={{
                  boxShadow: userMenuOpen
                    ? "3px 3px 0px 0px var(--color-shadow-hard)"
                    : "0px 0px 0px 0px var(--color-shadow-hard)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-12 h-12 rounded-full bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] font-display font-black flex items-center justify-center overflow-hidden border-2 border-[var(--color-ink-charcoal)]"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} strokeWidth={2.5} />
                )}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ transformOrigin: "top right" }}
                    className="absolute right-0 top-16 w-52 bg-[var(--color-canvas-cream)] border-2 border-[var(--color-ink-charcoal)] shadow-[6px_6px_0px_0px_var(--color-ink-charcoal)] flex flex-col p-2 gap-1 z-50"
                  >
                    <motion.div variants={itemVariants}>
                      <Link
                        href={username ? `/profile` : "/profile"}
                        onClick={() => setUserMenuOpen(false)}
                        className="text-body-lg font-bold text-[var(--color-ink-charcoal)] hover:bg-[var(--color-electric-sun)] hover:text-[var(--color-ink-charcoal)] px-4 py-2 border-2 border-transparent hover:border-[var(--color-ink-charcoal)] transition-colors flex items-center gap-2"
                      >
                        <User size={18} />
                        Profile
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Link
                        href="/saved"
                        onClick={() => setUserMenuOpen(false)}
                        className="text-body-lg font-bold text-[var(--color-ink-charcoal)] hover:bg-[var(--color-electric-sun)] hover:text-[var(--color-ink-charcoal)] px-4 py-2 border-2 border-transparent hover:border-[var(--color-ink-charcoal)] transition-colors flex items-center gap-2"
                      >
                        <Bookmark size={18} />
                        Saved
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.button
                        whileHover={{ x: 2 }}
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        disabled={isLoggingOut}
                        className="text-body-lg font-bold text-left text-[var(--color-ink-charcoal)] hover:bg-[#FF007F] hover:text-white px-4 py-2 border-2 border-transparent hover:border-[var(--color-ink-charcoal)] transition-colors flex items-center gap-2 w-full"
                      >
                        <LogOut size={18} />
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="flex md:hidden justify-between items-center px-4 py-4">
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity relative h-8 w-32 block"
        >
          <img
            src="/images/logo/logo.png"
            alt="VibeCheck"
            className="absolute left-[-10px] top-1/2 -translate-y-1/2 h-28 w-auto max-w-none object-contain object-left pointer-events-none"
          />
        </Link>

        <div className="flex items-center gap-3">
          <motion.button
            aria-label="Toggle mobile menu"
            id="navbar-mobile-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            whileTap={{ scale: 0.85, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-[var(--color-ink-charcoal)] p-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="navbar-mobile-menu"
            variants={mobileNavVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
            className="md:hidden flex flex-col border-t-2 border-[var(--color-ink-charcoal)] px-4 pb-4 gap-3"
            aria-label="Mobile navigation"
          >
            {links.map((link) => {
              const isActive = isLinkActive(link);

              return (
                <motion.div variants={mobileItemVariants} key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "text-body-lg font-bold transition-colors py-2 border-b border-[var(--color-outline-variant)] block",
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            {!userId ? (
              <>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-body-lg font-bold text-[var(--color-ink-charcoal)] py-2 block"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <MotionLink
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    whileTap={{ scale: 0.97, x: 2, y: 2 }}
                    className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 font-bold text-center shadow-hard mt-2 block"
                  >
                    Get Started
                  </MotionLink>
                </motion.div>
              </>
            ) : (
              <motion.div
                variants={mobileItemVariants}
                className="flex flex-col gap-2 mt-2 pt-4 border-t-2 border-[var(--color-outline-variant)]"
              >
                <Link
                  href={username ? `/profile/${username}` : "/profile"}
                  onClick={() => setMobileOpen(false)}
                  className="text-body-lg font-bold text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)] py-2 flex items-center gap-2"
                >
                  <User size={20} />
                  Profile
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setMobileOpen(false)}
                  className="text-body-lg font-bold text-[var(--color-ink-charcoal)] hover:text-[var(--color-primary)] py-2 flex items-center gap-2"
                >
                  <Bookmark size={20} />
                  Saved
                </Link>
                <motion.button
                  whileTap={{ scale: 0.96, x: 2, y: 2 }}
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="bg-[var(--color-electric-sun)] text-[var(--color-ink-charcoal)] border-2 border-[var(--color-ink-charcoal)] px-6 py-3 font-bold text-center shadow-hard mt-4 flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </motion.button>
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
