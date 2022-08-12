CREATE TABLE "public"."Order" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "customer_id" uuid, "deliver_person_phone" text NOT NULL, "customer_location" text NOT NULL, "total_price" text NOT NULL, "menus" text NOT NULL, "is_admin_accepted" boolean NOT NULL, "is_deliver_person_accepted" boolean NOT NULL, "is_delivered" boolean NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("customer_id") REFERENCES "public"."Accounts"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_Order_updated_at"
BEFORE UPDATE ON "public"."Order"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_Order_updated_at" ON "public"."Order" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
