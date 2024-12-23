CREATE TABLE IF NOT EXISTS "file" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"project_id" text,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"size" bigint DEFAULT 0 NOT NULL,
	"etag" text NOT NULL,
	"created_at_epoch" bigint NOT NULL,
	"updated_at_epoch" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shortener" ADD COLUMN "is_file_upload" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shortener" ADD COLUMN "file_path" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "file_storage_usage_in_byte" bigint DEFAULT 0 NOT NULL;