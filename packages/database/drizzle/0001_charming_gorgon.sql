ALTER TYPE "public"."quiz_status" ADD VALUE 'draft';--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "status" SET DEFAULT 'draft';