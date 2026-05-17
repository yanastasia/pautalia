# Asset Map

This document explains where public image files live and where they appear in the Pautalia site.

## Shared Homepage Hero Folder

The homepage hero is a shared site-level slideshow, not a Residence-only or Park-only section. Put images for that large homepage hero here:

- `public/assets/buildings/hero/`

Those images can show Residence, Park, both buildings together, or multiple angles of the same building. After adding files, include them in `src/data/home-hero-images.ts`.

Current shared hero images:

- `public/assets/buildings/hero/residence_exterior-front.jpg`
- `public/assets/buildings/hero/park_exterior-front.png`

## Canonical Building Folders

Building-specific assets should live under `public/assets/buildings/[building-folder]/`.

| Building | Internal id | Public label BG | Public label EN | Folder |
| --- | --- | --- | --- | --- |
| Building A | `a` | `Резиденс` | `Residence` | `public/assets/buildings/residence/` |
| Building B | `b` | `Парк` | `Park` | `public/assets/buildings/park/` |

## Upload Locations

| Asset type | Residence path | Park path | Naming |
| --- | --- | --- | --- |
| Building selector image | `public/assets/buildings/residence/selector/main.png` | `public/assets/buildings/park/selector/main.png` | One main exterior/selector image per building. |
| Floor plans | `public/assets/buildings/residence/floors/` | `public/assets/buildings/park/floors/` | `floor-01.png`, `floor-02.png`, etc. |
| Floor outline overlays | `public/assets/buildings/residence/floors/` | `public/assets/buildings/park/floors/` | `floor-01-outline.png`, `floor-02-outline.png`, etc. |
| Floor hotspot overlays | `public/assets/buildings/residence/floors/hotspots/` | `public/assets/buildings/park/floors/hotspots/` | `floor-01-hotspots.png`, `floor-02-hotspots.png`, etc. |
| Apartment floor plans | `public/assets/buildings/residence/apartments/` | `public/assets/buildings/park/apartments/` | `A-AP.01.png` through `A-AP.14.png`; `B-AP.01.png` through `B-AP.06.png`. |
| Apartment render galleries | `public/assets/buildings/residence/gallery/apartment_renders/[unit-code]/` | `public/assets/buildings/park/gallery/apartment_renders/[unit-code]/` | Room-specific files for each unit, for example `01_living.png`, `01_bath.png`, `01_yard.png`. |

The old shared top-level folders were retired. New building-specific work should use the canonical building folders above.

## Current Residence Assets

| File | Used for |
| --- | --- |
| `public/assets/buildings/residence/selector/main.png` | Residence selector card, building selector visual, Residence facade reference. |
| `public/assets/buildings/residence/floors/floor-01.png` through `floor-04.png` | Residence floor pages, floor selector, unit plan gallery, inventory seed data. |
| `public/assets/buildings/residence/floors/floor-01-outline.png` through `floor-04-outline.png` | Stored floor outline assets for future floorplan overlays. |
| `public/assets/buildings/residence/apartments/A-AP.01.png` through `A-AP.14.png` | Residence unit detail apartment plans and plan gallery. |
| `public/assets/buildings/residence/floors/hotspots/floor-01-hotspots.png` through `floor-04-hotspots.png` | Residence interactive floorplan hotspot overlays. |

## Current Park Assets

| File | Used for |
| --- | --- |
| `public/assets/buildings/park/selector/main.png` | Park selector card, building selector visual, Park facade reference. |
| `public/assets/buildings/park/floors/floor-01.png` through `floor-03.png` | Park floor pages, floor selector, unit plan gallery, inventory seed data. |
| `src/data/building-selector-visuals.ts` Park floor bands | Park building facade floor selector overlays for floors 1-3. |
| `public/assets/buildings/park/apartments/B-AP.01.png` through `B-AP.06.png` | Park unit detail apartment plans and plan gallery. |
| `public/assets/buildings/park/exterior/park_exterior1.png` through `park_exterior4.png` | Park exterior render set and curated public gallery entries. |
| `public/assets/buildings/park/gallery/apartment_renders/B-AP.01/` through `B-AP.06/` | Per-apartment Park render galleries used by unit cards, unit hero images, and unit detail gallery sections. |

The Park `hero`, `location`, `panoramas`, and `floors/hotspots` folders are prepared for approved future media.

## Shared Site Assets

| Folder/file | Used for |
| --- | --- |
| `public/assets/branding/pautalia-logo.png` | Site header logo on public and admin pages. |
| `public/assets/buildings/hero/` | Shared homepage hero slideshow images. |
| `public/assets/buildings/residence/exterior/exterior-front.jpg` | Default metadata image, JSON-LD image, news fallback cover, Residence exterior fallback. |
| `public/assets/buildings/residence/gallery/` | Gallery page, apartment finder hero, contact hero, project feature images, unit galleries, seeded post galleries. |
| `public/assets/buildings/residence/location/location-hero.jpg` | Location page hero. |
| `public/assets/buildings/residence/location/location-preview.jpg` | Location page map/context image. |
| `public/assets/buildings/residence/panoramas/` | Panorama/360 references where enabled for Residence content. |

## Page And Section Usage

| Page/section | Image source |
| --- | --- |
| Homepage hero slideshow | `src/data/home-hero-images.ts` |
| Homepage building selector | `src/data/building-selector-visuals.ts` |
| Homepage building feature cards | `src/app/page.tsx` feature image mapping |
| Buildings overview | `src/app/buildings/page.tsx`, using the shared implementation in `src/app/project/page.tsx` for compatibility |
| Apartment finder hero | `src/app/apartments/page.tsx` |
| Building detail hero/floorplan/panorama | `src/content/building-presentation.ts` and building records |
| Floor detail pages | `src/data/building-a-floorplans.ts`, `src/data/building-b.ts`, and `src/components/buildings/building-floorplan-frame.ts` |
| Unit detail plan gallery | `unit.floorplan`, floor records, and `src/data/building-a-floorplans.ts` / `src/data/building-b-units.ts` |
| Gallery page | `src/content/site-content.ts` |
| News listing/detail | `src/data/posts.ts`, `src/app/news/page.tsx`, `src/app/news/[slug]/page.tsx` |
| Location page | `src/app/location/page.tsx` |
| Contact page | `src/app/contact/page.tsx` |

## Code Files To Update When Adding New Assets

| Need | File |
| --- | --- |
| Add/remove homepage slideshow images | `src/data/home-hero-images.ts` |
| Change building selector image or floor bands | `src/data/building-selector-visuals.ts` |
| Change Residence floor or apartment plan paths | `src/data/building-a-floorplans.ts` |
| Change Park floor paths | `src/data/building-b.ts` |
| Change Park unit plan/gallery paths | `src/data/building-b-units.ts` |
| Adjust floorplan scaling/hotspot frame | `src/components/buildings/building-floorplan-frame.ts` |
| Update media records/seeds | `src/data/site.ts`, `src/lib/admin-inventory-seed.ts`, `prisma/seed.ts` |
