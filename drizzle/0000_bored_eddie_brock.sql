CREATE TABLE IF NOT EXISTS "shortener" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"shortener_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"country_code" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL
);
