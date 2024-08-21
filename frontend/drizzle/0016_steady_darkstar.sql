ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "google_id" varchar(255);