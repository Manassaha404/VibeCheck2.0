ALTER TABLE "petitions" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "petitions" ADD COLUMN "target_authority" varchar(255);--> statement-breakpoint
CREATE UNIQUE INDEX "petition_user_slug_idx" ON "petitions" USING btree ("user_id","slug");