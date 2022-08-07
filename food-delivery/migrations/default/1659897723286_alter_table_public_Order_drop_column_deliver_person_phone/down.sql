alter table "public"."Order" alter column "deliver_person_phone" drop not null;
alter table "public"."Order" add column "deliver_person_phone" text;
