"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsStats } from "./AnalyticsStats";
import { LiveBarChart, type PollOption } from "./LiveBarChart";
import { VoteTimeline } from "./VoteTimeline";
import { RecentComments, type Comment } from "./RecentComments";
import { DemographicInsights } from "./DemographicInsights";

export interface PollAnalyticsData {
  pollId: string;
  slug: string;
  username: string;
  question: string;
  startedAt?: string;
  isLive?: boolean;
  totalVotes: number;
  engagementRate: number;
  topAnswer: string;
  options: PollOption[];
  comments?: Comment[];
  voteTimeline?: Array<{ time: string; votes: number; cumulative: number }>;
  demographicData?: Array<{ label: string; value: number }>;
}

interface PollAnalyticsContainerProps {
  data: PollAnalyticsData;
}

export function PollAnalyticsContainer({ data }: PollAnalyticsContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    // Stagger-in child sections on mount
    gsap.from(containerRef.current.querySelectorAll("section, header"), {
      opacity: 0,
      y: 32,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "all",
    });
  }, { scope: containerRef });

  const hasComments = (data.comments?.length ?? 0) > 0;
  const hasTimeline = (data.voteTimeline?.length ?? 0) > 0;
  const hasDemographics = (data.demographicData?.length ?? 0) > 0;

  return (
    <div
      ref={containerRef}
      className="w-full py-0 flex flex-col gap-12"
    >
      {/* Header: title + QR + Share */}
      <AnalyticsHeader
        question={data.question}
        pollId={data.pollId}
        slug={data.slug}
        username={data.username}
        startedAt={data.startedAt}
        isLive={data.isLive}
      />

      {/* Stats bento */}
      <AnalyticsStats
        totalVotes={data.totalVotes}
        engagementRate={data.engagementRate}
        topAnswer={data.topAnswer}
      />

      {/* Live bar/pie chart */}
      <LiveBarChart options={data.options} />

      {/* Vote timeline (optional) */}
      {hasTimeline && <VoteTimeline data={data.voteTimeline!} />}

      {/* 2-col layout for Radar + Comments when both exist */}
      {hasDemographics && hasComments ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DemographicInsights data={data.demographicData!} />
          <RecentComments comments={data.comments!} />
        </div>
      ) : (
        <>
          {hasDemographics && <DemographicInsights data={data.demographicData!} />}
          {hasComments && <RecentComments comments={data.comments!} />}
        </>
      )}
    </div>
  );
}
