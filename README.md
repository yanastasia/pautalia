# Pautalia

Next.js application for the Pautalia residential sales site.

Developed by Eryze Agency. Contact: `anastasia@eryze.com`

## Current architecture

- Public pages can render inventory from the local curated catalog or the PostgreSQL-backed inventory model.
- `/api/pautalia/*` remains the standardized API surface for integrations and future backend consumers.
- Prisma/PostgreSQL is used for leads, analytics events, inventory, admin users, legal pages, and site settings.
- `cms/` contains the separate Payload CMS service scaffold for content and inventory operations.
- Static presentation copy lives in `src/content/*` and is intentionally separate from business storage.

Detailed documentation:

- [Product, user stories, and architecture](/Users/anastasia/Projects/Github/pautalia/docs/product-architecture.md)
- [Implementation status and remaining work](/Users/anastasia/Projects/Github/pautalia/docs/implementation-status.md)
- [Deployment readiness audit](/Users/anastasia/Projects/Github/pautalia/docs/deployment-readiness-audit.md)
- [M3 PRD and technical spec](/Users/anastasia/Projects/Github/pautalia/docs/m3-prd-technical-spec.md)
- [Admin access](/Users/anastasia/Projects/Github/pautalia/docs/admin-access.md)
- [Unit/apartment data model](/Users/anastasia/Projects/Github/pautalia/docs/unit-apartment-schema.md)
- [Page reference](/Users/anastasia/Projects/Github/pautalia/docs/page-reference.md)

## Runtime scope

- Public pages for home, buildings, floors, apartments, unit detail, gallery, location, and contact
- Private `/admin` entry for authenticated admin access to CRM leads, Content / Units status management, marketing metrics, CSV export, and admin 2FA
- Public API namespace under `/api/pautalia/*`
- Apartment inventory uses the consolidated area/ownership model; 14 parking spaces are seeded as sellable units
- Global price visibility mode: `visible`, `hidden`, or `per_unit`
- Legal pages and one combined cookie/consent banner with optional anonymous analytics IDs
- Middleware with request IDs and baseline security headers
- EN/BG locale-aware UI

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Prisma
- Payload CMS 2.x service scaffold
- React Three Fiber / Drei
- PostgreSQL via `DATABASE_URL`

## API routes

- `GET /api/pautalia/buildings`
- `GET /api/pautalia/buildings/:slug`
- `GET /api/pautalia/units`
- `GET /api/pautalia/units/:slug`
- `POST /api/pautalia/leads`
- `POST /api/pautalia/events`
- `POST /api/webhooks/payload`
- `GET /api/admin/leads`
- `GET /api/admin/leads/export`
- `GET /api/admin/units`
- `PATCH /api/admin/units/:id`
- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/top-units`
- `GET /api/admin/analytics/sources`
- `GET /api/admin/analytics/funnel`
- `GET /api/admin/analytics/devices`
- `GET /api/admin/analytics/locations`
- `PATCH /api/admin/settings/price-visibility`
- `POST /api/admin/2fa/setup`
- `POST /api/admin/2fa/verify`
- `POST /api/admin/2fa/disable`

## Local commands

```bash
npm install
npx prisma generate
npm run dev
npm test
npm run build
```

## Deployment

This repo includes [render.yaml](/Users/anastasia/Projects/Github/pautalia/render.yaml) for Render-compatible deployment.

Render Blueprint services:

- `pautalia-web`: Next.js app.
- `pautalia-cms`: Payload CMS service from `cms/`.
- `pautalia-db`: PostgreSQL 15 database.

Required Render environment variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `AUTH_HASH_SECRET`
- `ANALYTICS_EXCLUDED_IPS`
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL`
- `PAYLOAD_INTERNAL_URL`
- `REVALIDATE_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

Recommended:

- Create the Blueprint from the branch that contains the release. The checked-in
  Blueprint tracks `main`, so merge this work before using it for production.
- The checked-in production web domain is `https://pautalia.com`.
- The checked-in production CMS domain is `https://cms.pautalia.com`.
- Set `PAUTALIA_INVENTORY_SOURCE=database` for production CMS-backed inventory.
- Set the same `REVALIDATE_SECRET` value on both `pautalia-web` and
  `pautalia-cms`.
- Use `.env.production.example` as the checklist for the web service env vars.
- If using Neon or another managed PostgreSQL provider instead of Render
  PostgreSQL, replace the `fromDatabase` `DATABASE_URL` entries in
  `render.yaml` with `sync: false` and paste the provider connection string in
  Render.

## Environment

- `DATABASE_URL`: PostgreSQL connection string for leads/events and any optional future synced inventory
- `AUTH_HASH_SECRET`: secret used for hashing request metadata
- `ANALYTICS_EXCLUDED_IPS`: comma-separated developer/internal IPs omitted from first-party event storage
- `NEXT_PUBLIC_SITE_URL`: public origin for metadata and sitemap
- `NEXT_PUBLIC_BOOKING_URL`: optional booking URL for admin/site settings fallback
- `ADMIN_USERNAME`: private `/admin` username, for example `admin`
- `ADMIN_PASSWORD`: private `/admin` password, minimum 12 characters
- `PAYLOAD_SECRET`: Payload CMS signing secret
- `PAYLOAD_PUBLIC_SERVER_URL`: browser-facing Payload URL
- `PAYLOAD_INTERNAL_URL`: server-to-server Payload URL
- `REVALIDATE_SECRET`: shared Payload webhook secret
- `RESEND_API_KEY`: optional Resend key for lead emails
- `EMAIL_FROM`: sender address for buyer/admin lead emails, for example `Pautalia <sales@pautalia.com>`
- `ADMIN_NOTIFICATION_EMAIL`: notification target for lead delivery hooks
- `PAUTALIA_INVENTORY_SOURCE`: `static` by default; set to `database` only when inventory should come from PostgreSQL

## Admin Access

- Route: `/admin`
- The route is intentionally absent from public navigation and sitemap output.
- Search indexing is blocked with robots metadata, middleware headers, and `robots.txt`.
- Credentials are env-backed. Current easy setup pair: `ADMIN_USERNAME=admin` and `ADMIN_PASSWORD=Pautalia2026!`.
- Sessions use a signed, HTTP-only cookie scoped to `/admin` and expire after 8 hours.
- Authenticated admins can review CRM lead totals/recent enquiries, export CSV, manage apartment/parking status, and review first-party marketing metrics.
- TOTP 2FA can be enabled with `/api/admin/2fa/*` routes.

## What Is Left

See [implementation-status.md](/Users/anastasia/Projects/Github/pautalia/docs/implementation-status.md). The main remaining work is production deployment validation: apply migrations in Render, configure env vars, connect and secure Payload CMS, choose the production inventory source, smoke-test lead/email/analytics/admin flows, and complete client/legal review of cookie/legal copy.

## Notes

- `src/data/site.ts` is the runtime source for the curated public inventory when `PAUTALIA_INVENTORY_SOURCE=static`.
- File-based lead storage has been removed.
- Legacy `/api/public/*`, `/api/buildings`, `/api/units`, and admin route trees have been removed from the runtime.
- `/admin` is intentionally unlinked and blocked from indexing; set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to enable the private admin workspace.
