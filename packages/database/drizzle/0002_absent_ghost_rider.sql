ALTER TABLE "tags" DROP CONSTRAINT "tags_slug_unique";--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DEFAULT 'draft'::text;--> statement-breakpoint
DROP TYPE "public"."poll_status";--> statement-breakpoint
CREATE TYPE "public"."poll_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."poll_status";--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "status" SET DATA TYPE "public"."poll_status" USING "status"::"public"."poll_status";--> statement-breakpoint
DROP INDEX "tag_slug_idx";--> statement-breakpoint
ALTER TABLE "poll_questions" DROP COLUMN "order_index";--> statement-breakpoint
ALTER TABLE "tags" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_text_unique" UNIQUE("text");