alter table "Event"
  add column if not exists "country" text,
  add column if not exists "region" text,
  add column if not exists "city" text;

create index if not exists "Event_country_idx" on "Event" ("country");
create index if not exists "Event_city_idx" on "Event" ("city");
