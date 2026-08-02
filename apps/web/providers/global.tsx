"use client";

import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import React, { useState } from "react";

import { trpc } from "../trpc/client";
import { createTRPCLink } from "../trpc/create-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSubscriptionGuard } from "./subscription-guard-provider";

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showLimitAlert } = useSubscriptionGuard();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error: any) => {
            if (error?.message?.startsWith("PLAN_LIMIT_EXCEEDED:")) {
              showLimitAlert(error.message.split(":")[1]);
            }
          },
        }),
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error?.message?.startsWith("PLAN_LIMIT_EXCEEDED:")) {
              showLimitAlert(error.message.split(":")[1]);
            }
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnMount: true,
            staleTime: 30 * 1000, // 1 minute
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCLink()],
    }),
  );

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
