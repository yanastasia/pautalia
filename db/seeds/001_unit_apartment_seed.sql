insert into buildings (id, slug, display_name, status)
values (
  '550e8400-e29b-41d4-a716-446655440000',
  'building-a',
  'Building A',
  'published'
)
on conflict (id) do update
set slug = excluded.slug,
  display_name = excluded.display_name,
  status = excluded.status;

insert into typologies (id, building_id, slug, display_name, rooms, description)
values
  (
    '550e8400-e29b-41d4-a716-446655441002',
    '550e8400-e29b-41d4-a716-446655440000',
    'two-room',
    'Two-room apartment',
    2,
    'One-bedroom apartment typology for compact homes.'
  ),
  (
    '550e8400-e29b-41d4-a716-446655441003',
    '550e8400-e29b-41d4-a716-446655440000',
    'three-room',
    'Three-room apartment',
    3,
    'Two-bedroom apartment typology for family homes.'
  )
on conflict (id) do update
set slug = excluded.slug,
  display_name = excluded.display_name,
  rooms = excluded.rooms,
  description = excluded.description;

insert into floors (id, building_id, floor_number, label, floor_plan_image_path)
values
  (
    '550e8400-e29b-41d4-a716-446655440101',
    '550e8400-e29b-41d4-a716-446655440000',
    1,
    'Garden Residences',
    '/assets/building-a/floorplans/floor-01.webp'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655440000',
    2,
    'Mid-Level Collection',
    '/assets/building-a/floorplans/floor-02.webp'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440104',
    '550e8400-e29b-41d4-a716-446655440000',
    4,
    'Top Floor Collection',
    '/assets/building-a/floorplans/floor-04.webp'
  )
on conflict (id) do update
set label = excluded.label,
  floor_plan_image_path = excluded.floor_plan_image_path;

insert into units (
  id,
  building_id,
  floor_id,
  typology_id,
  slug,
  unit_code,
  legacy_code,
  floor_number,
  unit_number,
  orientation,
  rooms,
  bedrooms,
  bathrooms,
  area_internal_sqm,
  area_total_sqm,
  terrace_sqm,
  outdoor_type,
  price_cents,
  currency,
  availability_status,
  floor_plan_image_path,
  description,
  is_published,
  is_price_visible
)
values
  (
    '3d6f0a20-8a25-4e2f-9bbf-66e7de4f0101',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440101',
    '550e8400-e29b-41d4-a716-446655441003',
    'a-101',
    'A-101',
    'AP.01',
    1,
    '01',
    'south-east',
    3,
    2,
    1,
    66.23,
    66.23,
    0,
    'yard',
    12342300,
    'EUR',
    'available',
    '/assets/building-a/three-room/floor-plan.webp',
    'Ground-floor three-room apartment with two bedrooms and a private yard.',
    true,
    false
  ),
  (
    '3d6f0a20-8a25-4e2f-9bbf-66e7de4f0204',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655441003',
    'a-204',
    'A-204',
    'AP.08',
    2,
    '04',
    'south-west',
    3,
    2,
    1,
    76.6,
    80.86,
    4.26,
    'balcony',
    15321200,
    'EUR',
    'available',
    '/assets/building-a/three-room/floor-plan.webp',
    'Second-floor three-room apartment with two bedrooms and a balcony.',
    true,
    true
  ),
  (
    '3d6f0a20-8a25-4e2f-9bbf-66e7de4f0401',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440104',
    '550e8400-e29b-41d4-a716-446655441003',
    'a-401',
    'A-401',
    'AP.13',
    4,
    '01',
    'south-east',
    3,
    2,
    1,
    125.39,
    157.65,
    32.26,
    'terrace',
    null,
    'EUR',
    'available',
    '/assets/building-a/three-room/floor-plan.webp',
    'Top-floor three-room apartment with two bedrooms and a panoramic terrace.',
    true,
    false
  )
on conflict (id) do update
set slug = excluded.slug,
  unit_code = excluded.unit_code,
  legacy_code = excluded.legacy_code,
  availability_status = excluded.availability_status,
  price_cents = excluded.price_cents,
  is_price_visible = excluded.is_price_visible;
