alter table "public"."Accounts" add constraint "Accounts_password_key" unique (password);
alter table "public"."Accounts" alter column "password" drop not null;
alter table "public"."Accounts" add column "password" text;
