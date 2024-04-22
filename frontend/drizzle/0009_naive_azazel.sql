ALTER TABLE "project" ADD COLUMN "qr_background" varchar(7) DEFAULT '#ffffff' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "qr_foreground" varchar(7) DEFAULT '#000000' NOT NULL;