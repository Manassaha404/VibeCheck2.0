ALTER TABLE "polls" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "poll_user_slug_unique_idx" ON "polls" USING btree ("user_id","slug");