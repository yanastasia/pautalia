alter table "Event"
  add column if not exists "referrer" text,
  add column if not exists "source" text,
  add column if not exists "medium" text,
  add column if not exists "campaign" text,
  add column if not exists "term" text,
  add column if not exists "content" text,
  add column if not exists "deviceType" text,
  add column if not exists "durationMs" integer,
  add column if not exists "visitorIdHash" text,
  add column if not exists "sessionIdHash" text;

create index if not exists "Event_visitorIdHash_idx" on "Event" ("visitorIdHash");
create index if not exists "Event_sessionIdHash_idx" on "Event" ("sessionIdHash");
