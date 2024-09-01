ALTER TABLE "project" ADD COLUMN "qr_image_base64" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qr_background" varchar(7) DEFAULT '#fff' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qr_foreground" varchar(7) DEFAULT '#000' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qr_image_base64" text;