# Pautalia Floorplan Parsing

Use this skill when a task involves turning an architectural floorplan into structured apartment data, interactive overlays, or floor-specific assets for the Pautalia site.

## Scope
- Parse a floor drawing into apartments, common areas, and outdoor areas.
- Convert plan annotations into site data for buildings, floors, and units.
- Prepare floorplan images for interactive web display.
- Align clickable overlays with the real apartment boundaries in the drawing.

## Pautalia rules
- Treat the ground floor as `floor 1`.
- Keep apartment labels exactly as shown in the plan.
- If the PDF repeats the same floor twice, ignore the duplicate sheet and keep a single parsed source for that floor.
- Use the Bulgarian room-count convention:
  - a one-bedroom apartment is a two-room apartment
  - a two-bedroom apartment is a three-room apartment
  - room count includes the living room
- Store room count and bedroom count separately when the plan makes both clear.
- Count only full bathrooms in the `bathrooms` field. If the plan also shows a separate WC, keep it in features or notes instead of inflating the bathroom count.
- If an apartment has a directly assigned outdoor area, mark it as a yard for ground-floor homes unless the drawing clearly indicates another outdoor type.

## Parsing workflow
1. Identify the building, floor, and apartment labels from the drawing.
2. Detect whether the plan is portrait or landscape.
3. Rotate portrait plans to landscape before using them in wide web layouts.
4. Map each apartment to its own overlay region.
5. Extract unit facts from the labels and room annotations:
   - apartment code
   - room count
   - bedroom count
   - bathroom count
   - interior area
   - outdoor area type if present
   - outdoor area size if present
6. Separate apartment data from common areas such as stairs, lifts, corridors, and shared service zones.

## Overlay rules
- Align overlays to the apartment footprint, not to the apartment label text.
- Do not let overlays bleed into common areas, parking, yards belonging to other homes, or site boundary graphics.
- Prefer apartment-specific polygons when the plan shape is irregular.
- If only rectangle overlays are available, use the tightest rectangle that still covers the usable apartment area.
- When a plan uses color-coded apartments, use the color regions to derive the overlay before refining the bounds manually.

## Data rules
- Do not invent pricing, status, or orientation unless a trusted source provides them.
- Keep apartment codes verbatim from the architectural drawing.
- Use floor-specific overrides when a real plan differs from a generic stack template.
- Reuse one floorplan image per floor and attach unit-level overlay data to each apartment on that floor.
- Record manual assumptions in code comments or data notes when the source drawing is incomplete.

## Output expectations
- A processed floorplan image suitable for the page layout.
- Structured unit data for the parsed floor.
- Overlay coordinates or polygons that match the displayed floorplan image.
- Any unresolved ambiguities called out explicitly.
