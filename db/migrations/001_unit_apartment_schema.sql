create extension if not exists pgcrypto;

create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists typologies (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  slug text not null,
  display_name text not null,
  rooms integer not null check (rooms between 1 and 10),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (building_id, slug)
);

create table if not exists floors (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  floor_number integer not null check (floor_number between 1 and 100),
  label text not null,
  floor_plan_image_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (building_id, floor_number)
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  floor_id uuid not null references floors(id) on delete restrict,
  typology_id uuid not null references typologies(id) on delete restrict,
  slug text not null,
  unit_code text not null check (unit_code ~ '^[A-Z]-[1-9][0-9]{2}$'),
  legacy_code text,
  floor_number integer not null check (floor_number between 1 and 100),
  unit_number text not null check (unit_number ~ '^[0-9]{2}$'),
  orientation text not null check (
    orientation in (
      'north',
      'north-east',
      'east',
      'south-east',
      'south',
      'south-west',
      'west',
      'north-west'
    )
  ),
  rooms integer not null check (rooms between 1 and 10),
  bedrooms integer not null check (bedrooms between 0 and 9),
  bathrooms integer not null check (bathrooms between 1 and 8),
  area_internal_sqm numeric(8, 2) not null check (area_internal_sqm > 0),
  area_total_sqm numeric(8, 2) not null check (area_total_sqm >= area_internal_sqm),
  terrace_sqm numeric(8, 2) not null default 0 check (terrace_sqm >= 0),
  outdoor_type text not null default 'none'
    check (outdoor_type in ('yard', 'terrace', 'balcony', 'none')),
  price_cents integer check (price_cents > 0),
  currency char(3) not null default 'EUR',
  availability_status text not null default 'available'
    check (availability_status in ('available', 'reserved', 'sold', 'hidden')),
  floor_plan_image_path text not null
    check (floor_plan_image_path ~ '^/assets/[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+\.webp$'),
  description text not null,
  is_published boolean not null default true,
  is_price_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (building_id, slug),
  unique (building_id, unit_code),
  check (price_cents is not null or is_price_visible = false)
);

create index if not exists units_finder_idx
  on units (building_id, availability_status, is_published, rooms, floor_number);

create index if not exists units_price_idx
  on units (building_id, price_cents)
  where price_cents is not null and is_price_visible = true;
