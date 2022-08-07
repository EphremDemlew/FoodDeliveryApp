CREATE TABLE "public"."Accounts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "first_name" text NOT NULL, "last_name" text NOT NULL, "Phone_Number" text NOT NULL, "Balance" money, "role" text NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
