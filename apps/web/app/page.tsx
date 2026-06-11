"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart2,
  Brain,
  FileText,
  Megaphone,
  Vote,
  Lock,
  BarChart,
  Palette,
  Link2,
  Smartphone,
  Zap,
  Globe
} from "lucide-react";

import Navbar          from "@/components/Navbar";
import Footer              from "@/components/Footer";
import HeroSection     from "@/components/Landing/HeroSection";
import TrendingCard    from "@/components/Landing/TrendingCard";
import PollCard        from "@/components/Landing/PollCard";
import CreateCard      from "@/components/Landing/CreateCard";
import TestimonialCard     from "@/components/Landing/TestimonialCard";

import HowItWorksSection     from "@/components/Landing/HowItWorksSection";
import SeeItInActionSection  from "@/components/Landing/SeeItInActionSection";



const createCards = [
  {
    variant: "poll" as const,
    title: "Poll",
    description: "Quick two-option or multi-option voting — public or private.",
    icon: <BarChart2 size={28} />,
    id: "create-poll",
  },
  {
    variant: "quiz" as const,
    title: "Quiz",
    description: "Scored trivia, personality tests, or knowledge challenges.",
    icon: <Brain size={28} />,
    id: "create-quiz",
  },
  {
    variant: "form" as const,
    title: "Form",
    description: "Contact forms, surveys, feedback — anything you need.",
    icon: <FileText size={28} />,
    id: "create-form",
  },
  {
    variant: "petition" as const,
    title: "Petition",
    description: "Rally support and collect verified signatures at scale.",
    icon: <Megaphone size={28} />,
    id: "create-petition",
  },
];

const trendingPolls = [
  {
    category: "Tech",
    question: "Will AI replace designers in 5 years?",
    voteCount: "3,402",
    accent: "canvas-cream" as const,
    progressPercent: 65,
    progressLabels: ["Yes", "No"] as [string, string],
    id: "poll-card-1",
  },
  {
    category: "Gaming",
    question: "Favorite Console Generation?",
    voteCount: "12,890",
    accent: "electric-sun" as const,
    options: ["PS2 / Xbox Era", "Current Gen", "SNES / N64"],
    id: "poll-card-2",
  },
  {
    category: "Lifestyle",
    question: "Best time to wake up for maximum productivity?",
    voteCount: "5,112",
    accent: "leaf-green" as const,
    options: ["5 AM", "7 AM", "9 AM", "Whenever"],
    id: "poll-card-3",
  },
];

const testimonials = [
  {
    quote: "We ran our entire product survey on VibeCheck — 4,000 responses in a single afternoon. Insane.",
    author: "Priya M.",
    role: "Product Manager @ Notion",
    avatar: "🚀",
    accentColor: "var(--color-leaf-green)",
    id: "testimonial-1",
  },
  {
    quote: "The neubrutalist design made our student council polls go viral on campus Instagram. 10/10.",
    author: "Jordan K.",
    role: "Student Council President",
    avatar: "⚡",
    accentColor: "var(--color-vivid-coral)",
    id: "testimonial-2",
  },
  {
    quote: "Creating a petition used to mean Google Forms + manual counting. VibeCheck eliminated both.",
    author: "Aisha L.",
    role: "Community Organiser",
    avatar: "🌿",
    accentColor: "var(--color-sky-blue)",
    id: "testimonial-3",
  },
];

