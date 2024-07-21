CREATE TABLE IF NOT EXISTS "email_verification_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;