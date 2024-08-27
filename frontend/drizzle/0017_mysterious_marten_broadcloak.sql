CREATE TABLE IF NOT EXISTS "stripe_session" (
	"session_id" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"expired" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan" varchar(255) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_subscription" varchar(255);