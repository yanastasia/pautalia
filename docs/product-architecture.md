# Pautalia Product, User Stories, and Architecture

## Product Summary

Pautalia is a bilingual residential sales website with a hidden admin
operations area. The public site helps visitors browse the project, compare
apartments, inspect unit details, and submit enquiries. The private admin area
supports CRM follow-up, inventory status management, and first-party marketing
metrics.

The system is intentionally lean: custom PostgreSQL-backed events are used for
marketing metrics first, with no GA4, Auth.js, Vercel, Supabase, or paid
analytics service in v1.

## User Roles

- Public visitor: browses project pages, filters apartments, opens unit detail
  pages, submits enquiries, and can accept or decline analytics consent.
- Admin: signs in through `/admin`, manages CRM leads, changes inventory
  status, exports leads, and reviews marketing metrics.
- Content admin: uses Payload CMS for full content, media, legal, pricing, and
  unit-detail editing.
- Content admin: creates bilingual news/blog posts, construction updates,
  announcements, and press posts in Payload CMS.
- Super admin: manages admin access and 2FA settings.

## User Stories

- As a visitor, I can view all public project pages in Bulgarian or English.
- As a visitor, I can filter apartments by rooms, floor, price, orientation,
  and status.
- As a visitor, I can open a unit page and see area, ownership, floorplan,
  gallery, status, and enquiry CTA.
- As a visitor, I can submit a general or unit-specific enquiry.
- As a visitor, I can choose necessary-only cookies or accept anonymous
  analytics in one combined banner.
- As an admin, I can sign in through a private unlinked URL.
- As an admin, I can view, filter, update, and export CRM leads.
- As an admin, I can view apartments and parking spaces in one inventory list.
- As an admin, I can change status to available, reserved, or sold.
- As an admin, I can open a unit detail page with lead and event metrics.
- As an admin, I can review marketing performance by page views, apartment
  interest, sources, devices, funnel, and conversions.
- As a content admin, I can use Payload CMS for full content/media/unit editing.
- As a content admin, I can create, edit, publish, archive, and relate
  bilingual posts to Residence or Park.
- As a visitor, I can browse published news and construction updates in the
  current language.

## Architecture

Runtime services:

- `pautalia-web`: Next.js App Router site, public API, private admin UI.
- `pautalia-cms`: Payload CMS 2.x service scaffold.
- `pautalia-db`: PostgreSQL database.

Main data areas:

- Inventory: canonical `Unit` records for apartments and parking.
- CRM: `Lead` records with status, notes, UTM fields, source URL, and unit
  interest.
- Analytics: `Event` records with approved event names, source context, device
  type, optional timing, optional approximate location, and optional anonymous
  visitor/session hashes.
- Legal/content: CMS-backed legal pages with static fallbacks.
- Posts: Payload-authored bilingual news/blog records, exposed publicly only
  when published.
- Admin auth: environment-backed login plus signed session cookie and optional
  TOTP.

## Privacy Analytics

The cookie banner combines cookie choice and analytics consent.

Necessary-only mode:

- stores the consent choice and language/admin essentials
- allows aggregate first-party event counting
- does not create visitor or session analytics IDs
- cannot produce true returning-visitor metrics

Developer/internal traffic:

- `ANALYTICS_EXCLUDED_IPS` accepts a comma-separated list of raw IP addresses
- excluded IPs are accepted by `POST /api/pautalia/events` but are not stored
- localhost developer IPs are automatically skipped outside production
- use this for developers, agency QA, owner previews, and other internal traffic

Analytics mode:

- creates anonymous first-party visitor and session IDs
- stores only hashed IDs server-side
- stores approximate country/region/city when the deployment proxy provides it
- enables returning visitors, repeat apartment views, sessions, and stronger
  funnel reporting
- does not connect analytics IDs to lead identity, CRM notes, email, or phone

## Main Interfaces

Public APIs:

- `GET /api/pautalia/buildings`
- `GET /api/pautalia/buildings/[slug]`
- `GET /api/pautalia/units`
- `GET /api/pautalia/units/[slug]`
- `GET /api/pautalia/posts`
- `GET /api/pautalia/posts/[slug]`
- `POST /api/pautalia/leads`
- `POST /api/pautalia/events`

Admin APIs:

- `GET /api/admin/leads`
- `GET /api/admin/leads/export`
- `GET /api/admin/units`
- `PATCH /api/admin/units/[id]`
- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/top-units`
- `GET /api/admin/analytics/sources`
- `GET /api/admin/analytics/funnel`
- `GET /api/admin/analytics/devices`
- `GET /api/admin/analytics/locations`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `POST /api/admin/2fa/setup`
- `POST /api/admin/2fa/verify`
- `POST /api/admin/2fa/disable`

## Deployment Notes

- Deploy on Render or similar managed hosting.
- Use separate web, CMS, and PostgreSQL services. The checked-in
  `render.yaml` provisions `pautalia-web`, `pautalia-cms`, and a PostgreSQL 15
  `pautalia-db` in Frankfurt.
- If the production database is Neon or another managed provider instead of
  Render PostgreSQL, keep the same schema/migrations and provide the external
  `DATABASE_URL` manually in Render.
- Set `PAUTALIA_INVENTORY_SOURCE=database` when production should read the
  database-backed inventory.
- Set the same `REVALIDATE_SECRET` for the web and CMS services so Payload
  publish events can revalidate the public site.
- Keep `/admin` hidden from public navigation and blocked from indexing.
- Run database migrations before enabling analytics and admin dashboards.
- In M4, seed approved posts through Payload CMS and verify `/news`, individual
  post pages, and sitemap entries before launch.
