CREATE TYPE "public"."user_plan" AS ENUM('free', 'pro', 'premium');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('draft', 'active', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('short_text', 'long_text', 'number', 'email', 'phone', 'date', 'select', 'multi_select', 'radio', 'checkbox', 'file', 'rating', 'scale', 'mood');--> statement-breakpoint
CREATE TYPE "public"."poll_status" AS ENUM('draft', 'active', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."petition_status" AS ENUM('draft', 'active', 'closed', 'archived');--> statement-breakpoint
CREATE TABLE "auths" (
	"auth_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"password" varchar(255),
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"plan" "user_plan" DEFAULT 'free' NOT NULL,
	"google_account_id" varchar(255),
	"google_refresh_token" varchar(512),
	"google_drive_refresh_token" varchar(512),
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp,
	"is_verified" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"form_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "form_status" DEFAULT 'draft' NOT NULL,
	"allow_response_edit" boolean DEFAULT false NOT NULL,
	"response_limit" integer,
	"password_needed" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"google_drive_folder_id" varchar(255),
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"field_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"order_index" integer NOT NULL,
	"type" "field_type" NOT NULL,
	"label" varchar(255) NOT NULL,
	"placeholder" varchar(255),
	"is_required" boolean DEFAULT false NOT NULL,
	"helper_text" varchar(255),
	"options" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"response_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"guest_token" uuid,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_answers" (
	"answer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field_id" uuid NOT NULL,
	"response_id" uuid NOT NULL,
	"value" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"poll_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "poll_status" DEFAULT 'draft' NOT NULL,
	"is_comments_allowed" boolean DEFAULT true NOT NULL,
	"is_multiple_option_vote_allowed" boolean DEFAULT false NOT NULL,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_questions" (
	"poll_question_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"text" varchar(500) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_options" (
	"poll_option_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"order_index" integer NOT NULL,
	"text" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_views" (
	"poll_view_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"user_id" uuid,
	"guest_token" uuid,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_votes" (
	"poll_vote_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"user_id" uuid,
	"guest_token" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_comments" (
	"poll_comment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"user_id" uuid,
	"guest_token" uuid,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "petitions" (
	"petition_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"signatures_target" integer NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"status" "petition_status" DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "petition_signatures" (
	"petition_signature_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"petition_id" uuid NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"user_id" uuid,
	"city" varchar(255),
	"country" varchar(255),
	"guest_token" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"tag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "poll_tags" (
	"poll_tag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "petition_tags" (
	"petition_tag_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"petition_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_tag_preferences" (
	"user_tag_preference_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_building_agent_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_id" uuid NOT NULL,
	"history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saves" (
	"save_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_id" uuid,
	"petition_id" uuid,
	"poll_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_field_id_form_fields_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("field_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_response_id_form_responses_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."form_responses"("response_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_questions" ADD CONSTRAINT "poll_questions_poll_id_polls_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_question_id_poll_questions_poll_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."poll_questions"("poll_question_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_views" ADD CONSTRAINT "poll_views_poll_id_polls_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_views" ADD CONSTRAINT "poll_views_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_question_id_poll_questions_poll_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."poll_questions"("poll_question_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_option_id_poll_options_poll_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."poll_options"("poll_option_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_comments" ADD CONSTRAINT "poll_comments_poll_id_polls_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_comments" ADD CONSTRAINT "poll_comments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petitions" ADD CONSTRAINT "petitions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petition_signatures" ADD CONSTRAINT "petition_signatures_petition_id_petitions_petition_id_fk" FOREIGN KEY ("petition_id") REFERENCES "public"."petitions"("petition_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petition_signatures" ADD CONSTRAINT "petition_signatures_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_tags" ADD CONSTRAINT "poll_tags_poll_id_polls_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_tags" ADD CONSTRAINT "poll_tags_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petition_tags" ADD CONSTRAINT "petition_tags_petition_id_petitions_petition_id_fk" FOREIGN KEY ("petition_id") REFERENCES "public"."petitions"("petition_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "petition_tags" ADD CONSTRAINT "petition_tags_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_preferences" ADD CONSTRAINT "user_tag_preferences_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_preferences" ADD CONSTRAINT "user_tag_preferences_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_building_agent_conversations" ADD CONSTRAINT "form_building_agent_conversations_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_building_agent_conversations" ADD CONSTRAINT "form_building_agent_conversations_form_id_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_form_id_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("form_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_petition_id_petitions_petition_id_fk" FOREIGN KEY ("petition_id") REFERENCES "public"."petitions"("petition_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves" ADD CONSTRAINT "saves_poll_id_polls_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_user_id_idx" ON "auths" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "form_user_id_idx" ON "forms" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "form_slug_idx" ON "forms" USING btree ("slug","user_id");--> statement-breakpoint
CREATE INDEX "form_status_idx" ON "forms" USING btree ("status");--> statement-breakpoint
CREATE INDEX "form_field_form_id_idx" ON "form_fields" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "form_field_form_id_order_idx" ON "form_fields" USING btree ("form_id","order_index");--> statement-breakpoint
CREATE INDEX "form_response_form_id_idx" ON "form_responses" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "form_response_user_id_idx" ON "form_responses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "form_response_guest_token_idx" ON "form_responses" USING btree ("guest_token");--> statement-breakpoint
CREATE INDEX "form_answer_field_id_idx" ON "form_answers" USING btree ("field_id");--> statement-breakpoint
CREATE INDEX "form_answer_response_id_idx" ON "form_answers" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "poll_user_id_idx" ON "polls" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "poll_question_poll_id_idx" ON "poll_questions" USING btree ("poll_id");--> statement-breakpoint
CREATE INDEX "poll_option_question_id_idx" ON "poll_options" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "poll_view_poll_id_idx" ON "poll_views" USING btree ("poll_id");--> statement-breakpoint
CREATE INDEX "poll_view_user_id_idx" ON "poll_views" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "poll_view_guest_token_idx" ON "poll_views" USING btree ("guest_token");--> statement-breakpoint
CREATE INDEX "poll_vote_question_id_idx" ON "poll_votes" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "poll_vote_option_id_idx" ON "poll_votes" USING btree ("option_id");--> statement-breakpoint
CREATE INDEX "poll_vote_user_id_idx" ON "poll_votes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "poll_vote_guest_token_idx" ON "poll_votes" USING btree ("guest_token");--> statement-breakpoint
CREATE INDEX "poll_comment_poll_id_idx" ON "poll_comments" USING btree ("poll_id");--> statement-breakpoint
CREATE INDEX "petition_user_id_idx" ON "petitions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "petition_signature_petition_id_idx" ON "petition_signatures" USING btree ("petition_id");--> statement-breakpoint
CREATE INDEX "petition_signature_user_id_idx" ON "petition_signatures" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "petition_signature_guest_token_idx" ON "petition_signatures" USING btree ("guest_token");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "poll_tag_poll_id_tag_id_idx" ON "poll_tags" USING btree ("poll_id","tag_id");--> statement-breakpoint
CREATE INDEX "poll_tag_tag_id_idx" ON "poll_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "petition_tag_petition_id_tag_id_idx" ON "petition_tags" USING btree ("petition_id","tag_id");--> statement-breakpoint
CREATE INDEX "petition_tag_tag_id_idx" ON "petition_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_tag_pref_user_id_tag_id_idx" ON "user_tag_preferences" USING btree ("user_id","tag_id");--> statement-breakpoint
CREATE INDEX "user_tag_pref_user_id_idx" ON "user_tag_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_tag_pref_tag_id_idx" ON "user_tag_preferences" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "agent_conv_user_form_idx" ON "form_building_agent_conversations" USING btree ("user_id","form_id");--> statement-breakpoint
CREATE INDEX "agent_conv_user_idx" ON "form_building_agent_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "save_user_id_idx" ON "saves" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "save_user_form_idx" ON "saves" USING btree ("user_id","form_id");--> statement-breakpoint
CREATE UNIQUE INDEX "save_user_petition_idx" ON "saves" USING btree ("user_id","petition_id");--> statement-breakpoint
CREATE UNIQUE INDEX "save_user_poll_idx" ON "saves" USING btree ("user_id","poll_id");