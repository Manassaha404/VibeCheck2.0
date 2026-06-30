import { inngest } from "./client";
import TagService from "../tag";
import db, { eq } from "@repo/database";
import {
  tags as tagsModel,
  petitionTags,
  petitions,
} from "@repo/database/models";
const createPetition = inngest.createFunction(
  {
    id: "create-petition",
    triggers: [
      {
        event: "create/petition",
      },
    ],
  },
  async ({ event, step }) => {
    const { petitionId, tagsArray } = event.data;

    await step.run("sync-petition-tags", async () => {
      await TagService.syncPetitionTags(petitionId, tagsArray);
    });
  },
);

const petitionView = inngest.createFunction(
  {
    id: "petition-view",
    triggers: [
      {
        event: "petition/view",
      },
    ],
  },
  async ({ event, step }) => {
    const { petitionId, userId} = event.data;
    
    const [tagText = [], tagId = []] = (await step.run("get-petition-tags", async () => {
      const results = await db
        .select({text:tagsModel.text, id:tagsModel.tagId})
        .from(petitionTags)
        .innerJoin(tagsModel, eq(tagsModel.tagId, petitionTags.tagId))
        .where(eq(petitionTags.petitionId, petitionId));
      return [results.map((r) => r.text), results.map((r) => r.id)];
    })) || [[], []];

    await step.run("increment-tags-score", async () => {
      if (tagText && tagText.length > 0) {
        await Promise.all(
          tagText.map((text) => TagService.incrementTagScoreForView(text)),
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


const signPetition = inngest.createFunction({
    id: "petition-sign",
    triggers: [
      {
        event: "petition/sign",
      },
    ],
  },
  async ({ event, step }) => {
    const { petitionId, userId} = event.data;
   const [tagText = [], tagId = []] = (await step.run("get-petition-tags", async () => {
      const results = await db
        .select({text:tagsModel.text, id:tagsModel.tagId})
        .from(petitionTags)
        .innerJoin(tagsModel, eq(tagsModel.tagId, petitionTags.tagId))
        .where(eq(petitionTags.petitionId, petitionId));
      return [results.map((r) => r.text), results.map((r) => r.id)];
    })) || [[], []];
    await step.run("increment-tags-score", async () => {
      if (tagText && tagText.length > 0) {
        await Promise.all(
          tagText.map((text) => TagService.incrementTagScoreForSubmit(text)),
        );
      }
    });
    if (userId && tagId && tagId.length > 0) {
        await step.run("user-tag-preferences-increase", async () => {
            await TagService.incrementUserTagPreference(userId, tagId, "submit");
        });
    }
  },)
const petitionFunctions = [createPetition,petitionView,signPetition];
export default petitionFunctions;
