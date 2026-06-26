import db, { eq } from "@repo/database";
import { inngest } from "./client";
import { pollTags, pollViews, tags as tagsModel } from "@repo/database/models";
import TagService from "../tag";

export const pollView = inngest.createFunction(
  {
    id: "poll-view",
    triggers: [
      {
        event: "poll/view",
      },
    ],
  },
  async ({ event, step }) => {
    await step.run("add-new-view", async () => {
      const { pollId, userId, guestToken } = event.data;
      await db.insert(pollViews).values({
        pollId,
        userId: userId ?? null,
        guestToken: guestToken ?? null,
      });
    });

    const tagsList = await step.run("get-poll-tags", async () => {
      const { pollId } = event.data;
      const results = await db
        .select({ text: tagsModel.text })
        .from(pollTags)
        .innerJoin(tagsModel, eq(tagsModel.tagId, pollTags.tagId))
        .where(eq(pollTags.pollId, pollId));
      return results.map(r => r.text);
    });

    await step.run("increment-tags-score", async () => {
      await Promise.all(
        tagsList.map((tagText) => TagService.incrementTagScoreForView(tagText))
      );
    });
  },
);
