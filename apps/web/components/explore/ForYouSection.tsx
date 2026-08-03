"use client";

import React from "react";
import Link from "next/link";
import { Users, FileSignature, Sparkles, Globe, Loader2 } from "lucide-react";
import { useForYou } from "@/hook/explore/useForYou";
import type { ForYouItem } from "@repo/services/explore/model";

function SkeletonCard() {
  return (
    <div className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard animate-pulse h-52" />
  );
}

const BADGE_COLORS: Record<ForYouItem["type"], string> = {
  poll: "bg-[var(--color-leaf-green)]",
  petition: "bg-[var(--color-electric-sun)]",
};

function ForYouCard({ item }: { item: ForYouItem }) {
  const href =
    item.type === "poll"
      ? `/p/${item.username}/${item.slug}`
      : `/pe/${item.username}/${item.slug}`;

  const Icon = item.type === "poll" ? Users : FileSignature;
  const metric =
    item.type === "poll"
      ? `${(item.totalVotes ?? 0).toLocaleString()} votes`
      : `${(item.totalSignatures ?? 0).toLocaleString()} / ${(item.signaturesTarget ?? 0).toLocaleString()} signatures`;

  const ctaLabel = item.type === "poll" ? "Vote" : "Sign";

  return (
    <article className="bg-[var(--color-pure-white)] border-4 border-[var(--color-ink-charcoal)] rounded-xl shadow-hard hover:translate-y-[-4px] hover:shadow-neubrutalist transition-all duration-300 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`${BADGE_COLORS[item.type]} border-2 border-[var(--color-ink-charcoal)] text-label-sm px-2.5 py-0.5 rounded-full font-bold`}
          >
            {item.type === "poll" ? "POLL" : "PETITION"}
          </span>
          <span className="text-xs text-[var(--color-on-surface-variant)] font-semibold">
            @{item.username}
          </span>
        </div>

        <h3 className="text-headline-sm font-display font-bold text-[var(--color-ink-charcoal)] leading-tight mb-3 line-clamp-3 flex-1">
          {item.title}
        </h3>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-[var(--color-canvas-cream)] border border-[var(--color-outline)] text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink-charcoal)]">
          <Icon size={15} />
          {metric}
        </div>
      </div>

      <div className="border-t-4 border-[var(--color-ink-charcoal)] p-4 bg-[var(--color-canvas-cream)] flex justify-between items-center rounded-b-lg">
        <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
          {item.relevanceScore > 0
            ? `Score ${item.relevanceScore}`
            : "Discover"}
        </span>
        <Link
          href={href}
          className="bg-[var(--color-leaf-green)] border-2 border-[var(--color-ink-charcoal)] px-4 py-2 rounded-full font-bold text-sm shadow-hard-sm hover:shadow-none hover:translate-y-[2px] transition-all"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export default function ForYouSection({
  type,
}: {
  type?: "poll" | "petition";
}) {
  const {
    items,
    isPersonalised,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
    isError,
  } = useForYou(8, type);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 border-b-4 border-[var(--color-ink-charcoal)] pb-4">
        <div className="flex items-center gap-3">
          {isPersonalised ? (
            <Sparkles size={24} className="text-[var(--color-electric-sun)]" />
          ) : (
            <Globe size={24} className="text-[var(--color-leaf-green)]" />
          )}
          <div>
            <h2 className="text-headline-md font-display font-extrabold text-[var(--color-ink-charcoal)]">
              {type === "poll"
                ? isPersonalised
                  ? "For You Polls"
                  : "Discover Polls"
                : type === "petition"
                  ? isPersonalised
                    ? "For You Petitions"
                    : "Discover Petitions"
                  : isPersonalised
                    ? "For You"
                    : "Discover"}
            </h2>
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">
              {isPersonalised
                ? `Personalised ${type ? type + "s " : ""}based on your interests`
                : `Latest public ${type ? type + "s" : "polls & petitions"}`}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="border-4 border-dashed border-[var(--color-outline)] rounded-2xl p-12 text-center">
          <p className="text-body-lg text-[var(--color-on-surface-variant)] font-semibold">
            Failed to load content. Please refresh and try again.
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="border-4 border-dashed border-[var(--color-outline)] rounded-2xl p-12 text-center">
          <p className="text-body-lg text-[var(--color-on-surface-variant)] font-semibold">
            No content found. Start exploring other sections!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ForYouCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>

          <div ref={sentinelRef} className="h-8 mt-4" />

          {isFetchingNextPage && (
            <div className="flex justify-center items-center gap-3 py-6 text-[var(--color-on-surface-variant)] font-semibold">
              <Loader2 size={20} className="animate-spin" />
              Loading more...
            </div>
          )}

          {!hasNextPage && items.length > 0 && (
            <p className="text-center text-sm text-[var(--color-on-surface-variant)] font-semibold py-6 border-t-2 border-[var(--color-outline-variant)] mt-4">
              You&apos;ve reached the end — that&apos;s everything!
            </p>
          )}
        </>
      )}
    </section>
  );
}
