# Admin Access

The admin workspace is available only by manually visiting `/admin`. It is not
linked from the public header, footer, sitemap, or page reference navigation.

## Credentials

Set these environment variables before deployment:

```text
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Pautalia2026!"
AUTH_HASH_SECRET="replace-me-with-a-long-random-secret"
```

Both values are required. If either one is missing, `/admin` renders a
configuration warning instead of allowing sign-in.

## Session Behavior

- Login endpoint: `POST /api/admin/login`
- Logout endpoint: `POST /api/admin/logout`
- Cookie name: `pautalia_admin_session`
- Cookie scope: `/`
- Cookie flags: HTTP-only, same-site lax, secure in production
- Session length: 8 hours

The session cookie is signed with `AUTH_HASH_SECRET`. Raw admin passwords are not
stored by the application.

## Two-Factor Authentication

M3 adds TOTP support for admin accounts:

- setup: `POST /api/admin/2fa/setup`
- verify/enable: `POST /api/admin/2fa/verify`
- disable: `POST /api/admin/2fa/disable`

When TOTP is enabled, login is a two-step flow: username/password first, then a
six-digit authenticator code. Standard authenticator apps are supported,
including Google Authenticator, Authy, 1Password, and iCloud Passwords.

## Public Visibility

`/admin` is deliberately hidden from normal visitors:

- no header or footer link
- no sitemap entry
- `robots.txt` disallows `/admin`
- page metadata sets `index: false` and `follow: false`
- middleware adds `X-Robots-Tag: noindex, nofollow`
- middleware sets `Cache-Control: no-store` for admin routes

## Current Admin Surface

After sign-in, admins can view:

- total CRM lead count
- recent lead enquiries
- sold unit count
- available unit count
- Content / Units inventory status overview
- lead CSV export
- apartment and parking inventory records
- apartment and parking status management via admin pages and API
- unit detail pages with lead count and unit-level event metrics
- marketing metrics dashboard at `/admin/analytics`

## Admin Routes

- `/admin`: private workspace overview.
- `/admin/leads`: CRM lead list and status filters.
- `/admin/leads/[id]`: lead detail, status update, and admin notes.
- `/admin/units`: apartment and parking inventory list.
- `/admin/units/[id]`: unit detail, status update, CMS edit link, and metrics.
- `/admin/analytics`: marketing metrics dashboard.

## Admin API Access

All admin API routes require the signed admin session cookie. Unauthenticated
requests return `401`.

Key routes:

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

The private `/admin` route is the in-house CRM/admin operations entry. Payload
CMS is deployed as a separate private CMS service for content and inventory
editing, and both surfaces reuse the canonical inventory model in
`docs/unit-apartment-schema.md`.

## Ownership Split

Next admin owns:

- CRM follow-up.
- Lead status and notes.
- CSV export.
- Inventory status changes.
- Marketing metrics.

Payload CMS owns:

- Full unit details.
- Descriptions and website copy.
- Media, gallery, and floor plans.
- Legal page copy.
- Price and price visibility content operations.
