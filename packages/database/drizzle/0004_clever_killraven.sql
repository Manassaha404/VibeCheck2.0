ALTER TYPE "public"."subscription_status" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "cancel_at_cycle_end" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "scheduled_cancellation_date" timestamp;