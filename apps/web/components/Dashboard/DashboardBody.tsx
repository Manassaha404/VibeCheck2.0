"use client";

import React from "react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardStatsBar } from "@/components/Dashboard/DashboardStatsBar";
import { DashboardQuickActions } from "@/components/Dashboard/DashboardQuickActions";
import { DashboardContentGrid } from "@/components/Dashboard/DashboardContentGrid";
import { useDashboard } from "@/hook/dashboard/useDashboard";
import { useUserInfoStore } from "@/store/userInfoStore";

export function DashboardBody() {
  const { fullName, username } = useUserInfoStore();
  const displayName = fullName ?? username ?? "Creator";

  const {
    allItems,
    totalPolls,
    totalForms,
    totalPetitions,
    totalResponses,
    isLoading,
    isError,
    refetch,
  } = useDashboard();

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 md:py-14 flex flex-col gap-10">
      {/* 1. Welcome hero */}
      <DashboardHeader userName={displayName} />

      {/* 2. Stats strip */}
      <DashboardStatsBar
        totalPolls={totalPolls}
        totalForms={totalForms}
        totalPetitions={totalPetitions}
        totalResponses={totalResponses}
        isLoading={isLoading}
      />

      {/* 3. Quick create */}
      <DashboardQuickActions />

      {/* 4. Content grid */}
      <div className="flex flex-col gap-8">
        <DashboardContentGrid
          items={allItems}
          isLoading={isLoading}
          isError={isError}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
}
