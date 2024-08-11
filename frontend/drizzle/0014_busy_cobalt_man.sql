ALTER TABLE "visitor" ALTER COLUMN "device_type" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "device_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "device_vendor" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "device_vendor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "os" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "os" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "browser" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "browser" SET NOT NULL;