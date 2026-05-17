# Invoice ERYZ-2026-002 Scope

This invoice groups the next Pautalia delivery work after the initial Residence launch.

## Included Line Groups

1. Milestone 3 operations completion
   - Payload CMS operational setup.
   - In-house CRM, lead management, status updates, notes, and CSV export.
   - Unified apartment and parking inventory with admin status management.
   - Marketing metrics dashboard and first-party analytics event tracking.
   - Cookie consent, legal pages, and admin access hardening.
   - Official Residence area and ownership data alignment.

2. Milestone 4 content and growth scope
   - Bilingual News/Blog requirements and implemented Payload `Posts` data model.
   - Construction update publishing through the same CMS content model.
   - Rich post media support for images, galleries, and videos.
   - Public `/news` and `/news/[slug]` pages, SEO metadata, sitemap inclusion, and public post APIs.

3. Milestone 5 Park / Building B integration
   - Building setup, floors, typologies, apartments, and parking records.
   - Apartment finder building filter with `/apartments?building=b`.
   - Unit detail pages and inquiry attribution for Park units.
   - Project page Park section with approved bilingual copy.
   - Admin lead, unit, CSV export, and analytics building filters.

## Explicitly Excluded

- Digital twins for Park.
- Panorama asset production or ingestion.
- Twin navigation, hotspots, floor-plan overlays, tile streaming, and in-tour inquiry forms.
- Payment or reservation deposit processing.
- Full post editing inside Next `/admin`; content authoring remains in Payload CMS.

## Launch Gate

Park can be implemented and staged with the supplied PRD/Text Pack data. Public launch requires the official Park F1/F3/common-parts/land ownership table so missing ownership values are not invented.
