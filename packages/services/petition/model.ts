import { z } from "zod";

export const createPetitionDto = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title is too long").describe("title of the petition"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description is too long").describe("description of the petition"),
  targetAuthority: z.string().trim().min(1, "Target Authority is required").max(100, "Target Authority is too long").describe("target authority of the petition"),
  goal: z.number().min(1, "Goal must be at least 1").max(100000000, "Goal is too high").describe("signature goal"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]).describe("tags for the petition"),
  visibility: z.enum(["public", "unlisted"]).default("public").describe("visibility of the petition"),
});

export type createPetitionType = z.infer<typeof createPetitionDto>;
export const getAnalyticsDto = z.object({
  slug: z.string().trim().min(1, "Slug is required").describe("slug of the petition"),
});

export type getAnalyticsType = z.infer<typeof getAnalyticsDto>;

export type GetAnalyticsResponseType = {
  petition: {
    title: string;
    slug: string;
    status: string;
    signaturesTarget: number;
    totalSignatures: number;
  };
  growth: { day: string; signatures: number }[];
  recentSignatures: { firstName: string; lastName: string; createdAt: Date; city: string | null }[];
  topHubs: { city: string; country: string; count: number }[];
};
