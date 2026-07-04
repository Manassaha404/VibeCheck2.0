CREATE TABLE "quizzes" (
	"quiz_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "form_status" DEFAULT 'active' NOT NULL,
	"password_needed" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"join_code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"question_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"order_index" integer NOT NULL,
	"text" varchar(1000) NOT NULL,
	"options" jsonb,
	"accepted_answers" varchar(1000),
	"is_text_answer" boolean DEFAULT false NOT NULL,
	"allow_multiple_correct" boolean DEFAULT false NOT NULL,
	"media_url" varchar(1000),
	"time_limit_secs" integer DEFAULT 30 NOT NULL,
	"points" integer DEFAULT 1000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quiz_user_id_idx" ON "quizzes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_status_idx" ON "quizzes" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_join_code_idx" ON "quizzes" USING btree ("join_code");--> statement-breakpoint
CREATE INDEX "quiz_question_quiz_id_idx" ON "quiz_questions" USING btree ("quiz_id");--> statement-breakpoint
CREATE UNIQUE INDEX "quiz_question_quiz_id_order_index_idx" ON "quiz_questions" USING btree ("quiz_id","order_index");