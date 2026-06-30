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
    username: string;
  };
  growth: { day: string; signatures: number }[];
  recentSignatures: { firstName: string; lastName: string; createdAt: Date; city: string | null }[];
  topHubs: { city: string; country: string; count: number }[];
};

export const getPetitionForSignDto = z.object({
  username: z.string().trim().min(1, "Username is required"),
  slug: z.string().trim().min(1, "Slug is required"),
});

export const signPetitionDto = z.object({
  petitionId: z.string().uuid("Invalid petition ID"),
  firstName: z.string().trim().min(1, "First name is required").max(255),
  lastName: z.string().trim().min(1, "Last name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  city: z.string().max(255).optional(),
  country: z.string().max(255).optional(),
});

export type signPetitionType = z.infer<typeof signPetitionDto>;

export type GetPetitionForSignResponseType = {
  petition: {
    petitionId: string;
    title: string;
    description: string | null;
    signaturesTarget: number;
    status: string;
    username: string;
    slug: string;
  };
  totalSignatures: number;
  recentSignatures: {
    firstName: string;
    lastName: string;
    createdAt: Date;
    city: string | null;
  }[];
  hasSigned: boolean;
};
