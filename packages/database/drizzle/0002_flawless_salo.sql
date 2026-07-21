CREATE TABLE "quiz_building_agent_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"file_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_building_agent_conversations" ADD CONSTRAINT "quiz_building_agent_conversations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_building_agent_conversations" ADD CONSTRAINT "quiz_building_agent_conversations_quiz_id_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agent_conv_user_quiz_idx" ON "quiz_building_agent_conversations" USING btree ("user_id","quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_agent_conv_user_idx" ON "quiz_building_agent_conversations" USING btree ("user_id");