-- Drop old unused agent tables (never applied to prod, were just schema stubs)
DROP TABLE IF EXISTS "agent_messages";
DROP TABLE IF EXISTS "agent_conversations";

--> statement-breakpoint

-- Create the real form-building agent conversation history table
CREATE TABLE "form_building_agent_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_id" uuid NOT NULL,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint

ALTER TABLE "form_building_agent_conversations"
  ADD CONSTRAINT "form_building_agent_conversations_user_id_users_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint

ALTER TABLE "form_building_agent_conversations"
  ADD CONSTRAINT "form_building_agent_conversations_form_id_forms_form_id_fk"
  FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint

CREATE UNIQUE INDEX "agent_conv_user_form_idx"
  ON "form_building_agent_conversations" USING btree ("user_id","form_id");

--> statement-breakpoint

CREATE INDEX "agent_conv_user_idx"
  ON "form_building_agent_conversations" USING btree ("user_id");
