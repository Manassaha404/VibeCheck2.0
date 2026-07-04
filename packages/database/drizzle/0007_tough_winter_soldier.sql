CREATE TYPE "public"."quiz_status" AS ENUM('active', 'archived');--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "status" SET DATA TYPE "public"."quiz_status" USING "status"::text::"public"."quiz_status";--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "status" SET DEFAULT 'active';