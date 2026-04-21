# Unit/Apartment Data Model

This milestone defines the canonical inventory shape before wiring CMS-managed UI.
Runtime Payload and `pg` integration should reuse these fields rather than inventing
new names.

## Core Tables

- `buildings`: root project/building record.
- `typologies`: apartment type per building, with `building_id uuid not null`.
- `floors`: floor metadata per building, with `building_id uuid not null`.
- `units`: apartment inventory, with `building_id uuid not null`, `floor_id`, and `typology_id`.

Every inventory child table is building-scoped so the schema can support multiple
buildings without a future migration.

## Required Unit Fields

- `id`: UUID primary key.
- `unit_code`: public code using `[BUILDING_LETTER]-[FLOOR][UNIT]`, for example `A-204`.
- `floor_number`: integer floor filter and display value.
- `orientation`: one of the cardinal/intercardinal orientations.
- `rooms`, `bedrooms`, `bathrooms`: apartment composition.
- `area_internal_sqm`, `area_total_sqm`, `terrace_sqm`: sqm area fields.
- `price_cents`, `currency`, `is_price_visible`: price display contract.
- `availability_status`: `available`, `reserved`, `sold`, or `hidden`.
- `floor_plan_image_path`: canonical asset path.
- `description`: CMS-editable sales description.

## Asset Convention

Unit imagery follows:

```text
/assets/[building-slug]/[typology-slug]/[room-name].webp
```

Example:

```text
/assets/building-a/three-room/floor-plan.webp
```

## Payload Mapping

Payload collection slug should be `units`. Use relationship fields for `building`,
`floor`, and `typology`; mirror the SQL constraints in admin validation; keep status
and orientation as select fields. Changes in this collection should trigger:

```text
POST /api/webhooks/payload
```

## Migration Notes

1. Apply `db/migrations/001_unit_apartment_schema.sql`.
2. Seed development data with `db/seeds/001_unit_apartment_seed.sql`.
3. Add `pg` and Payload runtime dependencies only after approval.
4. Replace the current static/Prisma inventory reader with `pg` queries behind the
   existing public API response shape.
