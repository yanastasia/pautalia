# Implementation Status

## Completed

- Public bilingual site for homepage, project, apartments, building detail,
  unit detail, gallery, news, location, contact, privacy, cookies, and terms.
- Hidden `/admin` entry with username/password login, signed session cookie,
  logout, noindex protection, and optional TOTP API surface.
- CRM lead list, lead detail, lead status updates, admin notes, and CSV export.
- Unit inventory admin for apartments and parking, with status changes for
  available, reserved, and sold.
- Unit detail admin page with lead count, event metrics, status change, and CMS
  edit link when `PAYLOAD_PUBLIC_SERVER_URL` is configured.
- Marketing metrics dashboard at `/admin/analytics`.
- Admin analytics APIs for overview, top units, sources, funnel, and devices.
- First-party analytics event intake with approved event names.
- Optional consent-only country/region/city analytics from hosting/proxy geo
  headers.
- Developer/internal analytics exclusion via `ANALYTICS_EXCLUDED_IPS`, with
  localhost omitted automatically outside production.
- Combined cookie/consent banner with necessary-only and accept-analytics
  choices.
- Anonymous visitor/session IDs stored only when analytics consent exists.
- Lead submissions are not connected to analytics visitor/session IDs.
- Consolidated apartment area/ownership model using official table values.
- 14 apartments and 14 parking spaces in the unit inventory system.
- Parking land ownership values from the official table.
- Park staged for invoice `ERYZ-2026-002` with 6 apartments, 6 parking
  spaces, public building filtering, and admin/CRM/analytics building filters.
- M4 blog/news foundation with Payload `Posts`, public `/news` and
  `/news/[slug]`, public post APIs, published-only filtering, and sitemap
  entries.
- Payload CMS 2.x service scaffold with collections for admin users, buildings,
  floors, typologies, units, leads, pages, posts, legal pages, media, and site
  settings.
- Render service definition for web, CMS, and PostgreSQL.
- Legal pages with CMS lookup and static fallback copy.

## Current Data Rules

- Apartments use `area.living`, `area.shared`, optional `area.terrace`, and
  `area.total`.
- `area.total` equals `area.living + area.shared`.
- Terrace is displayed separately and is not added into total again.
- Apartments and parking share the `Unit` inventory model.
- Public apartment finder excludes parking.
- Admin inventory includes apartments and parking.
- Public sold/reserved apartments remain visible and labeled.
- Available count only counts `status = available`.

## Left To Do

- Apply all database migrations in Render/staging.
- Configure production environment variables in Render.
- Add the developer, agency, and owner public IPs to `ANALYTICS_EXCLUDED_IPS`
  before serious production reporting starts.
- Connect Payload CMS service to the production database and secure private CMS
  access.
- Receive the official Park F1/F3/common-parts/land ownership table before
  public launch of Park.
- Seed approved client news/blog posts in Payload CMS and confirm the production
  CMS publishing workflow.
- Confirm whether production inventory reads should switch from static fallback
  to database/Payload-backed inventory.
- Perform a full Render staging smoke test:
  - CMS login
  - Payload edit
  - webhook revalidation
  - lead submit
  - email delivery
  - CRM export
  - admin analytics dashboard
- Review cookie, privacy, and terms copy with the client/legal owner.
- Confirm final production admin credentials and enable TOTP for real admins.
- Confirm the production contact email and sender-domain setup.
- Decide later whether a paid/self-hosted analytics product is worth adding.
- Track B digital twin remains optional and unimplemented until approved.

## Latest Verification

Last local verification: 2026-05-16.

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm test`: passed
- `npm run build`: passed
- `npx prisma validate`: passed
- `render.yaml`: valid YAML and contains web, CMS, and database resources
- Configured database audit:
  - 2 buildings, 7 floors, 40 units
  - 20 apartments and 20 parking units
  - Residence has 14 apartments and 14 parking units
  - Park has 6 apartments and 6 parking units
  - Residence official area/ownership checks passed
  - Park ownership placeholders remain gated pending official data
- Local production smoke at `localhost:3000`:
  - `/`: returned `200`
  - `/buildings`: returned `200`
  - `/project`: returned `200` compatibility route
  - `/apartments?building=building-b`: returned `200`
  - `/api/pautalia/units?building=building-b&limit=50`: returned 6 Park apartments
  - `/news`: returned `200`
  - `/sitemap.xml`: returned `200`
  - `/admin`: returned `200`
  - `/admin` showed the expected configuration warning because the local
    production `.env` does not include `ADMIN_USERNAME` and `ADMIN_PASSWORD`
  - `/api/admin/analytics/overview` without session: returned `401`
  - `/api/pautalia/posts/draft-building-b-launch-note`: returned `404`
  - `/api/webhooks/payload` without configured production secret: returned `503`
  - `/robots.txt`: disallows `/admin`
- Browser QA screenshots completed:
  - desktop homepage at 1440px
  - mobile Park apartment finder at 375px
- Local `/apartments`: returned `200`
- Local `/news`: returned `200`
- Local `/news/construction-update-building-a-may-2026`: returned `200`
- Draft post API: returned `404`
- Unauthenticated `/api/admin/analytics/overview`: returned `401`
- Analytics smoke test:
  - no-consent event stored no visitor/session hash
  - analytics-consent event stored visitor/session hashes
  - local developer event skipped and stored no event
- 375px mobile screenshot check completed for `/apartments`