const accentStrip = [
  "var(--color-leaf-green)",
  "var(--color-electric-sun)",
  "var(--color-vivid-coral)",
  "var(--color-sky-blue)",
  "var(--color-tangerine)",
  "var(--color-mint)",
  "var(--color-lavender)",
];


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="w-full flex h-2 overflow-hidden">
        {accentStrip.map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
        ))}
      </div>

      <main id="main-content">
        <HeroSection />
        <section
          id="create-types"
          className="border-y-4 border-[var(--color-ink-charcoal)] py-24 theme-transition"
          style={{ backgroundColor: "var(--color-surface-container-low)" }}
          aria-labelledby="create-heading"
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="mb-14">
              <h2
                id="create-heading"
                className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)] mb-4"
              >
                What will you create?
              </h2>
              <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl">
                Pick your format and go live in seconds — no account required for the first one.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {createCards.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -3 : 3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 14, delay: i * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <CreateCard {...c} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="trending"
          className="max-w-[1280px] mx-auto px-4 md:px-10 py-24"
          aria-labelledby="trending-heading"
        >
          <div className="flex items-end justify-between mb-10 border-b-4 border-[var(--color-ink-charcoal)] pb-4">
            <h2
              id="trending-heading"
              className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)]"
            >
              Trending Now 🔥
            </h2>
            <Link
              href="/explore"
              id="trending-see-all"
              className="text-label-md font-bold text-[var(--color-primary)] hover:text-[var(--color-leaf-green)] transition-colors hidden md:block"
            >
              See all →
            </Link>
          </div>
          <div
            className="hidden md:grid gap-6 mb-10"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "minmax(300px, 1fr) minmax(300px, 1fr)",
            }}
          >
            <TrendingCard
              id="trending-featured"
              badge="HOT 🔥"
              title="Is Remote Work Actually Working?"
              description="Join the largest tech community poll this week. Over 50k votes and counting."
              voteCount="52.4k"
              bgColor="var(--color-leaf-green)"
              href="/poll/remote-work"
              index={0}
              className="[grid-column:1/3] [grid-row:1/2]"
            />
            <TrendingCard
              id="trending-side-1"
              title="Best Frontend Framework 2025?"
              voteCount="12k"
              bgColor="var(--color-electric-sun)"
              href="/poll/frontend-framework"
              index={1}
              className="[grid-column:3/4] [grid-row:1/2]"
            />
            <TrendingCard
              id="trending-side-2"
              title="Coffee vs Energy Drinks"
              voteCount="8.5k"
              bgColor="var(--color-vivid-coral)"
              href="/poll/coffee-energy"
              index={2}
              className="[grid-column:1/2] [grid-row:2/3]"
            />
            <TrendingCard
              id="trending-side-3"
              title="Mac vs Windows? The Great Debate"
              description="Developers, designers, and everyday users all weigh in on the ultimate OS showdown."
              voteCount="6.2k"
              bgColor="var(--color-sky-blue)"
              href="/poll/mac-vs-windows"
              index={3}
              className="[grid-column:2/4] [grid-row:2/3]"
            />
          </div>
          <div className="flex flex-col gap-6 mb-10 md:hidden">
            <TrendingCard
              id="trending-featured-mobile"
              badge="HOT 🔥"
              title="Is Remote Work Actually Working?"
              description="Join the largest tech community poll this week. Over 50k votes and counting."
              voteCount="52.4k"
              bgColor="var(--color-leaf-green)"
              href="/poll/remote-work"
              index={0}
            />
            <TrendingCard
              id="trending-side-1-mobile"
              title="Best Frontend Framework 2025?"
              voteCount="12k"
              bgColor="var(--color-electric-sun)"
              href="/poll/frontend-framework"
              index={1}
            />
            <TrendingCard
              id="trending-side-2-mobile"
              title="Coffee vs Energy Drinks"
              voteCount="8.5k"
              bgColor="var(--color-vivid-coral)"
              href="/poll/coffee-energy"
              index={2}
            />
            <TrendingCard
              id="trending-side-3-mobile"
              title="Mac vs Windows?"
              voteCount="6.2k"
              bgColor="var(--color-sky-blue)"
              href="/poll/mac-vs-windows"
              index={3}
            />
          </div>
        </section>
        <section
          id="public-polls"
          className="bg-dot-pattern py-24 border-t-4 border-[var(--color-ink-charcoal)] theme-transition"
          style={{ backgroundColor: "var(--color-section-stripe)" }}
          aria-labelledby="public-polls-heading"
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="flex items-end justify-between mb-10 border-b-4 border-[var(--color-ink-charcoal)] pb-4">
              <h2
                id="public-polls-heading"
                className="text-headline-md font-display font-black text-[var(--color-ink-charcoal)]"
              >
                Public Polls &amp; Partitions
              </h2>
              <div className="hidden md:flex gap-2">
                {["Latest", "Most Discussed"].map((filter) => (
                  <button
                    key={filter}
                    className="border-2 border-[var(--color-ink-charcoal)] px-4 py-1 rounded-full text-label-md font-bold hover:bg-[var(--color-leaf-green)] transition-colors theme-transition"
                    style={{ backgroundColor: "var(--color-pure-white)", color: "var(--color-ink-charcoal)" }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingPolls.map((p) => (
                <PollCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>
        <HowItWorksSection />
        <SeeItInActionSection />
        <section
          id="testimonials"
          className="max-w-[1280px] mx-auto px-4 md:px-10 py-24"
          aria-labelledby="testimonials-heading"
        >
          <div className="mb-14 text-center max-w-xl mx-auto">
            <h2
              id="testimonials-heading"
              className="text-headline-lg font-display font-black text-[var(--color-ink-charcoal)] mb-4"
            >
              Creators love it.
            </h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              Thousands of communities, classrooms, and companies vibe with VibeCheck daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} {...t} index={i} />
            ))}
          </div>
        </section>
        <section
          id="feature-chips"
          className="border-y-4 border-[var(--color-ink-charcoal)] py-10 overflow-hidden theme-transition"
          style={{ backgroundColor: "var(--color-tangerine)" }}
          aria-labelledby="feature-chips-heading"
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <h2
              id="feature-chips-heading"
              className="text-headline-md font-display font-black text-[var(--color-ink-charcoal)] mb-8 text-center"
            >
              Everything you need ⚡
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: <Vote size={20} />, label: "Real-time Results", color: "var(--color-leaf-green)" },
                { icon: <Lock size={20} />, label: "Privacy Controls", color: "var(--color-electric-sun)" },
                { icon: <BarChart size={20} />, label: "Live Analytics", color: "var(--color-vivid-coral)" },
                { icon: <Palette size={20} />, label: "Custom Themes", color: "var(--color-sky-blue)" },
                { icon: <Link2 size={20} />, label: "Shareable Links", color: "var(--color-mint)" },
                { icon: <Smartphone size={20} />, label: "Mobile First", color: "var(--color-lavender)" },
                { icon: <Zap size={20} />, label: "No Signup Needed", color: "var(--color-electric-sun)" },
                { icon: <Globe size={20} />, label: "Multilingual", color: "var(--color-leaf-green)" },
              ].map(({ icon, label, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.08, rotate: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 border-2 border-[var(--color-ink-dark)] px-5 py-3 shadow-hard font-bold text-[var(--color-ink-dark)] text-label-md cursor-pointer"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-[var(--color-ink-dark)] leading-none flex items-center">{icon}</span>
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="cta-banner"
          className="border-y-4 border-[var(--color-ink-charcoal)] py-20 theme-transition"
          style={{ backgroundColor: "var(--color-leaf-green)" }}
          aria-labelledby="cta-heading"
        >
          <motion.div
            className="max-w-[1280px] mx-auto px-4 md:px-10 text-center"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.h2
              id="cta-heading"
              className="text-display-lg font-display font-black text-[var(--color-ink-charcoal)] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to check the vibe?
            </motion.h2>
            <motion.p
              className="text-body-lg text-[var(--color-ink-charcoal)] mb-10 opacity-80 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Create your first poll, quiz, or form — free, no credit card needed.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96, x: 3, y: 3 }}>
                <Link
                  href="/auth/signup"
                  id="cta-get-started"
                  className="bg-[var(--color-ink-charcoal)] text-[var(--color-canvas-cream)] border-4 border-[var(--color-ink-charcoal)] px-10 py-4 text-headline-sm font-display font-bold shadow-hard inline-block"
                  style={{ boxShadow: "4px 4px 0px 0px var(--color-canvas-cream)" }}
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96, x: 3, y: 3 }}>
                <Link
                  href="/explore"
                  id="cta-explore"
                  className="bg-[var(--color-electric-sun)] text-[var(--color-ink-dark)] border-4 border-[var(--color-ink-dark)] px-10 py-4 text-headline-sm font-display font-bold shadow-hard inline-block"
                >
                  Explore Vibes
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96, x: 3, y: 3 }}>
                <Link
                  href="/create"
                  id="cta-create"
                  className="border-4 border-[var(--color-ink-dark)] px-10 py-4 text-headline-sm font-display font-bold shadow-hard inline-block"
                  style={{
                    backgroundColor: "var(--color-vivid-coral)",
                    color: "var(--color-ink-dark)",
                  }}
                >
                  Make a Quiz →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
