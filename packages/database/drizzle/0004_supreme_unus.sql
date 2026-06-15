CREATE TYPE "public"."agent_conversation_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."agent_message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TABLE "agent_conversations" (
	"conversation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_id" uuid,
	"status" "agent_conversation_status" DEFAULT 'pending' NOT NULL,
	"is_multi_turn" boolean DEFAULT false NOT NULL,
	"turn_count" integer DEFAULT 0 NOT NULL,
	"title" varchar(255),
	"error_message" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_messages" (
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"order_index" integer NOT NULL,
	"role" "agent_message_role" NOT NULL,
	"content" text NOT NULL,
	"structured_output" jsonb,
	"guardrail_result" jsonb,
	"was_blocked" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "form_slug_idx";--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "helper_text" varchar(255);--> statement-breakpoint
ALTER TABLE "agent_conversations" ADD CONSTRAINT "agent_conversations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_conversations" ADD CONSTRAINT "agent_conversations_form_id_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_conversation_id_agent_conversations_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."agent_conversations"("conversation_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_conv_user_id_idx" ON "agent_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "agent_conv_form_id_idx" ON "agent_conversations" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "agent_conv_status_idx" ON "agent_conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "agent_conv_user_status_idx" ON "agent_conversations" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "agent_msg_conversation_id_idx" ON "agent_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "agent_msg_conv_order_idx" ON "agent_messages" USING btree ("conversation_id","order_index");--> statement-breakpoint
CREATE INDEX "agent_msg_role_idx" ON "agent_messages" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "form_slug_idx" ON "forms" USING btree ("slug","user_id");