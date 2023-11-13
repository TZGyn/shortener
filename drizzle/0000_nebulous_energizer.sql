CREATE TABLE IF NOT EXISTS "session" (
	"token" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shortener" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL,
	"username" varchar(255),
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"shortener_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"country_code" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL
);
