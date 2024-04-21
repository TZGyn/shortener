ALTER TABLE "shortener" ADD COLUMN "ios" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shortener" ADD COLUMN "ios_link" varchar(255);--> statement-breakpoint
ALTER TABLE "shortener" ADD COLUMN "android" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shortener" ADD COLUMN "android_link" varchar(255);--> statement-breakpoint
ALTER TABLE "shortener" ADD CONSTRAINT "shortener_code_unique" UNIQUE("code");