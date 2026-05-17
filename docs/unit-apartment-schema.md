# Unit/Apartment Data Model

This milestone defines the canonical M3 inventory shape for CMS-managed editing,
public apartment pages, admin inventory, CRM interest tracking, and exports.
Apartments and parking spaces share one sellable inventory model, separated by
`kind`.

## Core Tables

- `buildings`: root project/building record.
- `typologies`: apartment type per building, with `building_id uuid not null`.
- `floors`: floor metadata per building, with `building_id uuid not null`.
- `units`: sellable apartment and parking inventory, with `building_id uuid not null`, optional `floor_id`, optional `typology_id`, and `kind`.

Every inventory child table is building-scoped so the schema can support multiple
buildings without a future migration.

## Required Shared Unit Fields

- `id`: UUID primary key.
- `kind`: `apartment` or `parking`.
- `unit_code`: apartment code using `[BUILDING_LETTER]-[FLOOR][UNIT]`, for example `A-204`; parking code using `A-P01` through `A-P14`.
- `floor_number`: integer floor filter and display value. Parking uses `0` unless real level data is supplied.
- `price_cents`, `currency`, `is_price_visible`: per-unit price display contract.
- `availability_status`: `available`, `reserved`, `sold`, or `hidden`.
- `is_published`: controls public/API visibility.
- `description`: CMS-editable sales/admin description.

## Apartment Fields

- `orientation`: one of the cardinal/intercardinal orientations.
- `rooms`, `bedrooms`, `bathrooms`: apartment composition.
- `area.living`: F1 living area.
- `area.shared`: F3 shared/common parts.
- `area.terrace`: optional F2 terrace area, displayed separately.
- `area.total`: must equal `area.living + area.shared`; terrace is not added again.
- `ownership.commonPartsPercent`: apartment common-parts percentage.
- `ownership.landPercent`: apartment land percentage.
- `ownership.landArea`: apartment land area.
- `floor_plan_image_path`: canonical asset path.

Legacy fields such as `areaInternalSqm`, `areaTotalSqm`, and `terraceSqm` may
remain in seed/migration compatibility code, but public APIs should return the
new nested `area` and `ownership` objects.

## Parking Fields

Parking spaces are units with:

- `kind`: `parking`.
- `code`: `A-P01` through `A-P14`.
- `floor`: `0` unless a real parking level is provided.
- nullable price.
- `currency`: `EUR`.
- standard status/published/price visibility flags.

Parking appears in admin inventory and CRM/export data. It does not appear in the
public apartment finder unless a future public parking view is added.

## Asset Convention

Unit imagery follows:

```text
/assets/buildings/[building-folder]/apartments/[unit-plan].png
```

Example:

```text
/assets/buildings/residence/apartments/A-A-AP.08.png
```

## Price Visibility

Global price display is controlled by `SiteSettings.priceVisibilityMode`:

- `visible`: public pages show unit prices when present.
- `hidden`: public pages show "Price on request".
- `per_unit`: public pages follow each unit's `isPriceVisible` flag.

Payload changes to this setting must revalidate public apartment, unit, and
building pages.

## Payload Mapping

The Payload collection slug is `units`. Use relationship fields for `building`,
`floor`, and `typology`; mirror the SQL constraints in admin validation; keep
status, kind, currency, and orientation as select fields. Changes in this
collection should trigger:

```text
POST /api/webhooks/payload
```

## Migration Notes

1. Apply `db/migrations/001_unit_apartment_schema.sql`.
2. Seed development data with `db/seeds/001_unit_apartment_seed.sql`.
3. Apply `db/migrations/002_m3_operations_schema.sql`.
4. Apply `db/migrations/003_privacy_first_analytics.sql`.
5. Seed Prisma with the 14 `A-P01` through `A-P14` parking units.
6. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

## Official Area and Ownership Values

The canonical official table values live in
`src/data/official-unit-values.ts`.

Apartment mapping:

- `площ F1` -> `area.living`
- `площ F3` -> `area.shared`
- `площ F2` -> `area.terrace`
- `F1+F3` -> `area.total`
- `К1ич. идеални части... %` -> `ownership.commonPartsPercent`
- `К2ич % от парцела` -> `ownership.landPercent`
- `площ F4` -> `ownership.landArea`

Parking mapping:

- parking area fields stay `0`
- `К2ич % от парцела` -> `landPercent`
- `площ F4` -> `landAreaSqm`

Courtyard `K5/F5` values are intentionally not stored yet because the current
model has no dedicated courtyard ownership fields.

## Admin and Analytics Relationship

Unit records connect operational and marketing workflows:

- leads can reference apartment or parking units
- admin inventory shows both apartment and parking units
- public apartment finder shows apartments only
- event metrics reference units through `Event.unitId`
- `/admin/units/[id]` combines status, lead count, and unit metrics
