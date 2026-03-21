## Stack (locked — do not deviate)
- Next.js 14 App Router + TypeScript strict + Tailwind CSS
- Payload CMS 2.x (self-hosted) for all content
- PostgreSQL 15 via pg client (no Prisma)
- Photo Sphere Viewer for the 360° twin viewer
- Resend for email, Plausible CE for analytics
- NOT Vercel, NOT Supabase, NOT reCAPTCHA, NOT Google Maps API

## Architecture rules
- Every table has building_id UUID FK — even when only one building exists
- Asset paths: /assets/[building-slug]/[typology-slug]/[room-name].webp
- Unit codes: [BUILDING_LETTER]-[FLOOR][UNIT] e.g. A-204
- ISR revalidation via POST /api/webhooks/payload on any CMS change
- Rate limiting: in-memory Map (no Redis) — 3 req/IP/15min on lead forms
- Honeypot anti-spam on all forms — no reCAPTCHA
- SHA-256 IP hashing before any storage — never raw IP

## File structure
- Components in components/[domain]/ — never in pages
- Business logic in lib/ — never in components
- API routes in app/api/ — typed with NextRequest/NextResponse
- No file over 200 lines — extract a sub-component

## Before marking any task complete
1. npm run typecheck — must exit 0
2. npm run lint — 0 warnings
3. Tested at 375px viewport minimum
4. No console.log in diff
```

### `.agents/skills/` — skills that load on demand

Put repo skills in `.agents/skills/` when the workflow applies to that project.  For Pautalia you want three:
```
.agents/skills/
  impeccable/          ← design system enforcement (npx skills add)
  pautalia-db/         ← your custom DB schema skill (write this once)
  pautalia-twin/       ← your custom twin viewer skill (write this once)
  pautalia-floorplan-parsing/  ← your custom floorplan parsing skill (write this once)
