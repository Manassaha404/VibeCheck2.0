import { httpBatchLink } from "@repo/trpc/client";

export const createTRPCLink = () =>
  httpBatchLink({
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/trpc",
    fetch(url, options) {
      return fetch(url, { ...options, credentials: "include" });
    },
  });