# Page Reference

Use the page IDs below when reviewing or requesting changes one page at a time.

## Public pages

| Page ID | Route | Purpose | Notes |
| --- | --- | --- | --- |
| `P01` | `/` | Homepage | Main landing page with hero, key stats, building highlights, selector, and direct paths to the homes. |
| `P02` | `/project` | Buildings overview | Compares the two active buildings, their current completion progress, and direct access to the homes inside each one. |
| `P03` | `/apartments` | Apartment finder | Filters available homes by building, rooms, floor, price, orientation, and status. |
| `P04` | `/building/[id]` | Building detail | Introduces a selected building, its overview, floors, and homes. Example: `/building/a`. |
| `P05` | `/building/[id]/floor/[floor]` | Floor detail | Interactive floor page with unit overlays and floor-specific unit access. Example: `/building/a/floor/2`. |
| `P06` | `/unit/[id]` | Unit detail | Full apartment presentation with specifications, floorplan, gallery, inquiry CTA, and related homes. Example: `/unit/A201`. |
| `P07` | `/gallery` | Visual gallery | Exterior and interior imagery from the buildings and homes. |
| `P08` | `/location` | Location page | Explains the setting, nearby amenities, and everyday context around the buildings. |
| `P09` | `/contact` | Contact page | Buyer enquiry page with direct contact information and lead form. |

## Operational pages

| Page ID | Route | Purpose | Notes |
| --- | --- | --- | --- |
| `P10` | `/admin` | Admin landing page | Public explanation page for the internal admin/CMS area until the authenticated admin surface is mounted. |
| `P11` | `not-found` | Fallback page | Handles missing or invalid routes and points visitors back to the main pages. |

## Recommended review order

1. `P01` Homepage
2. `P02` Buildings overview
3. `P03` Apartment finder
4. `P04` Building detail
5. `P05` Floor detail
6. `P06` Unit detail
7. `P07` Gallery
8. `P08` Location
9. `P09` Contact
10. `P10` Admin landing page

## Reference examples

- "Update `P01`" means the homepage at `/`.
- "Adjust `P04` for Building A" means `/building/a`.
- "Review `P05` for floor 3 in Building B" means `/building/b/floor/3`.
- "Refine `P06` for unit A201" means `/unit/A201`.
