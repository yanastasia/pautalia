import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "public"."enum_admin_users_role" AS ENUM('super_admin', 'sales_admin', 'content_admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_buildings_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_buildings_price_visibility_mode" AS ENUM('visible', 'hidden', 'per_unit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_units_kind" AS ENUM('apartment', 'parking');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_units_status" AS ENUM('available', 'reserved', 'sold', 'hidden');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'viewing_booked', 'reserved', 'closed', 'archived', 'spam');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_posts_category" AS ENUM('news', 'construction_update', 'announcement', 'press');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_legal_pages_slug" AS ENUM('privacy', 'cookies', 'terms');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_legal_pages_locale" AS ENUM('bg', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_site_settings_price_visibility_mode" AS ENUM('visible', 'hidden', 'per_unit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."enum_site_settings_cookie_consent_mode" AS ENUM('explicit', 'cookieless_no_consent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "enum_admin_users_role" NOT NULL,
	"totp_enabled" boolean,
	"totp_secret" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"status" "enum_buildings_status",
	"display_order" numeric,
	"priceVisibilityMode" "enum_buildings_price_visibility_mode",
	"short_description" varchar,
	"full_description" varchar,
	"location_content" varchar,
	"contact_content" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "floors" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" numeric NOT NULL,
	"label" varchar NOT NULL,
	"map_metadata" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "floors_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"buildings_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "typologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"label" varchar NOT NULL,
	"rooms" numeric NOT NULL,
	"description" varchar,
	"future_twin_metadata" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "typologies_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"buildings_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "units_features" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar
);

CREATE TABLE IF NOT EXISTS "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "enum_units_kind" NOT NULL,
	"code" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"floor_number" numeric NOT NULL,
	"rooms" numeric,
	"bedrooms" numeric,
	"bathrooms" numeric,
	"area_living" numeric,
	"area_shared" numeric,
	"area_terrace" numeric,
	"area_total" numeric,
	"common_parts_percent" numeric,
	"land_percent" numeric,
	"land_area" numeric,
	"orientation" varchar,
	"price" numeric,
	"currency" varchar,
	"status" "enum_units_status",
	"is_published" boolean,
	"is_price_visible" boolean,
	"internal_notes" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "units_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"buildings_id" integer,
	"floors_id" integer,
	"typologies_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"message" varchar,
	"status" "enum_leads_status",
	"source_page_url" varchar,
	"referrer" varchar,
	"utm_source" varchar,
	"utm_medium" varchar,
	"utm_campaign" varchar,
	"utm_term" varchar,
	"utm_content" varchar,
	"admin_notes" varchar,
	"consent_timestamp" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "leads_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"units_id" integer,
	"buildings_id" integer
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar,
	"sizes_hero_url" varchar,
	"sizes_hero_width" numeric,
	"sizes_hero_height" numeric,
	"sizes_hero_mime_type" varchar,
	"sizes_hero_filesize" numeric,
	"sizes_hero_filename" varchar
);

CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"body" varchar,
	"is_published" boolean,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"status" "enum_posts_status" NOT NULL,
	"category" "enum_posts_category" NOT NULL,
	"published_at" timestamp(3) with time zone,
	"video_url" varchar,
	"translations_bg_title" varchar NOT NULL,
	"translations_bg_excerpt" varchar NOT NULL,
	"translations_bg_body" varchar NOT NULL,
	"translations_bg_seo_title" varchar,
	"translations_bg_seo_description" varchar,
	"translations_en_title" varchar NOT NULL,
	"translations_en_excerpt" varchar NOT NULL,
	"translations_en_body" varchar NOT NULL,
	"translations_en_seo_title" varchar,
	"translations_en_seo_description" varchar,
	"internal_notes" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"buildings_id" integer,
	"media_id" integer
);

