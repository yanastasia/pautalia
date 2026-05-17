# Notion Sprint Readout

Last checked from Notion on 2026-04-30. Updated with local implementation
status on 2026-05-02.

## Sources

- Pautalia project page: status `In progress`, stage `Testing`, awaiting feedback.
- Current task: `Pautalia: validate production runtime and lead flow`.
- EryzeOS External Repos Dashboard: Pautalia priority `Medium`.
- Pautalia project snapshot from 2026-03-26.

## Current Notion Signal

Pautalia is treated as a testing-stage project. The main release concern is not
adding more public surface area, but validating production readiness:

- current task status is `In progress`, blocked, and awaiting feedback
- task owner is Anastasia
- deployment target is Render
- validate Render production environment variables
- smoke-test `POST /api/pautalia/leads` against the target database
- smoke-test `POST /api/pautalia/events` against the target database
- keep public inventory reads static unless the release explicitly switches to
  database-backed inventory
- wait for client feedback before calling the release path settled

## Completed Since Original Readout

- Hidden `/admin` workspace is implemented.
- CRM list/detail/status/notes/export are implemented.
- Content / Units inventory status management is implemented.
- Unit admin detail with metrics and CMS edit link is implemented.
- First-party marketing metrics dashboard and APIs are implemented.
- Combined cookie/consent banner is implemented.
- Anonymous visitor/session analytics IDs are only stored after analytics
  consent.
- Official area and ownership values are applied to static catalog and current
  database rows.

## Recommended Next Work

1. Production environment validation
   Confirm `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `AUTH_HASH_SECRET`,
   `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set in Render.

2. Database write smoke tests
   Submit a real lead and analytics event against the deployed service and verify
   the records are present in PostgreSQL.

3. Admin workflow check
   Visit `/admin`, sign in with the configured admin credentials, confirm recent
   leads, inventory status, unit detail metrics, marketing metrics, and sign out.

4. Inventory source decision
   Document whether the next release remains static-inventory-first or begins the
   move toward database/Payload-managed inventory.

5. Client feedback loop
   Collect stakeholder notes on the public pages and the private admin workflow,
   then convert approved changes into the next sprint batch.

6. Legal review
   Confirm privacy, cookie, terms, and analytics-consent copy before production
   launch.
