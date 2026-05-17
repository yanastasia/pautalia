# Milestone 3 PRD and Technical Spec

## Purpose

Milestone 3 turns Pautalia into an internal operations platform for CMS-managed
content, apartment and parking inventory, lead CRM, legal compliance, private
admin access, and production deployment on Render or a similar host.

The 360-degree digital twin remains Track B and is not part of core M3 unless
approved panorama assets and add-on budget are confirmed.

## Product Scope

Core M3 includes:

- Payload CMS 2.x as a separate private CMS service.
- PostgreSQL-backed operational data.
- CMS collections for buildings, floors, typologies, units, leads, pages, legal
  pages, site settings, media, and admin users.
- In-house admin CRM at `/admin`.
- Unified apartment and parking inventory with `kind`.
- 14 sellable parking spaces: `A-P01` through `A-P14`.
- Global price visibility mode: `visible`, `hidden`, `per_unit`.
- Admin username/password login with optional TOTP 2FA.
- Buyer confirmation and admin notification emails through Resend.
- Cookie consent and legal pages at `/privacy`, `/cookies`, and `/terms`.
- Payload webhook revalidation at `POST /api/webhooks/payload`.
- Render service layout for web, CMS, and PostgreSQL.

Out of scope for core M3:

- Digital twin implementation.
- Payment/deposit processing.
- Agent portal or pricing tiers.
- Mortgage calculator.
- AI chatbot/live chat.
- External CRM webhook until a vendor is selected.

## User Stories

Public visitor:

- Browse project, apartments, unit detail, gallery, location, and contact pages.
- Filter apartment inventory by rooms, floor, price, orientation, and status.
- View sold and reserved apartments with clear status labels.
- Submit general or unit-specific enquiries.
- Choose necessary-only cookies or accept anonymous analytics.

Admin:

- Sign in through the hidden `/admin` route.
- Review CRM leads, update lead status, add admin notes, and export CSV.
- Review apartment and parking inventory in Content / Units.
- Change inventory status to available, reserved, or sold.
- Open unit detail pages with connected leads and unit-level metrics.
- Review marketing metrics for traffic, unit interest, funnel, sources,
  devices, and conversion.

Content admin:

- Use Payload CMS for full content, media, legal, pricing, and unit-detail
  editing.

## Inventory Requirements

All sellable inventory is represented as a unit:

```ts
type UnitKind = "apartment" | "parking";
```

Apartments use:

```ts
type ApartmentUnit = {
  id: string;
  floor: number;
  area: {
    living: number;
    shared: number;
    terrace?: number;
    total: number;
  };
  ownership: {
    commonPartsPercent: number;
    landPercent: number;
    landArea: number;
  };
};
```

Rules:

- `area.total` equals `area.living + area.shared`.
- `area.terrace` is optional and displayed separately.
- Public APIs should return nested `area` and `ownership` objects.
- Public apartment finder excludes `kind="parking"` by default.
- Admin inventory and CRM exports include apartment and parking units.

## CRM Requirements

Lead statuses:

```ts
type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "viewing_booked"
  | "reserved"
  | "closed"
  | "archived"
  | "spam";
```

Admin CRM supports:

- lead list and detail APIs
- status and admin-note updates
- unit/parking interest
- source URL, referrer, and UTM capture
- CSV export
- lead counts by status/date/source/unit through API filters

## Content / Units Admin

The Next admin surface intentionally handles operational status changes only.
Full authoring remains in Payload CMS.

Admin pages:

- `/admin/units`: apartment and parking list with kind/status filters.
- `/admin/units/[id]`: unit detail, status update, lead count, unit metrics,
  and Payload edit link when CMS URL is configured.

Editable in Next admin:

- `status`: `available`, `reserved`, or `sold`.

Editable in Payload CMS:

- descriptions
- images and galleries
- floor plans
- legal pages
- unit details
- price and price visibility
- archive/delete/full content operations

## Marketing Metrics Requirements

Marketing metrics use first-party custom events first. Plausible or another
analytics product is optional later and is not required for v1.

Approved event names:

```ts
type AnalyticsEvent =
  | "page_view"
  | "apartment_card_click"
  | "apartment_detail_view"
  | "apartment_gallery_click"
  | "floor_plan_view"
  | "floor_plan_download"
  | "filter_used"
  | "contact_form_submit"
  | "request_viewing_submit"
  | "phone_click"
  | "email_click"
  | "whatsapp_click"
  | "brochure_download"
  | "cta_click";
```

Admin metrics APIs:

- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/top-units`
- `GET /api/admin/analytics/sources`
- `GET /api/admin/analytics/funnel`
- `GET /api/admin/analytics/devices`
- `GET /api/admin/analytics/locations`

All admin metrics APIs require an admin session.

CSV columns:

```text
lead_id,created_at,updated_at,status,full_name,email,phone,unit_code,unit_kind,building,source_page_url,referrer,utm_source,utm_medium,utm_campaign,utm_term,utm_content,message,admin_notes
```

## Admin Authentication

Admin entry is intentionally hidden:

- no public navigation link
- no sitemap entry
- noindex metadata and middleware headers
- HTTP-only signed session cookie
- session expiry and logout

TOTP behavior:

- username/password first
- if TOTP is enabled, require a six-digit authenticator code
- setup, verify, and disable through `/api/admin/2fa/*`

## Legal and Consent

Legal pages:

- `/privacy`
- `/cookies`
- `/terms`

Cookie consent:

- first-party consent cookie
- necessary cookies always enabled
- anonymous aggregate first-party analytics events may be counted without persistent visitor IDs
- developer/internal IPs configured through `ANALYTICS_EXCLUDED_IPS` are not stored as analytics events
- returning visitor/session metrics only use anonymous IDs when consent includes analytics
- approximate country/region/city is stored only when consent includes analytics and the hosting/proxy provides geo headers
- analytics IDs are hashed server-side
- analytics IDs are not linked to lead identity, CRM notes, email, or phone
- marketing scripts disabled by default

## Deployment

Render services:

- `pautalia-web`: Next.js public app and admin CRM.
- `pautalia-cms`: Payload CMS service from `cms/`.
- `pautalia-db`: PostgreSQL 15 database.

Required environment variables are documented in `.env.example` and `README.md`.

## Acceptance Checks

Before M3 is called done:

- `npx prisma validate`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- desktop admin QA at 1440px
- mobile public QA at 375px minimum
- staging smoke test for CMS login, Payload edit, web revalidation, lead submit,
  email delivery, and CRM export

## Current Status

See `docs/implementation-status.md` for completed work and remaining deployment
tasks.
