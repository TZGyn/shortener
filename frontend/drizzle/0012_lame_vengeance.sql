ALTER TABLE "project" ADD COLUMN "domain_status" varchar(255) DEFAULT 'verified' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "enable_custom_domain" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_ip" varchar(255);--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_domain_id" varchar(255);