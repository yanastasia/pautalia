alter table units
  add column if not exists kind text not null default 'apartment'
    check (kind in ('apartment', 'parking')),
  add column if not exists area_living_sqm numeric(8, 2) not null default 0,
  add column if not exists area_shared_sqm numeric(8, 2) not null default 0,
  add column if not exists common_parts_percent numeric(6, 3) not null default 0,
  add column if not exists land_percent numeric(6, 3) not null default 0,
  add column if not exists land_area_sqm numeric(8, 2) not null default 0;

update units
set
  area_living_sqm = area_internal_sqm,
  area_shared_sqm = greatest(area_total_sqm - area_internal_sqm, 0)
where kind = 'apartment'
  and area_living_sqm = 0
  and area_shared_sqm = 0;

alter table leads
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists admin_notes text;

alter table leads
  drop constraint if exists leads_status_check,
  add constraint leads_status_check check (
    status in ('new', 'contacted', 'qualified', 'viewing_booked', 'reserved', 'closed', 'archived', 'spam')
  );

create table if not exists site_settings (
  id text primary key default 'default',
  building_id uuid references buildings(id) on delete set null,
  price_visibility_mode text not null default 'per_unit'
    check (price_visibility_mode in ('visible', 'hidden', 'per_unit')),
  contact_email text,
  contact_phone text,
  booking_url text,
  announcement text,
  analytics_enabled boolean not null default true,
  cookie_consent_mode text not null default 'explicit',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legal_pages (
  id text primary key,
  building_id uuid references buildings(id) on delete set null,
  slug text not null,
  locale text not null default 'bg',
  title text not null,
  body text not null,
  is_published boolean not null default true,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create table if not exists admin_users (
  id text primary key,
  username text not null unique,
  password_hash text not null,
  role text not null default 'super_admin',
  totp_secret text,
  totp_enabled boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists units_kind_status_idx on units (building_id, kind, availability_status, is_published);
create index if not exists legal_pages_published_slug_idx on legal_pages (is_published, slug);

