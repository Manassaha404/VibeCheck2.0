import { z } from "zod";

export const petitionDraftSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  targetAuthority: z.string().min(1, "Target Authority is required").max(100, "Target Authority is too long"),
  goal: z.number().min(1, "Goal must be at least 1").max(100000000, "Goal is too high"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
  visibility: z.enum(["public", "unlisted"]).default("public"),
});

export type PetitionDraftFormInput = z.input<typeof petitionDraftSchema>;
export type PetitionDraftFormOutput = z.output<typeof petitionDraftSchema>;
export type PetitionDraftFormValues = z.infer<typeof petitionDraftSchema>;