CREATE TABLE IF NOT EXISTS "legal_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" "enum_legal_pages_slug" NOT NULL,
	"locale" "enum_legal_pages_locale" NOT NULL,
	"title" varchar NOT NULL,
	"body" varchar NOT NULL,
	"reviewed_at" timestamp(3) with time zone,
	"is_published" boolean,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"priceVisibilityMode" "enum_site_settings_price_visibility_mode" NOT NULL,
	"contact_email" varchar,
	"contact_phone" varchar,
	"booking_url" varchar,
	"announcement" varchar,
	"analytics_enabled" boolean,
	"cookieConsentMode" "enum_site_settings_cookie_consent_mode",
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"admin_users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "floors_rels" ADD CONSTRAINT "floors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."floors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "floors_rels" ADD CONSTRAINT "floors_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "floors_rels" ADD CONSTRAINT "floors_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "typologies_rels" ADD CONSTRAINT "typologies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."typologies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "typologies_rels" ADD CONSTRAINT "typologies_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "typologies_rels" ADD CONSTRAINT "typologies_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_features" ADD CONSTRAINT "units_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_rels" ADD CONSTRAINT "units_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_rels" ADD CONSTRAINT "units_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_rels" ADD CONSTRAINT "units_rels_floors_fk" FOREIGN KEY ("floors_id") REFERENCES "public"."floors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_rels" ADD CONSTRAINT "units_rels_typologies_fk" FOREIGN KEY ("typologies_id") REFERENCES "public"."typologies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "units_rels" ADD CONSTRAINT "units_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_units_fk" FOREIGN KEY ("units_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_buildings_fk" FOREIGN KEY ("buildings_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "admin_users_created_at_idx" ON "admin_users" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_idx" ON "admin_users" USING btree ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "buildings_slug_idx" ON "buildings" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "buildings_created_at_idx" ON "buildings" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "floors_created_at_idx" ON "floors" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "floors_rels_order_idx" ON "floors_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "floors_rels_parent_idx" ON "floors_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "floors_rels_path_idx" ON "floors_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "floors_rels_buildings_id_idx" ON "floors_rels" USING btree ("buildings_id");
CREATE INDEX IF NOT EXISTS "floors_rels_media_id_idx" ON "floors_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "typologies_created_at_idx" ON "typologies" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "typologies_rels_order_idx" ON "typologies_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "typologies_rels_parent_idx" ON "typologies_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "typologies_rels_path_idx" ON "typologies_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "typologies_rels_buildings_id_idx" ON "typologies_rels" USING btree ("buildings_id");
CREATE INDEX IF NOT EXISTS "typologies_rels_media_id_idx" ON "typologies_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "units_features_order_idx" ON "units_features" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "units_features_parent_id_idx" ON "units_features" USING btree ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "units_code_idx" ON "units" USING btree ("code");
CREATE UNIQUE INDEX IF NOT EXISTS "units_slug_idx" ON "units" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "units_created_at_idx" ON "units" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "units_rels_order_idx" ON "units_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "units_rels_parent_idx" ON "units_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "units_rels_path_idx" ON "units_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "units_rels_buildings_id_idx" ON "units_rels" USING btree ("buildings_id");
CREATE INDEX IF NOT EXISTS "units_rels_floors_id_idx" ON "units_rels" USING btree ("floors_id");
CREATE INDEX IF NOT EXISTS "units_rels_typologies_id_idx" ON "units_rels" USING btree ("typologies_id");
CREATE INDEX IF NOT EXISTS "units_rels_media_id_idx" ON "units_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "leads_rels_units_id_idx" ON "leads_rels" USING btree ("units_id");
CREATE INDEX IF NOT EXISTS "leads_rels_buildings_id_idx" ON "leads_rels" USING btree ("buildings_id");
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
CREATE INDEX IF NOT EXISTS "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "posts_rels_buildings_id_idx" ON "posts_rels" USING btree ("buildings_id");
CREATE INDEX IF NOT EXISTS "posts_rels_media_id_idx" ON "posts_rels" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_admin_users_id_idx" ON "payload_preferences_rels" USING btree ("admin_users_id");
CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "admin_users";
DROP TABLE "buildings";
DROP TABLE "floors";
DROP TABLE "floors_rels";
DROP TABLE "typologies";
DROP TABLE "typologies_rels";
DROP TABLE "units_features";
DROP TABLE "units";
DROP TABLE "units_rels";
DROP TABLE "leads";
DROP TABLE "leads_rels";
DROP TABLE "media";
DROP TABLE "pages";
DROP TABLE "posts";
DROP TABLE "posts_rels";
DROP TABLE "legal_pages";
DROP TABLE "site_settings";
DROP TABLE "payload_preferences";
DROP TABLE "payload_preferences_rels";
DROP TABLE "payload_migrations";`);

};
