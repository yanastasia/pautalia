# Deployment Readiness Audit

Audit date: 2026-05-16

## Scope Checked

- Repository documentation and deployment configuration.
- Obsidian Pautalia context notes in `/Users/anastasia/Eryze`.
- Render Blueprint readiness.
- Configured PostgreSQL database connectivity and inventory integrity.
- Public/admin API and page smoke tests.

## Deployment Configuration

- `render.yaml` defines `pautalia-web`, `pautalia-cms`, and `pautalia-db`.
- Web and CMS use the same PostgreSQL database through `DATABASE_URL`.
- Web uses `https://pautalia.com` as `NEXT_PUBLIC_SITE_URL`.
- Web and CMS use `https://cms.pautalia.com` for Payload public/internal URLs.
- Production must set the same `REVALIDATE_SECRET` on web and CMS.
- Production must set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_HASH_SECRET`,
  `NEXT_PUBLIC_SITE_URL`, `PAYLOAD_PUBLIC_SERVER_URL`, `PAYLOAD_INTERNAL_URL`,
  email settings, and `ANALYTICS_EXCLUDED_IPS`.
- The Blueprint tracks `main`; merge the release branch before creating the
  production Blueprint, or change the branch for a staging Blueprint.

## Database Audit

The configured database is reachable and contains:

- 2 buildings.
- 7 floors.
- 40 units total.
- 20 apartments and 20 parking units.
- Residence: 14 apartments and 14 parking units.
- Park: 6 apartments and 6 parking units.
- 1 lead.
- 0 stored analytics events after the developer reset.
- 1 admin user.
- 6 legal pages.

Integrity checks:

- Residence apartment area totals match `living + shared`.
- Residence apartment ownership fields are populated from official data.
- Residence parking area fields are zero and land ownership fields are populated.
- All units are currently `available`.
- Park has 12 ownership placeholder records, expected until the official Park
  ownership table is supplied.

## Obsidian Context

Current Obsidian memory files align on the invoice and milestone direction:

- M3: operations/CMS/admin closeout for Residence.
- M4: blog/news/content-growth scope.
- M5: Park / Building B integration, excluding digital twins.
- Invoice `ERYZ-2026-002` includes M3, M4, M5, domain reimbursement, and cash
  advance offset.

Older Obsidian project notes still contain historical context and may show the
old contact phone or older milestone labels. Treat the repo documentation as the
current implementation source until those external notes are refreshed.

## Launch Gates

- Park should not be treated as production-complete until official F1/F3/common
  parts/land ownership data and approved Park media are supplied.
- TOTP is not enabled for the current admin user yet.
- Legal/cookie copy still needs client/legal owner review.
- Production email delivery needs a valid Resend key and sender domain.
- Internal/developer IPs should be added to `ANALYTICS_EXCLUDED_IPS` before real
  reporting starts.
