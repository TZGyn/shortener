ALTER TABLE "user" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "stripe_subscription";