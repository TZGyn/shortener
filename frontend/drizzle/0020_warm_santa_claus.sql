ALTER TABLE "project" ADD COLUMN "qr_corner_square_style" varchar DEFAULT 'square' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "qr_dot_style" varchar DEFAULT 'square' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qr_corner_square_style" varchar DEFAULT 'square' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qr_dot_style" varchar DEFAULT 'square' NOT NULL;