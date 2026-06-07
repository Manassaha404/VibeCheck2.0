import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { pollQuestions } from "./poll-questions";
import { pollOptions } from "./poll-options";
import { users } from "./users";

export const pollVotes = pgTable("poll_votes", {
  pollVoteId: uuid("poll_vote_id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => pollQuestions.pollQuestionId, { onDelete: "cascade" }),
  optionId: uuid("option_id")
    .notNull()
    .references(() => pollOptions.pollOptionId, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.userId, {
    onDelete: "set null",
  }),
  guestToken: uuid("guest_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (pollVotes) => [
  index("poll_vote_question_id_idx").on(pollVotes.questionId),
  index("poll_vote_option_id_idx").on(pollVotes.optionId),
  index("poll_vote_user_id_idx").on(pollVotes.userId),
  index("poll_vote_guest_token_idx").on(pollVotes.guestToken),
]);
