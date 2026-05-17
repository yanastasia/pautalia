# Page Reference

Use the page IDs below when reviewing or requesting changes one page at a time.

## Public pages

| Page ID | Route | Purpose | Notes |
| --- | --- | --- | --- |
| `P01` | `/` | Homepage | Main landing page with hero, key stats, building highlights, selector, and direct paths to the homes. |
| `P02` | `/buildings` | Buildings overview | Compares the two active buildings, their current completion progress, and direct access to the homes inside each one. `/project` remains a compatibility alias. |
| `P03` | `/apartments` | Apartment finder | Filters available homes by building, rooms, floor, price, orientation, and status. |
| `P04` | `/building/[id]` | Building detail | Introduces a selected building, its overview, floors, and homes. Example: `/building/a`. |
| `P05` | `/building/[id]/floor/[floor]` | Floor detail | Interactive floor page with unit overlays and floor-specific unit access. Example: `/building/a/floor/2`. |
| `P06` | `/unit/[id]` | Unit detail | Full apartment presentation with specifications, floorplan, gallery, inquiry CTA, and related homes. Example: `/unit/A201`. |
| `P07` | `/gallery` | Visual gallery | Exterior and interior imagery from the buildings and homes. |
| `P08` | `/news` | News/blog listing | Lists published bilingual news, construction updates, announcements, and press posts. |
| `P09` | `/news/[slug]` | News/blog detail | Shows a published post with cover media, body, gallery, and optional video. Draft/archived posts return 404. |
| `P10` | `/location` | Location page | Explains the setting, nearby amenities, and everyday context around the buildings. |
| `P11` | `/contact` | Contact page | Buyer enquiry page with direct contact information and lead form. |
| `P12` | `/privacy` | Privacy Policy | CMS-backed legal page with Bulgarian fallback copy. |
| `P13` | `/cookies` | Cookie Policy | CMS-backed legal page explaining consent categories and analytics behavior. |
| `P14` | `/terms` | Terms of Use | CMS-backed legal page with Bulgarian fallback copy. |

## Operational pages

| Page ID | Route | Purpose | Notes |
| --- | --- | --- | --- |
| `P15` | `/admin` | Private admin workspace | Unlinked, noindex admin URL. Shows username/password/TOTP login until authenticated; signed admin sessions can view CRM, Content / Units, and marketing metrics. |
| `P16` | `/admin/leads` | CRM lead list | Authenticated lead list with status filters and CSV export path. |
| `P17` | `/admin/leads/[id]` | CRM lead detail | Authenticated lead detail with status and admin-note management. |
| `P18` | `/admin/units` | Content / Units inventory | Authenticated apartment and parking inventory with kind/status filters and status editing. |
| `P19` | `/admin/units/[id]` | Unit admin detail | Authenticated unit status page with lead count, unit metrics, and optional CMS edit link. |
| `P20` | `/admin/analytics` | Marketing metrics | Authenticated first-party analytics dashboard for overview, top units, sources, funnel, devices, consented cities, and conversion. |
| `P21` | `not-found` | Fallback page | Handles missing or invalid routes and points visitors back to the main pages. |

## Recommended review order

1. `P01` Homepage
2. `P02` Buildings overview
3. `P03` Apartment finder
4. `P04` Building detail
5. `P05` Floor detail
6. `P06` Unit detail
7. `P07` Gallery
8. `P08`/`P09` News/blog
9. `P10` Location
10. `P11` Contact
11. `P12`/`P13`/`P14` Legal pages
12. `P15` Private admin workspace
13. `P16`/`P17` CRM
14. `P18`/`P19` Content / Units
15. `P20` Marketing metrics

## Reference examples

- "Update `P01`" means the homepage at `/`.
- "Adjust `P04` for Residence" means `/building/a`.
- "Review `P05` for floor 3 in Park" means `/building/b/floor/3`.
- "Refine `P06` for unit A201" means `/unit/A201`.
- "Check `P15`" means manually entering `/admin`; it should not appear in public navigation or the sitemap.
- "Check `P20`" means sign in first, then open `/admin/analytics`.

## Asset reference

Use `docs/asset-map.md` for the canonical image upload folders and the page/section map of where each image type appears.
