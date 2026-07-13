"use client";

import React from "react";
import Link from "next/link";
import { Flame, Users, FileSignature, TrendingUp } from "lucide-react";
import { useTrending } from "@/hook/explore/useTrending";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`border-4 border-[var(--color-ink-charcoal)] rounded-2xl shadow-hard animate-pulse bg-[var(--color-canvas-cream)] ${
        large ? "md:col-span-2 p-8 min-h-[260px]" : "p-6 min-h-[160px]"
      }`}
    />
  );
}

// ── Trending item union type ──────────────────────────────────────────────────
type TrendingPoll = {
  kind: "poll";
  id: string;
  title: string;
  slug: string;
  username: string;
  tags: string[];
  todayVotes: number;
  totalVotes: number;
};

type TrendingPetition = {
  kind: "petition";
  id: string;
  title: string;
  slug: string;
  username: string;
  tags: string[];
  todaySignatures: number;
  totalSignatures: number;
  signaturesTarget: number;
};

type TrendingItem = TrendingPoll | TrendingPetition;

// ── Hero card (first / largest item) ─────────────────────────────────────────
function HeroCard({ item }: { item: TrendingItem }) {
  const href =
    item.kind === "poll"
      ? `/p/${item.username}/${item.slug}`
      : `/pe/${item.username}/${item.slug}`;

  const bgClass =
    item.kind === "poll"
      ? "bg-[var(--color-leaf-green)]"
      : "bg-[var(--color-electric-sun)]";

  const count = item.kind === "poll" ? item.todayVotes : item.todaySignatures;

  const label = item.kind === "poll" ? "votes today" : "signatures today";
  const ctaLabel = item.kind === "poll" ? "Vote Now" : "Sign Now";
  const Icon = item.kind === "poll" ? Users : FileSignature;

  return (
    <div
      className={`md:col-span-2 ${bgClass} border-4 border-[var(--color-ink-charcoal)] rounded-2xl p-8 shadow-hard flex flex-col justify-between relative overflow-hidden group hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300`}
    >
      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] text-label-sm px-3 py-1 rounded-full mb-4 font-bold shadow-hard-sm">
          <Flame size={14} className="text-red-500" />
          {item.kind === "poll" ? "POLL" : "PETITION"} · HOT
        </span>
        <h3 className="text-headline-md md:text-display-lg font-display font-extrabold text-[var(--color-ink-charcoal)] leading-tight mb-3 max-w-lg">
          {item.title}
        </h3>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-[var(--color-pure-white)]/60 border border-[var(--color-ink-charcoal)] text-xs font-bold px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-2 text-[var(--color-ink-charcoal)] font-bold">
          <Icon size={20} />
          <span>
            {count.toLocaleString()} {label}
          </span>
        </div>
        <Link
          href={href}
          className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] px-8 py-3 rounded-full text-headline-sm font-display font-bold shadow-hard hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-center"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

// ── Small side card ───────────────────────────────────────────────────────────
const SIDE_COLORS = [
  "bg-[var(--color-electric-sun)]",
  "bg-[var(--color-tertiary-fixed)]",
  "bg-[var(--color-sky-blue)]",
  "bg-[var(--color-lavender)]",
];

function SideCard({
  item,
  colorIdx,
}: {
  item: TrendingItem;
  colorIdx: number;
}) {
  const href =
    item.kind === "poll"
      ? `/p/${item.username}/${item.slug}`
      : `/pe/${item.username}/${item.slug}`;

  const bgClass = SIDE_COLORS[colorIdx % SIDE_COLORS.length];

  const count = item.kind === "poll" ? item.todayVotes : item.todaySignatures;
  const label = item.kind === "poll" ? "votes" : "sigs";
  const ctaLabel = item.kind === "poll" ? "Vote" : "Sign";

  return (
    <div
      className={`${bgClass} border-4 border-[var(--color-ink-charcoal)] rounded-2xl p-6 shadow-hard flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300`}
    >
      <div>
        <span className="inline-block bg-[var(--color-pure-white)]/60 border border-[var(--color-ink-charcoal)] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
          {item.kind === "poll" ? "POLL" : "PETITION"}
        </span>
        <h4 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] mb-2 leading-tight line-clamp-2">
          {item.title}
        </h4>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-sm">
          {count.toLocaleString()} {label}
        </span>
        <Link
          href={href}
          className="bg-[var(--color-pure-white)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full font-bold shadow-hard-sm hover:shadow-none hover:translate-y-[2px] transition-all"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function TrendingSection() {
  const { polls, petitions, isLoading } = useTrending(6);

  // Interleave polls and petitions for visual variety
  const items: TrendingItem[] = [
    ...polls.map((p): TrendingPoll => ({
      kind: "poll",
      id: p.pollId,
      title: p.title,
      slug: p.slug,
      username: p.username,
      tags: p.tags,
      todayVotes: p.todayVotes,
      totalVotes: p.totalVotes,
    })),
    ...petitions.map((pe): TrendingPetition => ({
      kind: "petition",
      id: pe.petitionId,
      title: pe.title,
      slug: pe.slug,
      username: pe.username,
      tags: pe.tags,
      todaySignatures: pe.todaySignatures,
      totalSignatures: pe.totalSignatures,
      signaturesTarget: pe.signaturesTarget,
    })),
  ].sort((a, b) => {
    const aCount = a.kind === "poll" ? a.todayVotes : a.todaySignatures;
    const bCount = b.kind === "poll" ? b.todayVotes : b.todaySignatures;
    return bCount - aCount;
  });

  const [hero, ...rest] = items;
  const sideItems = rest.slice(0, 2);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp size={28} className="text-red-500" />
        <h2 className="text-headline-sm md:text-headline-lg font-display font-extrabold text-[var(--color-ink-charcoal)] tracking-tight">
          Trending Today
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard large />
          <div className="flex flex-col gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="border-4 border-dashed border-[var(--color-outline)] rounded-2xl p-12 text-center">
          <p className="text-body-lg text-[var(--color-on-surface-variant)] font-semibold">
            Nothing trending yet today. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hero && <HeroCard item={hero} />}

          <div className="flex flex-col gap-6">
            {sideItems.map((item, i) => (
              <SideCard key={item.id} item={item} colorIdx={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
