import { z } from "zod";

export const pollDraftSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Option text is required"),
      })
    )
    .min(2, "At least two options are required"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
  allowMultipleVotes: z.boolean().default(false),
  visibility: z.enum(["public", "unlisted"]).default("public"),
});

export type PollDraftFormValues = z.infer<typeof pollDraftSchema>;
