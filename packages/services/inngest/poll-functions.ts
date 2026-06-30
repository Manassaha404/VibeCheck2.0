import db, { eq } from "@repo/database";
import { inngest } from "./client";
import { pollTags, pollViews, tags as tagsModel } from "@repo/database/models";
import TagService from "../tag";

 const pollView = inngest.createFunction(
  {
    id: "poll-view",
    triggers: [
      {
        event: "poll/view",
      },
    ],
  },
  async ({ event, step }) => {
    const { pollId, userId, guestToken } = event.data;
    await step.run("add-new-view", async () => {
      await db.insert(pollViews).values({
        pollId,
        userId: userId ?? null,
        guestToken: guestToken ?? null,
      });
    });

    const [tagsList = [], tagId = []] = (await step.run("get-poll-tags", async () => {
      const results = await db
        .select({ text: tagsModel.text, id: tagsModel.tagId })
        .from(pollTags)
        .innerJoin(tagsModel, eq(tagsModel.tagId, pollTags.tagId))
        .where(eq(pollTags.pollId, pollId));
      return [results.map((r) => r.text), results.map((r) => r.id)];
    })) || [[], []];

    await step.run("increment-tags-score", async () => {
      if (tagsList && tagsList.length > 0) {
        await Promise.all(
          tagsList.map((tagText) => TagService.incrementTagScoreForView(tagText)),
        );
      }
    });

    if (userId && tagId && tagId.length > 0) {
      await step.run("user-tag-preferences-increase", async () => {
        await TagService.incrementUserTagPreference(userId, tagId, "view");
      });
    }
  },
);

 const submitPoll = inngest.createFunction(
  {
    id: "poll-submit",
    triggers: [
      {
        event: "poll/submit",
      },
    ],
  },
  async ({ event, step }) => {
    const { pollId, userId } = event.data;
    const [tagText = [], tagId = []] = (await step.run("get-poll-tags", async () => {
      const results = await db
        .select({ text: tagsModel.text, id: tagsModel.tagId })
        .from(pollTags)
        .innerJoin(tagsModel, eq(tagsModel.tagId, pollTags.tagId))
        .where(eq(pollTags.pollId, pollId));
      return [results.map((r) => r.text), results.map((r) => r.id)];
    })) || [[], []];

    await step.run("increment-tags-score", async () => {
      if (tagText && tagText.length > 0) {
        await Promise.all(
          tagText.map((text) =>
            TagService.incrementTagScoreForSubmit(text),
          ),
        );
      }
    });

    if (userId && tagId && tagId.length > 0) {
        await step.run("user-tag-preferences-increase", async () => {
            await TagService.incrementUserTagPreference(userId, tagId, "submit");
        });
    }
  },
);


const addPollTags = inngest.createFunction(
  {
    id: "poll-add-tags",
    triggers: [
      {
        event: "poll/add-tags",
      },
    ],
  },
  async ({ event, step }) => {
    const { pollId, tags } = event.data;

    await step.run("sync-poll-tags", async () => {
      await TagService.syncPollTags(pollId, tags);
    });
  }
);

const pollFunctions = [submitPoll, pollView, addPollTags];
export default pollFunctions

