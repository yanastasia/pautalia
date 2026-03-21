# Off-Plan Real Estate Sales Website with Digital Twin
## Product Requirements Document + Discovery + Strategy + Risk + Roadmap + Project Management Plan

**Project Type:** Self-Hosted Real Estate Sales Platform with Digital Twin Walkthroughs  
**Location:** Kyustendil, Bulgaria  
**Status:** Pre-Discovery  
**Prepared by:** Eryze Studio  
**Version:** 2.0  
**Rate:** €25–30/hour  
**Billing model:** Monthly, by delivered milestone

---

# SECTION 1 — FULL PRODUCT REQUIREMENTS DOCUMENT (PRD)

---

## 1.1 Executive Summary

### Product Vision
A self-hosted, premium real estate sales platform that allows prospective buyers to digitally experience an off-plan apartment development as if it were already built — combining a digital twin walkthrough, apartment finder, and lead capture system into a single, scalable, subscription-free product.

### Business Goals
- Accelerate pre-sales in the Kyustendil market by enabling digital-first buyer journeys without requiring a physical showroom
- Reduce dependence on third-party portals (imoti.net, imot.bg) and their associated lead costs
- Create a reusable platform architecture that supports multiple buildings or phases — this is explicitly a growing project, not a one-time delivery
- Establish a direct data pipeline to the client's CRM from the first day of launch
- Minimize total cost of ownership by avoiding recurring SaaS licensing

### User Goals
- Understand the layout, feel, and quality of an apartment before it is built
- Compare units across floors, orientations, and typologies with minimal friction
- Make an emotional and rational connection to a specific unit before engaging a sales agent
- Book a consultation or reserve interest with confidence and without pressure

### Core Value Proposition
**For the developer:** A branded, owned digital sales channel that converts early-stage curiosity into tracked, qualified leads — without a showroom.  
**For the buyer:** The closest possible experience to standing inside an apartment that does not yet exist.

---

## 1.2 Target Users

### Buyer Persona A — The Aspirational Self-Buyer
- Age 28–45, urban professional, likely first or second property purchase
- Researches extensively online before engaging any agent
- Motivated by lifestyle fit, view, layout quality, and finishes
- Decision timeline: 2–6 months
- Needs: Clear floorplans, visual finishes, price transparency, easy contact

### Buyer Persona B — The Investment-Led Buyer
- Age 35–60, may be local or diaspora, purchasing as rental investment or capital growth
- Motivated by yield, unit mix, developer track record, exit potential
- Typically works faster if the numbers are clear
- Needs: Pricing by unit, projected rental yield, floor-level comparisons, reservation process

### Buyer Persona C — The Remote/Diaspora Buyer
- Located outside the country, relies entirely on digital materials
- High trust barrier — needs detailed visual proof and transparent communication
- Likely to share links with family before deciding
- Needs: Multilingual support (if applicable), downloadable assets, video walkthroughs, clear reservation flow

### Agent/Partner Persona
- Works with clients on their behalf and pre-qualifies
- Needs a shareable URL for specific unit typologies
- May need a separate access layer with pricing or availability status not visible to public
- Needs: Deep-linkable unit pages, printable unit sheets, CRM-visible referral tracking

---

## 1.3 Product Scope

### In Scope
- Marketing website with building overview, location, developer background, and gallery
- Apartment finder: filter by typology, floor, orientation, size, price range, availability
- Per-typology digital twin walkthrough (not per individual unit — per floor type)
- Lead generation system: inquiry forms, unit-specific interest capture, consultation booking
- CMS for managing availability status, pricing, and content updates without a developer
- Admin panel for managing leads and unit inventory
- Analytics integration (privacy-first, self-hosted preferred)
- Multi-building/phase architecture scaffolding (not built, but designed for)
- Mobile-first responsive design

### Out of Scope (Version 1.0)
- Real-time 3D rendering via cloud GPU — too costly and unreliable at self-hosted scale
- Agent portal with separate login and pricing tiers — Phase 2 if demand exists
- Legal document generation or e-signature flow — handled offline or via third party
- Payment processing or deposit collection — handled offline for V1
- VR headset compatibility — screen-based only
- AI chatbot or live chat integration — Phase 2
- Mortgage calculator with live rate API — Phase 2
- Multi-language support — assess in discovery, flag for Phase 2
- AR view (placing apartment in real environment via phone camera)

---

## 1.4 Functional Requirements

### Digital Twin System

**FR-DT-01:** The system must support display of apartment interiors on screen without requiring any plugin installation (pure web-based)  
**FR-DT-02:** Navigation must be possible via click/tap, swipe, or mouse — no gamepad required  
**FR-DT-03:** Each room must be individually identifiable and linkable within the walkthrough  
**FR-DT-04:** The walkthrough must load within 4 seconds on a standard broadband connection (see performance reqs)  
**FR-DT-05:** Hotspots must be embeddable to highlight premium features (e.g., ceiling height, finishes, view)  
**FR-DT-06:** The floorplan must be displayed persistently as a mini-map or overlay, with current location indicated  
**FR-DT-07:** Unit-specific metadata (typology, floor, view direction, area) must be visible during the walkthrough  
**FR-DT-08:** A CTA (call-to-action) must be accessible at any point during the walkthrough without exiting  
**FR-DT-09:** Assets (panoramas or 3D scenes) must be self-hosted — no iframe dependency on external platforms  
**FR-DT-10:** The system must support per-typology walkthroughs (not per individual unit) to reduce asset volume

### Inventory / Apartment Finder

**FR-INV-01:** Filter panel must support: number of bedrooms, floor level, orientation, price range, availability status  
**FR-INV-02:** Availability states must include at minimum: Available, Reserved, Sold  
**FR-INV-03:** Unit grid or list view must display: unit code, typology, floor, orientation, size (sqm), price, status  
**FR-INV-04:** Clicking a unit must open a detail page or modal with floorplan, walkthrough link, and lead CTA  
**FR-INV-05:** Unit data must be manageable via CMS without code changes  
**FR-INV-06:** Building floor stack visualization (visual cross-section by floor) is desirable but optional for V1  
**FR-INV-07:** Deep links to individual units must be shareable (e.g., /apartments/unit-204)  
**FR-INV-08:** Price display must be configurable — on/off toggle by admin (some developers restrict public pricing)  

### Sales & Lead System

**FR-LEAD-01:** Every unit detail page must contain a lead capture form tied to that specific unit  
**FR-LEAD-02:** A general inquiry form must exist on the main contact page  
**FR-LEAD-03:** A consultation booking widget must be available (Calendly self-hosted alt: Cal.com)  
**FR-LEAD-04:** All leads must be stored in a database with: timestamp, unit interest, contact details, source URL  
**FR-LEAD-05:** CRM webhook or export must be supported (CSV export minimum; webhook to HubSpot/Pipedrive optional)  
**FR-LEAD-06:** Confirmation emails must be sent automatically on form submission  
**FR-LEAD-07:** Admin must be notified by email on each new lead  
**FR-LEAD-08:** Lead source tracking must capture UTM parameters and entry page  

### CMS & Content Management

**FR-CMS-01:** Client must be able to update unit availability status without developer involvement  
**FR-CMS-02:** Client must be able to add/update pricing without developer involvement  
**FR-CMS-03:** Gallery, press mentions, and news updates must be manageable via CMS  
**FR-CMS-04:** Developer profile, building specification, and location content must be editable  
**FR-CMS-05:** CMS must be self-hosted (Payload CMS, Directus, or similar — not WordPress for this use case)  

### Admin Requirements

**FR-ADMIN-01:** Admin dashboard must show: total leads by date, leads by unit, leads by source  
**FR-ADMIN-02:** Admin must be able to export lead data to CSV  
**FR-ADMIN-03:** Admin must be able to mark units as reserved or sold directly in the panel  
**FR-ADMIN-04:** Admin must be able to toggle price visibility globally  
**FR-ADMIN-05:** Role-based access: developer admin vs. sales agent view (Phase 2, but architecture must support it)  

### Analytics & Tracking

**FR-AN-01:** Self-hosted analytics must track: page views, walkthrough engagement, filter usage, CTA clicks  
**FR-AN-02:** Heatmaps and session replay are desirable (Plausible + OpenReplay or PostHog for self-hosted)  
**FR-AN-03:** All external tracking scripts must comply with GDPR/local data regulations  
**FR-AN-04:** UTM parameter capture must be implemented for all lead forms  
**FR-AN-05:** Walkthrough drop-off points must be trackable (which room users exit from)  

---

## 1.5 Non-Functional Requirements

### Performance
- Page load (Time to Interactive): < 3 seconds on 4G mobile
- Digital twin first interactive frame: < 4 seconds on broadband
- Image assets: WebP format, served via CDN or local CDN-equivalent (Nginx + cache headers)
- Lighthouse score target: Performance > 85, Accessibility > 90, SEO > 90

### Mobile Compatibility
- Full functionality on iOS Safari 15+ and Android Chrome 100+
- Walkthrough must be touch-navigable (swipe to pan, pinch to zoom)
- All forms must be usable on 375px viewport minimum
- No hover-dependent UI interactions as primary navigation

### Hosting Requirements
- Self-hosted on VPS (minimum 4 vCPU / 8GB RAM for 3D viewer; 2 vCPU / 4GB RAM for 360-based)
- Reverse proxy via Nginx with SSL termination (Let's Encrypt)
- Daily automated database backups (local + offsite S3-compatible storage)
- Zero-downtime deployment pipeline (Docker Compose or similar)
- Estimated asset storage: 2–20GB depending on twin approach

### Security
- HTTPS enforced on all routes
- Form submissions protected by rate limiting and honeypot CAPTCHA (not reCAPTCHA for privacy)
- Admin panel behind separate subdomain with 2FA
- No plain-text passwords stored; bcrypt minimum
- CSP headers configured to prevent XSS
- Dependency audit on all npm/composer packages before go-live

### Scalability
- Database schema must support multiple buildings (building_id foreign key on all unit records)
- Asset paths must be namespaced by building slug (e.g., /assets/building-a/unit-2bed/)
- CMS content types must support multi-building content without schema changes
- Horizontal scaling via containerization must be possible without architecture refactor

---

## 1.6 Technical Architecture Proposal

### Frontend Layer
**Recommended Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**Rationale:** SSG/SSR hybrid supports SEO requirements, React ecosystem for interactive components, Tailwind for rapid design fidelity  
**Deployment:** Self-hosted via Docker on VPS, Nginx reverse proxy

### Twin Viewer Layer
See Option A and Option B below.

### Asset Storage
- All panoramas, 3D scenes, floorplan SVGs, and renders stored on same VPS initially
- Path structure: `/public/assets/{building-slug}/{typology-slug}/{room-slug}/`
- If asset size exceeds 20GB, migrate to MinIO (self-hosted S3-compatible) behind Nginx

### Hosting Stack
```
VPS (Hetzner / DigitalOcean / Contabo)
  ├── Nginx (reverse proxy + SSL)
  ├── Next.js Frontend (Docker container)
  ├── Headless CMS (Payload CMS — Docker container)
  ├── PostgreSQL (Docker container)
  ├── Plausible Analytics (Docker container)
  └── MinIO (optional, if asset volume demands it)
```

### Data Source Structure
- **Units table:** id, building_id, floor, unit_code, typology, bedrooms, size_sqm, price, orientation, availability_status, walkthrough_id
- **Buildings table:** id, slug, name, phase, total_floors, launch_date
- **Leads table:** id, unit_id, name, email, phone, message, source_url, utm_params, created_at
- **Typologies table:** id, building_id, slug, label, size_range, floorplan_svg, walkthrough_path

### Integration Points
- **CRM:** Webhook to HubSpot / Pipedrive (optional) or CSV export to any system
- **Booking:** Cal.com self-hosted instance OR embedded Calendly (with privacy caveat)
- **Email:** SMTP via Resend or self-hosted Postal for transactional emails
- **Analytics:** Plausible self-hosted
- **Session Replay:** PostHog self-hosted (optional Phase 2)

---

### Option A — 360 Panorama-Based Digital Twin

**How it works:** Equirectangular 360° renders are produced per room per typology. A JavaScript panorama viewer (Pannellum, Marzipano, or Three.js with custom equirectangular shader) stitches them together with hotspot-based room transitions.

**Asset requirements:** 1–6 panorama images per room × 4–8 rooms per typology × number of typologies. Typically 20–80 JPEG/WebP images per building.

**Tech stack addition:** Pannellum (open source) or custom Three.js viewer embedded in Next.js page

**Pros:**
- Fast to implement — viewer libraries are mature and well-documented
- Low server resource consumption — static images served via Nginx
- Mobile-performant — no WebGL GPU dependency
- Asset production is a standard deliverable for most rendering studios
- Works on low-end devices and older browsers

**Cons:**
- Not truly "walkable" — transitions between rooms are cut-style, not continuous
- Perceived as less premium than real-time 3D by tech-forward audiences
- Static finishes — cannot show material variations or customization
- Each typology requires a full re-render if design changes

**Best for:** Projects with rendering studio already engaged, tight timelines, limited server budget, or older target demographics.

---

### Option B — Real-Time 3D Digital Twin

**How it works:** Architectural 3D model (Revit, SketchUp, FBX, or OBJ) is exported to a web-compatible format (glTF/GLB or via Three.js loader). A Three.js or Babylon.js scene renders the apartment interactively in the browser with first-person or orbit camera navigation.

**Asset requirements:** Clean, optimized 3D model per typology exported as glTF. Textures must be baked or PBR-mapped. Total file size target: < 15MB per typology after optimization (Draco compression, texture compression).

**Tech stack addition:** Three.js or Babylon.js scene within Next.js, model optimization pipeline (gltf-transform, Meshoptimizer), possibly Blender for model cleanup

**Pros:**
- Premium, immersive experience — true spatial understanding
- Camera movement is continuous, not jump-cut
- Material variations can be shown dynamically (different finishes, furnishing options)
- Future-proof for AR/VR extensions
- One model can generate multiple outputs (marketing renders, web viewer, printed plans)

**Cons:**
- Requires clean, optimized 3D source file — cannot work from renders alone
- Higher development complexity — custom camera controls, lighting setup, performance tuning
- Requires WebGL — older devices or low-end phones may struggle
- Loading time higher — requires aggressive optimization and progressive loading strategy
- Model file dependency means a design change requires model re-export and re-optimization

**Best for:** Projects where 3D models are already produced and handed over, developer has premium positioning, and timeline allows 4–6 weeks of twin development.

---

### Architecture Decision Matrix

| Factor | Option A (360°) | Option B (3D) |
|---|---|---|
| Asset availability | Renders only | Needs 3D model |
| Dev complexity | Low | High |
| Server requirements | Low | Medium |
| Mobile performance | Excellent | Moderate |
| Premium perception | Good | Excellent |
| Timeline to MVP | 3–4 weeks | 6–10 weeks |
| Cost to produce | Low | Medium–High |
| Scalability per typology | Linear cost | Front-loaded |

**Recommendation:** Default to Option A unless client can confirm delivery of optimized 3D models. Build the system to support Option B upgrade per typology in Phase 2.

---

## 1.7 MVP Definition

### Must Ship in MVP (Phase 1)
- Marketing homepage with building hero, overview, and gallery
- Apartment finder with filters: typology, bedrooms, availability
- Unit detail page (floorplan + metadata + lead form)
- At least one functional digital twin (360° panorama minimum)
- Lead capture form with database storage and admin email notification
- Admin panel: lead list, unit availability management
- Mobile-responsive at all breakpoints
- Basic analytics (Plausible self-hosted)
- Confirmation email on lead submission
- SSL, security headers, and production-hardened deployment

### Can Wait (Phase 2)
- Building floor stack visualization
- Agent access portal
- Consultation booking integration
- Session replay / heatmaps
- CRM webhook integration
- Multi-language support
- Building comparison view
- Mortgage/yield calculator

### Should NOT Be Built Initially
- Payment or deposit processing
- E-signature or legal document flow
- Real-time chat
- AI-assisted unit recommendation
- AR mobile feature
- VR headset mode
- Full ERP/property management integration

---

# SECTION 2 — CLIENT DISCOVERY PACK

---

## 2.1 Business & Sales Questions

**Sales Strategy**
- Is the primary sales channel through in-house agents, external brokers, or direct-to-buyer digital?
- Do you intend to soft-launch (invite-only) or full-public launch from day one?
- Is there a phased release of units (launch with 30%, hold the rest)?
- Do you currently have a CRM in use? If yes, which one?
- Who is responsible for following up with leads — and within what SLA?
- What does your current sales funnel look like before this platform exists?

**Pricing Transparency**
- Will pricing be publicly visible on the website, or behind inquiry?
- Is pricing fixed or will it escalate in tranches as units sell?
- Who controls pricing updates — developer, sales team, or external agent?
- Are there any legal restrictions in your jurisdiction on publishing off-plan pricing?

**Update Frequency**
- How often do you expect to update availability (daily, weekly, on each reservation)?
- Who on the client team will manage the CMS? What is their technical comfort level?
- Will finishes, specifications, or floorplans change between launch and construction?

**Sales Funnel Expectations**
- What is your target: inquiries, reservations, or signed contracts as success metrics?
- What is the expected timeline from digital launch to first sales events?
- Is there a physical launch event or showroom opening to align the digital platform with?

---

## 2.2 Asset & Technical Questions

**3D Model Access**
- Has a 3D architectural model been produced for this development?
- If yes: Which software? (Revit, ArchiCAD, SketchUp, Blender, other)
- If yes: What level of detail is modeled? (Structure only, or with interior finishes, furniture, and lighting?)
- Who owns the 3D model — the architect, the developer, or the rendering studio?
- Is the model available for export and use in a web viewer, or are there licensing restrictions?

**Render Capabilities**
- Has a rendering studio been engaged?
- Are 360° equirectangular renders part of the existing scope with the studio?
- If not: Can 360° panoramas be added to the rendering brief? What would the additional cost be?
- Are there existing high-resolution static renders we can use for gallery and hero sections?

**File Formats & Handover**
- What file formats can the rendering/architecture team deliver?
- For 3D: FBX, OBJ, glTF, or Blender file preferred. Can they export in any of these?
- For 360°: Equirectangular JPEG or TIFF at minimum 6000×3000 px per room
- What is the expected delivery timeline for digital assets?

**Lighting & View Variations**
- Should walkthroughs be shown in daytime, golden hour, or night lighting?
- Are there view variations by floor that need to be represented? (Low floor vs. penthouse view)
- Will furnished and unfurnished versions be required?

---

## 2.3 Inventory Structure Questions

**Building Structure**
- How many buildings or phases are included in this development?
- Total number of floors per building?
- Total number of units across all floors?

**Typologies**
- How many distinct apartment typologies exist? (e.g., 1-bed Type A, 2-bed Type B, penthouse)
- Do units differ floor-by-floor in any way beyond view? (Different ceiling heights on top floors, terrace additions, etc.)
- Is there commercial ground floor space that should be shown or excluded?

**Customization Options**
- Will buyers be offered finish selections (flooring, cabinetry, tile colors)?
- If yes: Is this a standard/premium tier choice, or fully bespoke?
- Should the digital platform show these variations, or is that handled offline post-reservation?

**Availability Workflow**
- How does a unit move from Available → Reserved → Sold in your process?
- Is reservation confirmed by deposit, contract signature, or verbal agreement?
- Who triggers the status update in your system — sales agent, legal team, or admin?
- Should Reserved units remain browsable, or be hidden from the finder?

---

## 2.4 Marketing & Branding Questions

**Target Demographic**
- Primary nationality/location of target buyers?
- Age range and income bracket being targeted?
- Is there a diaspora buyer segment? If so, which countries?

**Market Positioning**
- How is this development positioned: luxury, premium mid-market, or accessible?
- What is the unique selling proposition of this development vs. competing projects in the same city/area?
- Are there specific lifestyle themes to emphasize (family, investment, urban living, nature proximity)?

**Tone and Messaging**
- What is the brand personality for this development? (Words: sophisticated, bold, calm, modern, warm, etc.)
- Does a brand identity (logo, typefaces, color palette) already exist for this project?
- Who is the copywriter or who approves all website copy?

**Languages Required**
- Does the website need to function in more than one language for launch?
- If yes: Who will provide translations and maintain them?
- Is right-to-left (Arabic, Hebrew) script support required?

---

## 2.5 Legal & Compliance Questions

**Disclaimers**
- Are there mandatory legal disclaimers required for off-plan sales in this jurisdiction?
- Must renders and walkthroughs include a specific "computer-generated imagery" notice?
- Are there restrictions on quoting or displaying floor areas (local measurement standards)?

**Pricing Visibility Restrictions**
- Are there regulations prohibiting public listing of off-plan prices before a certain stage?
- Is VAT inclusive or exclusive pricing required to be specified?

**Data Privacy Requirements**
- What jurisdiction governs data collection from buyers? (GDPR, local equivalent?)
- Is a Privacy Policy and Cookie Consent mechanism legally required for this website?
- How long must lead data be retained, and must users be able to request deletion?
- Will data be shared with third parties (brokers, agent partners)? If so, consent must be captured.

---

# SECTION 3 — VISUALIZATION STRATEGY FRAMEWORK

---

## 3.1 How the Apartment Should Be Showcased

### Entry Point Experience
The first interaction with the digital twin is critical. It must not feel like a technical demo — it must feel like walking into a home.

**Recommended entry flow:**
1. User selects a unit from the apartment finder (or lands from a campaign link)
2. Unit detail page loads with: hero render, typology name, key specs, floorplan
3. A single prominent CTA: **"Explore this apartment"** opens the twin in fullscreen or immersive panel
4. Twin begins in the living room (highest-impact room) — never in a corridor or bathroom
5. First hotspot visible immediately — highlights a premium feature (e.g., ceiling height, window width, view)

**What to avoid at entry:**
- Loading screens over 3 seconds without a progress indicator
- Immediate prompt for contact details before exploration
- Text-heavy instructions ("use arrow keys to navigate") — controls must be discoverable

### Navigation Model
**For 360° (Option A):** Hotspot-based room-to-room navigation is standard. Each room has 2–4 connection points. Navigation menu (persistent bottom bar) shows room names for direct jump.

**For 3D (Option B):** First-person click-to-move navigation (not WASD keys — too gaming-like for a buyer audience). Room-based zones with gentle auto-centering when entering a new space. Include an "auto-tour" mode that moves the user through the full apartment on a scripted path — activated by one button, interruptible at any time.

### Floorplan Integration
- Persistent mini-floorplan overlay in corner (desktop) or slide-up panel (mobile)
- Current room highlighted in the floorplan in real time
- User can click a room on the floorplan to jump directly to it
- Floorplan SVG must be clean, dimensioned, and match the walkthrough layout exactly — any discrepancy destroys trust

### Balcony / View Simulation
- If 3D model: the balcony scene should show a photorealistic skybox of the actual view from that floor, rendered from the correct coordinates
- If 360° panoramas: include at least one balcony/window-facing panorama per typology — this is often the most viewed scene
- Consider floor-level variants for units on different floors where view changes materially (low, mid, high)
- Never show a generic view — the specific location and orientation must be accurate

### Highlighting Premium Features
Features should be surfaced through hotspots, not through text walls. Each hotspot:
- Has a small, clean icon (info circle or sparkle)
- Opens a tooltip or panel with 1–3 sentences maximum
- Can include a close-up render or material swatch
- Must not interrupt navigation flow — tap to open, tap to close

**Premium features to spotlight per room type:**
- Living room: ceiling height, window dimensions, flooring material, storage
- Kitchen: appliance brands, worktop material, cabinet height, natural light
- Master bedroom: wardrobe dimensions, en-suite access, floor-to-ceiling ratio
- Bathroom: tile brand/origin, fixture brand, shower vs. bath decision
- Balcony: orientation, sqm, railing type, view

---

## 3.2 Emotional Experience Design

### Creating Confidence
Off-plan buyers carry a fundamental fear: **"What if it doesn't look like this when it's built?"**

To address this:
- Every walkthrough must include a visible legal disclaimer: "Renders are indicative. Finishes may vary within specified ranges." — but this must be subtle, not a frightening disclaimer block.
- Show **specification pages** directly from the twin — material specs, brand names, tolerances. These prove the developer has thought through details.
- Include **developer track record** access from within the walkthrough or unit page — previous completed projects, delivery dates, testimonials.
- Show **construction progress** in Phase 2 — a time-lapse or milestone photo feed that proves work is happening.

### Creating Desire
- Music (ambient, subtle, opt-in) can increase time-on-site and emotional resonance — test this with client
- The twin tour should always start in the most emotionally resonant space — usually the living room at golden-hour lighting with view visible through the window
- High-end furnishing in renders signals lifestyle, not just floor space — furniture should be aspirational but not alienating
- Finishes must be consistent with the stated market position — luxury finishes shown in a mid-market project creates trust issues when reality doesn't match

### Reducing Uncertainty in Off-Plan Projects
The biggest conversion blocker in off-plan is uncertainty. The platform must actively reduce it:

- **Specification lock-in messaging:** "Your apartment will include exactly these finishes. No substitutions." (if true — only say what is contractually committed)
- **Construction timeline visible on every page** — current phase, expected handover quarter
- **FAQ section specifically addressing off-plan concerns:** Can I visit a physical showroom? What if design changes? What happens to my deposit?
- **Show the team** — architect, developer principal, project manager with names and photos. Buyers buy from people.

---

## 3.3 Conversion Integration

### Where CTAs Appear
CTAs must appear at every natural exit point in the buyer journey:

| Location | CTA Text | Action |
|---|---|---|
| After 30 seconds in twin | "Interested in this apartment?" | Scroll-up form or drawer |
| Floorplan overlay | "Request detailed plans" | Email gate |
| End of auto-tour | "Book a consultation" | Booking widget |
| Unit detail page header | "Register interest" | Lead form |
| Apartment finder — on hover/tap of each unit | "View + Enquire" | Unit detail page |
| After filter shows 0 results | "Tell us what you need" | Custom inquiry form |
| Exit intent (desktop) | "Save this apartment to your shortlist" | Email capture |

### When to Prompt Booking
Prompting too early destroys trust. Prompting too late loses momentum.

**Trigger booking prompt:**
- After user has viewed at least 2 rooms in the twin (30+ seconds in walkthrough)
- After user has viewed 2+ unit detail pages
- When user directly navigates to the Contact page
- When user completes the apartment finder and clicks a specific unit (bottom of detail page)

**Never prompt booking:**
- As a pop-up on first page load
- During the first 10 seconds of the walkthrough
- Immediately after a previous prompt was dismissed

### Transitioning from Exploration to Contact
The transition from digital exploration to human contact is the highest-leverage moment. Design it carefully:

1. After the user has engaged meaningfully (twin viewed, unit selected), show a **soft prompt** — not a modal, but a persistent bottom bar: "You've been exploring Unit 204. Ready to take the next step?"
2. The form should be minimal: Name, Email, Phone (optional), "Anything specific you'd like to know?" — no lengthy fields
3. After submission, the confirmation page should: thank them by name, show the unit they inquired about, state exactly what happens next ("A member of our sales team will contact you within 24 hours")
4. The sales team's follow-up email should reference the specific unit and include the twin link — creating continuity from digital exploration to human conversation

---

# SECTION 4 — RISK ANALYSIS

---

## 4.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| 3D model is too heavy for web — causes slow load or crashes | High | High | Establish < 15MB GLB target from day one; build Draco compression into pipeline; have 360° fallback ready |
| 360° panoramas delivered in wrong format or resolution | Medium | High | Provide rendering studio with a precise delivery spec document (resolution, format, file naming convention) before work begins |
| Walkthrough not performant on mobile | Medium | High | Test on mid-range Android device throughout development, not just at QA |
| CMS platform chosen becomes a maintenance burden | Low | Medium | Use Payload CMS or Directus — both have active communities and are TypeScript-native |
| Self-hosted infrastructure goes down during sales launch | Low | Critical | Set up uptime monitoring (Uptime Kuma, self-hosted) + daily backups; test failover before launch |

## 4.2 Asset Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Client cannot deliver 3D model — only flat renders | High | High | Design system to work with 360° panoramas as primary; 3D as upgrade |
| Renders delivered late, blocking development | High | High | Decouple twin development from site development — build site with placeholder assets |
| Floorplan SVGs not provided — only PDFs or raster images | Medium | Medium | Trace or redraw in-house; charge as scope addition; build into discovery estimation |
| View from balcony not rendered per floor level | Medium | Medium | Identify this in discovery; flag as premium add-on if needed |
| Renders do not match final building specifications | Low | High | Implement legal disclaimer system at CMS level from day one |

## 4.3 Scope Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Client expands scope mid-project without budget adjustment | High | High | Rigid MVP scope document signed off before development begins; change request process defined |
| "While you're at it" requests for CRM integration, booking system, calculator | High | Medium | Everything outside V1 scope has a Phase 2 card with its own estimate |
| Multiple buildings added to scope after architecture is designed | Medium | Medium | Design multi-building architecture from day one even if only one building ships |
| Client requests per-unit twin (not per-typology) | Medium | High | Flag in discovery that per-unit = 10–30× asset volume; recommend per-typology as standard |

## 4.4 Performance Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Asset delivery over slow connection in target market | Medium | High | Implement progressive image loading; serve WebP; enable Nginx gzip; use lazy loading for below-fold assets |
| VPS overwhelmed on launch day traffic spike | Low | High | Pre-scale VPS 48 hours before launch; implement Nginx rate limiting; consider Cloudflare free tier as DDoS buffer |
| Walkthrough fails on iOS Safari | Medium | High | Test panorama viewer and WebGL scene on actual iPhone/iPad, not simulator |

## 4.5 Client-Side Bottlenecks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Slow asset delivery from architect/rendering studio | High | High | Include asset delivery deadlines in project contract; create placeholder system for development continuity |
| Approvals take too long — copy, legal disclaimers, pricing | High | Medium | Establish approval SLAs in kickoff; identify single decision-maker on client side |
| CMS training not completed before handover | Medium | Medium | Provide video walkthrough of CMS; 30-minute live session; written cheatsheet for availability updates |
| No one assigned to manage leads post-launch | Medium | Critical | Define lead management ownership in discovery; build automatic lead email notification so it cannot fall through |

---

# SECTION 5 — IMPLEMENTATION ROADMAP

---

## Phase 0 — Validation (Week 1–2)

**Goal:** Reduce risk before writing a line of production code.

**Activities:**
- Complete client discovery session using Discovery Pack (Section 2)
- Audit all available assets: 3D models, renders, floorplans, brand files
- Confirm twin approach: 360° (Option A) or 3D (Option B) or hybrid
- Align on number of typologies for V1
- Sign off MVP scope document
- Define asset delivery deadlines with rendering studio (or establish if assets need to be produced)
- Choose and spin up VPS; configure Nginx + Docker Compose skeleton
- Agree tech stack (Next.js + Payload CMS + PostgreSQL)

**Decision Checkpoint 0A:** If 3D model files are not available by end of Week 2 → proceed with 360° panorama approach for V1 and schedule 3D upgrade in Phase 2.

**Decision Checkpoint 0B:** If no panoramas are available either → build site V1 without walkthrough; insert twin as Phase 1 addition once assets arrive. Do not block site launch on asset delay.

---

## Phase 1 — MVP (Week 3–8)

**Goal:** Ship a working, production-grade platform with all core buying-journey components.

**Week 3–4: Foundation**
- Next.js project structure, routing, design system (Tailwind + typography + color tokens)
- Headless CMS installation and schema setup (units, buildings, typologies, leads)
- Database schema implementation (PostgreSQL)
- Basic homepage: hero, building overview, key stats, gallery

**Week 5–6: Core Features**
- Apartment finder: filter panel, unit grid, availability status display
- Unit detail pages (dynamic routes from CMS)
- Lead capture forms: unit-specific + general inquiry
- Lead storage + admin notification email
- 360° twin integration for 1 typology (Pannellum or custom viewer)
- Floorplan SVG integration with room labels

**Week 7–8: Polish + Launch Prep**
- Mobile optimization pass across all pages and twin viewer
- Admin panel: lead management, unit status update
- Analytics setup (Plausible self-hosted)
- Security hardening: CSP headers, rate limiting, CAPTCHA
- Performance audit: Lighthouse, image optimization, load time testing
- UAT with client: content review, form testing, CTA flow review
- DNS cutover, SSL, go-live

**MVP Deliverable:** Live, production-hardened platform with homepage, apartment finder, unit detail pages, one digital twin walkthrough, lead capture, and admin panel.

---

## Phase 2 — Enhancement (Week 9–16)

**Goal:** Increase conversion rate and platform depth based on live data.

**Conversion Enhancements**
- Consultation booking integration (Cal.com self-hosted)
- Exit intent capture (email shortlisting)
- Floor stack visualization (interactive building cross-section)
- Additional twin typologies (remaining unit types)
- View variations per floor (low/mid/high floor panoramas where views differ)

**Analytics & Sales Ops**
- Session replay integration (PostHog self-hosted)
- CRM webhook (HubSpot or Pipedrive) or enhanced CSV export
- UTM-based lead source reporting in admin
- A/B testing framework for CTA copy/placement

**Content & Trust**
- Construction progress update section (photo milestones)
- Developer track record case study section
- FAQ section (off-plan-specific)
- Press and media mentions

**Decision Checkpoint 2A:** If 3D model files have been received and are of adequate quality → initiate 3D twin development pipeline for priority typology (master plan, optimize, integrate into existing viewer system).

---

## Phase 3 — Expansion (Month 4+)

**Goal:** Extend the platform to additional buildings, phases, or product lines without architectural changes.

**Multi-Building Support**
- Activate multi-building routing (/buildings/tower-b/)
- CMS content type duplication for new building
- New typologies and walkthrough assets added via CMS

**Agent & Partner Layer**
- Role-based CMS access for external agents
- Deep-linkable unit share pages with agent tracking codes
- Optional: agent-specific pricing or allocation visibility

**Market Expansion**
- Multi-language support (i18n routing in Next.js)
- Currency display options for diaspora buyers
- Accessibility audit (WCAG 2.1 AA compliance)

**Platform Intelligence (Optional)**
- Unit recommendation engine based on browsing behavior
- Mortgage / rental yield calculator with configurable assumptions
- AI chatbot for FAQ handling (self-hosted LLM via Ollama, or API-based)

---

## Asset-Dependency Decision Tree

```
Client has 3D model?
├── YES → Is it clean and exportable?
│         ├── YES → Option B (3D Twin) for Phase 1
│         └── NO  → Option A (360°) for Phase 1, 3D in Phase 2
└── NO  → Can rendering studio produce 360° panoramas?
          ├── YES → Option A (360°) for Phase 1
          └── NO  → Launch site without twin; twin added in Phase 2
                    when assets are ready. Do not delay site.
```

---

*Document Version 1.0 — Prepared by Eryze Studio*  
*Review and update following client discovery session.*

---

# SECTION 6 — PROJECT MANAGEMENT PLAN

---

## 6.1 Project Context

**Client:** Family contact (Kyustendil, Bulgaria)  
**Developer:** Eryze Studio  
**Billing rate:** €25–30/hour  
**Billing model:** Monthly invoices tied to delivered milestones — not hourly timesheets, not end-of-project lump sum  
**Starting scope:** One building, Building A  
**Growth plan:** Architecture and processes must support additional buildings from day one — each new building is a billable expansion, not a rebuild  
**Jurisdiction note:** Bulgaria is an EU member state. GDPR applies in full. Cookie consent and a Privacy Policy are legally required. All data stored on EU-based servers.  
**Language:** Website must support Bulgarian as primary language. English optional in Phase 2.

---

## 6.2 What You Need to Prepare Before the Project Starts

This is everything that must be in place or in motion before you write a line of production code. Missing any of these will create friction mid-project.

### From You (Eryze)

**Tooling setup**
- Project management tool configured (Linear, Notion, or Basecamp — pick one and commit)
- Shared folder structure ready (Google Drive or equivalent): `/[Project Name]/Assets/`, `/Deliverables/`, `/References/`, `/Contracts/`
- Git repository created (private, GitHub or GitLab)
- Development VPS provisioned and base stack running (Nginx, Docker Compose, SSL)
- Staging subdomain live before Month 1 ends (e.g., staging.buildingname.bg)
- Your own local dev environment tested end-to-end

**Documents to prepare before kickoff**
- One-page project agreement (see 6.3)
- Asset delivery checklist (hand to client at kickoff)
- Discovery session agenda (Section 2 of this document)
- Monthly milestone sheet (see 6.5)

**Accounts to create**
- Domain registration (if client doesn't have one) — recommend .bg for local trust
- VPS account (Hetzner recommended — EU-based, reliable, affordable)
- Transactional email account (Resend free tier covers early stage)
- Plausible Analytics self-hosted instance or Plausible Cloud if self-hosting is overkill at this stage

### From the Client (Before Month 1)

Create a checklist document and share it at kickoff. Do not proceed without these:

| Asset | Required for | Deadline |
|---|---|---|
| Brand files (logo, colors, fonts) | Month 1 | Before design starts |
| Building name and developer name | Month 1 | Kickoff |
| Floorplans (PDF minimum, SVG preferred) | Month 2 | Before Apartment Finder dev |
| Unit inventory list (typologies, floors, sqm, price) | Month 2 | Before Apartment Finder dev |
| 360° panorama renders OR decision on twin approach | Month 3 | Before Twin dev |
| High-res marketing renders (minimum 5) | Month 1 | For homepage gallery |
| Legal disclaimer text | Month 1 | Before any content goes live |
| Contact details for the sales team | Month 1 | For lead routing |
| CRM details (if they use one) | Month 2 | For lead integration |
| Copy/text content (or approval to write it) | Month 1–2 | Rolling |

**Critical rule:** If client assets are not delivered on time, the affected month shifts. The payment schedule adjusts accordingly. This must be in the written agreement.

---

## 6.3 Written Agreement (What to Cover)

This does not need to be a legal contract drafted by a lawyer. It does need to exist in writing — email confirmation is acceptable as a minimum. Cover these points:

1. **Scope of work** — reference this document and the monthly milestone sheet
2. **Rate** — €25–30/hour, billed monthly against completed milestones
3. **Payment terms** — invoice sent at end of each month upon milestone approval; payment due within 7 days
4. **Asset responsibility** — client is responsible for delivering listed assets by agreed dates
5. **Schedule impact clause** — late asset delivery shifts the timeline; the developer is not penalized for client delays
6. **Change requests** — any work outside the agreed monthly scope is estimated and approved before being started; it does not delay the current milestone
7. **IP and ownership** — client owns the final product upon full payment; Eryze retains right to reference the project in portfolio
8. **Hosting responsibility post-launch** — client pays for hosting costs directly, or Eryze bills them at cost with no markup (decide which)
9. **Retainer option** — after launch, ongoing maintenance available at same hourly rate, minimum 2 hours/month

---

## 6.4 Communication Plan

**Weekly rhythm**
- One async update per week (written, not a call) — what was completed, what is next, any blockers
- Send via WhatsApp or email depending on client preference — match their communication style
- Do not make the client chase you for updates; send before they ask

**Monthly rhythm**
- End-of-month: share staging link with the completed milestone
- Client reviews and approves (or gives feedback) within 3 business days
- On approval: send invoice
- Invoice paid: start next month's work

**Calls/meetings**
- Kickoff session: 90 minutes (use Section 2 discovery framework)
- Mid-project check-in: once per month, 30 minutes, only if needed — async updates should make this optional
- Launch review: 60 minutes walkthrough of the live site together

**What to avoid**
- WhatsApp voice notes as approval for scope changes — always confirm in writing
- Verbal agreements about new features — log everything as a message or email
- Showing work-in-progress before it is genuinely ready — set expectations correctly

---

## 6.5 Monthly Milestone Plan with Hour Estimates

All estimates assume: client delivers assets on time, copy is written or approved promptly, and no major scope changes occur.

---

### Month 1 — Foundation & Homepage

**Deliverable:** Fully designed and developed homepage, design system, project infrastructure

**Work included:**
- Discovery session + written scope confirmation
- VPS setup, domain, staging environment
- Design system: typography, color tokens, spacing, component library foundation
- Homepage: hero section, building overview, key stats, gallery, location section, contact CTA
- CMS installation and basic schema setup
- Basic SEO setup (meta tags, OG tags, sitemap structure)

**What the client approves:** Staging URL with live homepage that matches agreed design direction

**Hour estimate:** 55–70 hours  
**Invoice at €27.50/hr average:** €1,510 – €1,925

---

### Month 2 — Apartment Finder & Unit System

**Deliverable:** Fully functional inventory and unit detail system connected to CMS

**Work included:**
- Apartment Finder: filter panel (typology, bedrooms, floor, availability, price range)
- Unit grid/list view with availability status display
- Unit detail pages (dynamic routes from CMS, floorplan display, key specs)
- CMS content types for units, buildings, typologies fully configured
- Client CMS training session (30 min) so they can manage unit data themselves
- Lead capture form on each unit detail page (stored in database)
- Admin email notification on new lead

**What the client approves:** Functional apartment finder on staging; client can add/edit units in CMS without developer help

**Hour estimate:** 60–75 hours  
**Invoice at €27.50/hr average:** €1,650 – €2,062

---

### Month 3 — Digital Twin Integration & Lead System

**Deliverable:** Working digital twin for at least one typology, complete lead system, consultation booking

**Work included:**
- 360° panorama viewer integration (Pannellum or custom) for primary typology
- Floorplan mini-map overlay with current room indicator
- Hotspot system for premium feature highlights
- General inquiry form and contact page
- Consultation booking integration (Cal.com self-hosted or embedded)
- Lead database: full lead record with unit ID, UTM params, source URL
- CRM export (CSV minimum; webhook if client uses HubSpot or Pipedrive)
- Confirmation email to lead on submission

**What the client approves:** Full buyer journey testable on staging — find a unit, explore the twin, submit a lead, receive confirmation

**Asset dependency:** 360° panorama renders must be delivered by end of Week 1 of Month 3. If delayed, twin moves to Month 4 and Month 3 delivers only the lead system (partial invoice accordingly).

**Hour estimate:** 65–80 hours  
**Invoice at €27.50/hr average:** €1,787 – €2,200

---

### Month 4 — Polish, Analytics, Testing & Launch

**Deliverable:** Production-ready platform, live at client's domain

**Work included:**
- Mobile optimization audit and fixes across all pages and twin viewer
- Performance audit: Lighthouse, image optimization, WebP conversion, lazy loading
- Self-hosted Plausible analytics with walkthrough engagement events
- Security hardening: CSP headers, rate limiting, honeypot CAPTCHA, HTTPS enforcement
- Admin panel: lead list view, unit status management, CSV export
- Cookie consent banner (required under GDPR / Bulgarian law)
- Privacy Policy and Terms of Use pages (client provides legal text or approves template)
- UAT session with client: end-to-end walkthrough of all features
- Bug fixes from UAT
- DNS cutover, final SSL, go-live
- Post-launch monitoring: 48 hours of active watching

**What the client approves:** Live site at production domain

**Hour estimate:** 50–65 hours  
**Invoice at €27.50/hr average:** €1,375 – €1,787

---

### Total Project Estimate

| Month | Deliverable | Hours | Est. Invoice |
|---|---|---|---|
| Month 1 | Foundation & Homepage | 55–70 | €1,510 – €1,925 |
| Month 2 | Apartment Finder & Unit System | 60–75 | €1,650 – €2,062 |
| Month 3 | Digital Twin & Lead System | 65–80 | €1,787 – €2,200 |
| Month 4 | Polish, Analytics & Launch | 50–65 | €1,375 – €1,787 |
| **Total** | | **230–290 hours** | **€6,322 – €7,974** |

Actual invoice each month is based on logged hours × agreed rate. Keep a simple time log — even a spreadsheet or Toggl — so you can show hours if asked.

---

## 6.6 Multi-Building Growth Plan

This is the section most studios skip. Do not skip it.

Every decision made in Month 1–4 must be made with future buildings in mind. Here is what to do concretely.

### Architecture Decisions That Enable Growth

**Database**
- Every table has a `building_id` foreign key from day one — even when only one building exists
- Buildings table created in Month 1 schema setup, even if it has one row
- Unit codes include building prefix: `A-101`, not just `101`

**CMS**
- Content types are building-scoped: typologies, units, and walkthroughs all belong to a building
- Adding Building B means creating a new building record and populating its content — no schema changes
- CMS permissions can be scoped per building in Phase 3 (different sales teams per building)

**Routing**
- URL structure from day one: `/buildings/[building-slug]/apartments/[unit-slug]`
- Homepage can become a development overview with multiple buildings when the time comes
- Each building can have its own sub-brand while sharing the platform

**Asset storage**
- All assets namespaced from day one: `/assets/building-a/typology-2bed/living-room.webp`
- Adding a new building means creating a new folder namespace — no file conflicts

**Frontend**
- Design system built generically — colors, fonts, and logos are tokens pulled from CMS, not hardcoded
- Building B could have a different accent color without touching component code

### Billing Model for Additional Buildings

When Building B is added, this is a scoped expansion — not a Phase 1 re-run. Estimate:

| Addition | Hours | Est. Cost |
|---|---|---|
| New building configuration in CMS | 3–5 hrs | €82 – €137 |
| New unit inventory import | 2–4 hrs | €55 – €110 |
| New typology pages and floorplans | 8–15 hrs | €220 – €412 |
| New digital twin typologies (per typology, 360°) | 10–15 hrs each | €275 – €412 each |
| New digital twin typologies (per typology, 3D) | 20–35 hrs each | €550 – €962 each |
| Design adaptation (if different sub-brand) | 5–10 hrs | €137 – €275 |

This is the compounding value of this project for Eryze. The second building costs the client significantly less than the first, and costs you significantly less time. That margin is your reward for building it right the first time.

---

## 6.7 What to Track During the Project

**Time tracking**
Log hours at task level, not just daily totals. This protects you if a month runs over and you need to explain why. Use Toggl, Clockify (free), or a simple spreadsheet.

**Decisions log**
Every time a decision is made that affects scope, architecture, or design — log it. Date, decision, who made it, why. A simple Notion page or Google Doc is enough. When the client says "I thought we agreed to X" three months later, you have receipts.

**Asset delivery log**
Track when each client asset was requested, when it was due, and when it arrived. If a month slips because renders were late, this log is what you reference in the conversation.

**Staging changelog**
Every time you push to staging, send the client a brief note: what changed, what you need from them, and the URL. Never make them guess what's new.

---

## 6.8 Risks Specific to This Project Context

| Risk | Why It's Specific Here | Mitigation |
|---|---|---|
| Family relationship creates pressure to skip the written agreement | Skipping it is more likely to damage the relationship than having it | Frame it as professionalism, not distrust — "this protects both of us" |
| Scope expands informally over coffee | Easy to happen with a family friend | Log every scope conversation in writing immediately after; "I'll add that to the Phase 2 list" is a valid answer |
| Assets arrive late from architect or rendering studio in Kyustendil | Smaller market, fewer specialist studios | Identify the rendering studio in discovery; get their timeline confirmed before signing off Month 3 |
| Client unfamiliar with CMS — updates don't happen | Common in non-tech clients | Deliver a simple 2-page visual cheatsheet for the 3 most common CMS tasks |
| GDPR compliance not taken seriously locally | Bulgarian enforcement is lighter than Western EU but liability still exists | Implement it correctly anyway — protects the client and reflects well on Eryze |
| "While we're at it" expansions from family dynamic | Harder to say no | Maintain the Phase 2 list actively; review it together at each monthly call so they feel heard without it becoming unbillable work |


---

# SECTION 7 — TECHNICAL ARCHITECTURE, DATA FLOW & DATABASE SCHEMA

---

## 7.1 Full System Architecture

### Logical Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│  BROWSER CLIENT                                                       │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │  Next.js Pages │  │  Twin Viewer     │  │  Admin Panel        │  │
│  │  (SSR / ISR)   │  │  (Pannellum /    │  │  (admin.domain.bg)  │  │
│  │                │  │   Three.js)      │  │                     │  │
│  └────────────────┘  └──────────────────┘  └─────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────▼────────────────────────────────────┐
│  VPS — Hetzner CX21 (2 vCPU / 4GB RAM)                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Nginx (reverse proxy, SSL termination, gzip, cache headers) │    │
│  │  Ports: 80 → 443 redirect │ 443 → upstream routing          │    │
│  └──────┬──────────────────────────────────────────────┬────────┘    │
│         │ /                                            │ /cms        │
│  ┌──────▼──────────┐                        ┌─────────▼──────────┐  │
│  │  Next.js App    │                        │  Payload CMS       │  │
│  │  :3000          │                        │  :3001             │  │
│  │  (Docker)       │◄──── REST API ────────►│  (Docker)          │  │
│  └──────┬──────────┘                        └─────────┬──────────┘  │
│         │                                             │              │
│  ┌──────▼──────────────────────────────────┐         │              │
│  │  PostgreSQL :5432 (Docker)              │◄────────┘              │
│  │  Managed by Payload CMS (Drizzle ORM)   │                        │
│  └─────────────────────────────────────────┘                        │
│                                                                       │
│  ┌──────────────────────┐    ┌───────────────────────┐              │
│  │  Plausible Analytics │    │  MinIO (optional)     │              │
│  │  :8000 (Docker)      │    │  :9000 (Docker)       │              │
│  └──────────────────────┘    └───────────────────────┘              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Uptime Kuma :3002 (Docker) — monitoring                    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼──────┐  ┌───────▼──────┐  ┌────────▼──────┐
    │  Resend SMTP   │  │  Cal.com     │  │  S3 Backup    │
    │  (email)       │  │  (booking)   │  │  (offsite)    │
    └────────────────┘  └──────────────┘  └───────────────┘
```

### Container Network Map

```yaml
# All containers on internal Docker bridge network: re_network
# Only Nginx exposes external ports (80, 443)

nextjs:    internal :3000   — Next.js App Router
payload:   internal :3001   — Payload CMS API + Admin UI
postgres:  internal :5432   — PostgreSQL 15
plausible: internal :8000   — Plausible Analytics
minio:     internal :9000   — Asset storage (Phase 2)
kuma:      internal :3002   — Uptime monitoring
```

---

## 7.2 Next.js Project Structure

```
/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/              # Route group — public pages
│   │   ├── page.tsx              # Homepage /
│   │   ├── layout.tsx            # Marketing layout (nav, footer)
│   │   ├── about/page.tsx        # Developer profile
│   │   └── contact/page.tsx      # General inquiry
│   │
│   ├── buildings/                # Building routes
│   │   └── [building-slug]/
│   │       ├── page.tsx          # Building overview
│   │       └── apartments/
│   │           ├── page.tsx      # Apartment finder /buildings/a/apartments
│   │           └── [unit-slug]/
│   │               └── page.tsx  # Unit detail /buildings/a/apartments/unit-204
│   │
│   ├── typologies/
│   │   └── [typology-slug]/
│   │       └── page.tsx          # Typology landing /typologies/2bed-type-a
│   │
│   ├── twin/
│   │   └── [typology-slug]/
│   │       └── page.tsx          # Fullscreen twin viewer
│   │
│   ├── api/                      # Next.js API routes
│   │   ├── leads/
│   │   │   └── route.ts          # POST /api/leads
│   │   ├── units/
│   │   │   └── route.ts          # GET /api/units (filtered)
│   │   └── webhooks/
│   │       └── payload/route.ts  # Payload CMS revalidation hook
│   │
│   └── layout.tsx                # Root layout (fonts, globals)
│
├── components/
│   ├── ui/                       # Primitive components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── FormField.tsx
│   │
│   ├── finder/                   # Apartment finder components
│   │   ├── FilterPanel.tsx
│   │   ├── UnitGrid.tsx
│   │   ├── UnitCard.tsx
│   │   └── FilterStore.ts        # Zustand store for filter state
│   │
│   ├── twin/                     # Digital twin components
│   │   ├── TwinViewer.tsx        # Main viewer wrapper
│   │   ├── PannellumViewer.tsx   # 360° panorama viewer
│   │   ├── FloorplanOverlay.tsx  # Mini-floorplan with room tracking
│   │   ├── HotspotLayer.tsx      # Feature hotspot system
│   │   ├── RoomNav.tsx           # Bottom room navigation bar
│   │   └── LeadDrawer.tsx        # In-twin lead capture slide-in
│   │
│   ├── leads/
│   │   ├── LeadForm.tsx          # Reusable lead capture form
│   │   └── BookingWidget.tsx     # Cal.com embed wrapper
│   │
│   └── layout/
│       ├── Nav.tsx
│       ├── Footer.tsx
│       └── CookieBanner.tsx
│
├── lib/
│   ├── payload.ts                # Payload CMS client (REST)
│   ├── db.ts                     # Direct PostgreSQL client (for leads API)
│   ├── email.ts                  # Resend email helpers
│   ├── analytics.ts              # Plausible event tracking helpers
│   └── utm.ts                    # UTM parameter extraction utility
│
├── types/
│   ├── payload-types.ts          # Auto-generated from Payload schema
│   ├── unit.ts
│   ├── lead.ts
│   └── building.ts
│
├── public/
│   └── assets/
│       └── building-a/           # Namespaced per building
│           ├── typology-1bed-a/
│           │   ├── living-room.webp
│           │   ├── bedroom.webp
│           │   ├── kitchen.webp
│           │   ├── bathroom.webp
│           │   └── balcony.webp
│           ├── typology-2bed-a/
│           └── floorplans/
│               ├── 1bed-a.svg
│               └── 2bed-a.svg
│
├── payload.config.ts             # Payload CMS configuration
├── docker-compose.yml
├── .env.local
└── tailwind.config.ts
```

---

## 7.3 Full Database Schema

### PostgreSQL Schema — Complete DDL

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for text search

-- ============================================================
-- BUILDINGS
-- ============================================================
CREATE TABLE buildings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          VARCHAR(100) NOT NULL UNIQUE,        -- 'building-a'
  name          VARCHAR(200) NOT NULL,                -- 'Резиденция Хисар'
  phase         VARCHAR(50),                          -- 'Phase 1'
  total_floors  INTEGER NOT NULL,
  total_units   INTEGER,
  launch_date   DATE,
  handover_date DATE,
  status        VARCHAR(50) DEFAULT 'pre-launch'      -- pre-launch | active | sold-out | completed
    CHECK (status IN ('pre-launch', 'active', 'sold-out', 'completed')),
  price_visible BOOLEAN DEFAULT false,               -- global price toggle
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_buildings_slug ON buildings(slug);

-- ============================================================
-- TYPOLOGIES
-- ============================================================
CREATE TABLE typologies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id     UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  slug            VARCHAR(100) NOT NULL,               -- '2bed-type-a'
  label           VARCHAR(100) NOT NULL,               -- '2-Bedroom Type A'
  bedrooms        SMALLINT NOT NULL,
  size_min_sqm    NUMERIC(6,2),
  size_max_sqm    NUMERIC(6,2),
  floorplan_svg   TEXT,                                -- path or inline SVG
  walkthrough_path TEXT,                               -- '/assets/building-a/typology-2bed-a/'
  walkthrough_type VARCHAR(10) DEFAULT '360'
    CHECK (walkthrough_type IN ('360', '3d', 'none')),
  rooms_config    JSONB,                               -- see schema note below
  sort_order      SMALLINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (building_id, slug)
);

-- rooms_config JSONB structure:
-- {
--   "rooms": [
--     {
--       "id": "living-room",
--       "label": "Дневна",
--       "panorama_file": "living-room.webp",
--       "hotspots": [
--         {
--           "id": "hs-ceiling",
--           "pitch": 15, "yaw": 45,
--           "title": "Висок таван 2.9м",
--           "description": "Стандартна височина в целия апартамент.",
--           "image": null
--         }
--       ],
--       "connections": ["kitchen", "bedroom-1", "hallway"]
--     }
--   ],
--   "entry_room": "living-room"
-- }

CREATE INDEX idx_typologies_building ON typologies(building_id);
CREATE INDEX idx_typologies_slug ON typologies(building_id, slug);

-- ============================================================
-- UNITS
-- ============================================================
CREATE TABLE units (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id         UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  typology_id         UUID NOT NULL REFERENCES typologies(id) ON DELETE RESTRICT,
  unit_code           VARCHAR(20) NOT NULL,             -- 'A-204'
  floor               SMALLINT NOT NULL,
  orientation         VARCHAR(10)                       -- 'N' | 'S' | 'E' | 'W' | 'NE' | 'SW' etc
    CHECK (orientation IN ('N','S','E','W','NE','NW','SE','SW')),
  size_sqm            NUMERIC(6,2) NOT NULL,
  terrace_sqm         NUMERIC(6,2) DEFAULT 0,
  price               NUMERIC(12,2),                    -- null = price on request
  currency            CHAR(3) DEFAULT 'EUR',
  availability_status VARCHAR(20) DEFAULT 'available'
    CHECK (availability_status IN ('available', 'reserved', 'sold', 'not-released')),
  status_updated_at   TIMESTAMPTZ,
  status_updated_by   VARCHAR(100),                     -- CMS user email
  has_terrace         BOOLEAN DEFAULT false,
  has_parking         BOOLEAN DEFAULT false,
  notes               TEXT,                             -- internal notes only
  sort_order          SMALLINT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (building_id, unit_code)
);

CREATE INDEX idx_units_building     ON units(building_id);
CREATE INDEX idx_units_typology     ON units(typology_id);
CREATE INDEX idx_units_floor        ON units(floor);
CREATE INDEX idx_units_status       ON units(availability_status);
CREATE INDEX idx_units_price        ON units(price);
CREATE INDEX idx_units_orientation  ON units(orientation);
-- Composite index for finder queries
CREATE INDEX idx_units_finder ON units(building_id, availability_status, floor, bedrooms)
  WHERE availability_status != 'not-released';

-- Helper view: units with typology data joined
CREATE VIEW units_with_typology AS
  SELECT
    u.*,
    t.label         AS typology_label,
    t.slug          AS typology_slug,
    t.bedrooms,
    t.size_min_sqm,
    t.size_max_sqm,
    t.floorplan_svg,
    t.walkthrough_path,
    t.walkthrough_type,
    t.rooms_config,
    b.slug          AS building_slug,
    b.name          AS building_name,
    b.price_visible
  FROM units u
  JOIN typologies t ON u.typology_id = t.id
  JOIN buildings b  ON u.building_id = b.id;

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- what they're interested in
  unit_id         UUID REFERENCES units(id) ON DELETE SET NULL,
  building_id     UUID REFERENCES buildings(id) ON DELETE SET NULL,
  unit_code       VARCHAR(20),                          -- denormalised for safety if unit deleted
  typology_label  VARCHAR(100),                         -- denormalised
  -- contact
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(320) NOT NULL,
  phone           VARCHAR(50),
  message         TEXT,
  -- source tracking
  source_url      TEXT,
  entry_page      TEXT,
  referrer        TEXT,
  utm_source      VARCHAR(200),
  utm_medium      VARCHAR(200),
  utm_campaign    VARCHAR(200),
  utm_content     VARCHAR(200),
  utm_term        VARCHAR(200),
  -- status
  status          VARCHAR(30) DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'booked', 'reserved', 'closed', 'disqualified')),
  admin_notes     TEXT,
  -- meta
  ip_hash         VARCHAR(64),                          -- hashed, not raw IP
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_unit        ON leads(unit_id);
CREATE INDEX idx_leads_building    ON leads(building_id);
CREATE INDEX idx_leads_email       ON leads(email);
CREATE INDEX idx_leads_status      ON leads(status);
CREATE INDEX idx_leads_created     ON leads(created_at DESC);
CREATE INDEX idx_leads_utm_source  ON leads(utm_source);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,                  -- bcrypt
  role          VARCHAR(20) DEFAULT 'agent'
    CHECK (role IN ('super_admin', 'admin', 'agent')),
  building_ids  UUID[],                                 -- null = access all buildings
  totp_secret   VARCHAR(100),                           -- 2FA secret
  totp_enabled  BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS EVENTS (lightweight custom events)
-- ============================================================
CREATE TABLE analytics_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type    VARCHAR(50) NOT NULL,                   -- 'walkthrough_start' | 'room_view' | 'cta_click' | 'lead_submitted'
  building_id   UUID REFERENCES buildings(id) ON DELETE SET NULL,
  unit_id       UUID REFERENCES units(id) ON DELETE SET NULL,
  typology_id   UUID REFERENCES typologies(id) ON DELETE SET NULL,
  room_id       VARCHAR(100),                           -- 'living-room'
  cta_location  VARCHAR(100),                           -- 'twin_bottom_bar' | 'unit_header' etc
  session_id    VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type       ON analytics_events(event_type);
CREATE INDEX idx_events_building   ON analytics_events(building_id);
CREATE INDEX idx_events_created    ON analytics_events(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER (apply to all tables)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_buildings_updated  BEFORE UPDATE ON buildings  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_typologies_updated BEFORE UPDATE ON typologies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_units_updated      BEFORE UPDATE ON units      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_leads_updated      BEFORE UPDATE ON leads      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: default building record
-- ============================================================
INSERT INTO buildings (slug, name, total_floors, status, price_visible)
VALUES ('building-a', 'Building A — Kyustendil', 8, 'pre-launch', false);
```

---

## 7.4 Payload CMS Collection Schema

### Collections defined in `payload.config.ts`

```typescript
// payload.config.ts — collection overview

export default buildConfig({
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
  collections: [
    Buildings,    // maps to buildings table
    Typologies,   // maps to typologies table
    Units,        // maps to units table (availability, pricing managed here)
    Media,        // CMS media library (gallery images, renders)
    Pages,        // CMS-editable content pages (about, FAQ, etc.)
  ],
  globals: [
    SiteSettings, // price_visible toggle, sales team contact, legal disclaimer
    Navigation,   // nav links
  ],
})

// Units collection — fields editable in CMS without code
const Units: CollectionConfig = {
  slug: 'units',
  admin: { useAsTitle: 'unit_code' },
  fields: [
    { name: 'unit_code', type: 'text', required: true },
    { name: 'building_id', type: 'relationship', relationTo: 'buildings', required: true },
    { name: 'typology_id', type: 'relationship', relationTo: 'typologies', required: true },
    { name: 'floor', type: 'number', required: true },
    { name: 'orientation', type: 'select', options: ['N','S','E','W','NE','NW','SE','SW'] },
    { name: 'size_sqm', type: 'number', required: true },
    { name: 'price', type: 'number' },
    {
      name: 'availability_status',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Sold', value: 'sold' },
        { label: 'Not Released', value: 'not-released' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      // Revalidate the apartment finder page on any unit change
      async ({ doc }) => {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/webhooks/payload`, {
          method: 'POST',
          body: JSON.stringify({ type: 'unit_updated', slug: doc.unit_code }),
        });
      },
    ],
  },
};
```

---

## 7.5 Data Flow Diagrams

### Flow A — Buyer Explores a Unit

```
Browser                    Next.js                  Payload CMS           PostgreSQL
  │                           │                          │                      │
  │  GET /buildings/a/        │                          │                      │
  │  apartments/unit-204      │                          │                      │
  ├──────────────────────────►│                          │                      │
  │                           │  GET /api/units/unit-204 │                      │
  │                           ├─────────────────────────►│                      │
  │                           │                          │  SELECT * FROM       │
  │                           │                          │  units_with_typology │
  │                           │                          │  WHERE unit_code=?   │
  │                           │                          ├─────────────────────►│
  │                           │                          │◄─────────────────────┤
  │                           │◄─────────────────────────┤                      │
  │  HTML: unit detail page   │                          │                      │
  │◄──────────────────────────┤                          │                      │
  │                           │                          │                      │
  │  [User clicks Explore]    │                          │                      │
  │  GET /twin/2bed-type-a    │                          │                      │
  ├──────────────────────────►│                          │                      │
  │  HTML + JS twin viewer    │                          │                      │
  │  (rooms_config from ISR)  │                          │                      │
  │◄──────────────────────────┤                          │                      │
  │                           │                          │                      │
  │  [JS loads panoramas]     │                          │                      │
  │  GET /assets/building-a/  │                          │                      │
  │  typology-2bed-a/*.webp   │                          │                      │
  ├──────────────────────────►│ (served by Nginx static) │                      │
  │◄──────────────────────────┤                          │                      │
```

### Flow B — Lead Submission

```
Browser                    Next.js API             PostgreSQL           Resend SMTP
  │                           │                        │                    │
  │  POST /api/leads          │                        │                    │
  │  { name, email, phone,    │                        │                    │
  │    unit_id, utm_params,   │                        │                    │
  │    source_url }           │                        │                    │
  ├──────────────────────────►│                        │                    │
  │                           │  1. Validate input     │                    │
  │                           │  2. Check rate limit   │                    │
  │                           │  3. Verify honeypot    │                    │
  │                           │                        │                    │
  │                           │  INSERT INTO leads     │                    │
  │                           │  (...) RETURNING id    │                    │
  │                           ├───────────────────────►│                    │
  │                           │◄───────────────────────┤                    │
  │                           │                        │                    │
  │                           │  Send buyer confirmation email              │
  │                           ├────────────────────────────────────────────►│
  │                           │                        │                    │
  │                           │  Send admin notification email              │
  │                           ├────────────────────────────────────────────►│
  │                           │                        │                    │
  │  201 { success: true }    │                        │                    │
  │◄──────────────────────────┤                        │                    │
  │                           │                        │                    │
  │  [Plausible event fired]  │                        │                    │
  │  plausible('lead_submitted', { props: { unit } })  │                    │
```

### Flow C — CMS Availability Update

```
CMS Admin                  Payload CMS              PostgreSQL          Next.js (ISR)
  │                           │                        │                    │
  │  Login to CMS             │                        │                    │
  ├──────────────────────────►│                        │                    │
  │                           │                        │                    │
  │  Edit unit A-204          │                        │                    │
  │  status: reserved         │                        │                    │
  ├──────────────────────────►│                        │                    │
  │                           │  UPDATE units          │                    │
  │                           │  SET availability_status = 'reserved'       │
  │                           │  WHERE unit_code = 'A-204'                  │
  │                           ├───────────────────────►│                    │
  │                           │◄───────────────────────┤                    │
  │                           │                        │                    │
  │                           │  afterChange hook fires│                    │
  │                           │  POST /api/webhooks/payload                 │
  │                           ├────────────────────────────────────────────►│
  │                           │                        │  revalidatePath(   │
  │                           │                        │  '/buildings/a/    │
  │                           │                        │  apartments')      │
  │                           │                        │                    │
  │  ✓ Saved                  │                        │                    │
  │◄──────────────────────────┤                        │                    │
  │                           │                        │                    │
  │  [Next buyer visits]      │                        │                    │
  │  GET /buildings/a/apartments                       │                    │
  │  → Sees updated status within seconds              │                    │
```

### Flow D — Admin Exports Leads

```
Admin User                 Next.js API             PostgreSQL
  │                           │                        │
  │  GET /api/admin/leads     │                        │
  │  ?format=csv              │                        │
  │  ?date_from=2024-01-01    │                        │
  │  Authorization: Bearer    │                        │
  ├──────────────────────────►│                        │
  │                           │  Verify JWT session    │
  │                           │  Check admin role      │
  │                           │                        │
  │                           │  SELECT l.*, u.unit_code,│
  │                           │  b.name AS building    │
  │                           │  FROM leads l          │
  │                           │  LEFT JOIN units u     │
  │                           │  LEFT JOIN buildings b │
  │                           │  WHERE l.created_at >= ?│
  │                           │  ORDER BY created_at DESC│
  │                           ├───────────────────────►│
  │                           │◄───────────────────────┤
  │                           │                        │
  │                           │  Stream CSV response   │
  │  leads-export-2024.csv    │                        │
  │◄──────────────────────────┤                        │
```

---

## 7.6 API Route Definitions

### Public API Routes

```typescript
// GET /api/units
// Query params: building_slug, bedrooms, floor_min, floor_max,
//               orientation, price_min, price_max, availability, typology_slug
// Returns: Unit[] with typology joined, price suppressed if price_visible=false
// Cache: revalidated by Payload webhook

// POST /api/leads
// Body: LeadSubmission
// Rate limit: 3/hour per IP
// Returns: { success: boolean, lead_id: string }

// POST /api/analytics/event
// Body: { event_type, unit_id?, typology_id?, room_id?, session_id }
// Returns: 200 OK — fire and forget, never blocks UI

// GET /api/buildings/[slug]
// Returns: Building with typologies and unit summary counts

// GET /api/typologies/[building-slug]/[typology-slug]
// Returns: Typology with rooms_config and available unit list
```

### Protected Admin API Routes (JWT required)

```typescript
// GET  /api/admin/leads          — paginated lead list
// GET  /api/admin/leads/export   — CSV stream
// PATCH /api/admin/leads/[id]    — update lead status
// GET  /api/admin/units          — unit inventory
// PATCH /api/admin/units/[id]    — update availability status
// GET  /api/admin/stats          — lead counts by unit, source, date
```

---

## 7.7 Docker Compose Configuration

```yaml
# docker-compose.yml

version: '3.8'

services:

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
      - ./public/assets:/var/www/assets:ro   # serve static assets directly
    depends_on:
      - nextjs
      - payload
    networks:
      - re_network
    restart: always

  nextjs:
    build:
      context: .
      dockerfile: Dockerfile.next
    environment:
      - DATABASE_URL=postgresql://re_user:${DB_PASSWORD}@postgres:5432/re_db
      - PAYLOAD_URL=http://payload:3001
      - RESEND_API_KEY=${RESEND_API_KEY}
      - NEXT_PUBLIC_PLAUSIBLE_DOMAIN=${DOMAIN}
      - NEXT_PUBLIC_URL=https://${DOMAIN}
      - ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
    depends_on:
      - postgres
      - payload
    networks:
      - re_network
    restart: always

  payload:
    build:
      context: .
      dockerfile: Dockerfile.payload
    environment:
      - DATABASE_URL=postgresql://re_user:${DB_PASSWORD}@postgres:5432/re_db
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - NEXT_REVALIDATE_URL=http://nextjs:3000/api/webhooks/payload
      - NEXT_REVALIDATE_TOKEN=${REVALIDATE_TOKEN}
    depends_on:
      - postgres
    networks:
      - re_network
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=re_db
      - POSTGRES_USER=re_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - re_network
    restart: always

  plausible:
    image: ghcr.io/plausible/community-edition:v2
    environment:
      - BASE_URL=https://analytics.${DOMAIN}
      - SECRET_KEY_BASE=${PLAUSIBLE_SECRET}
      - DATABASE_URL=postgresql://re_user:${DB_PASSWORD}@postgres:5432/plausible_db
    depends_on:
      - postgres
    networks:
      - re_network
    restart: always

  kuma:
    image: louislam/uptime-kuma:1
    volumes:
      - kuma_data:/app/data
    networks:
      - re_network
    restart: always

volumes:
  postgres_data:
  kuma_data:

networks:
  re_network:
    driver: bridge
```

---

## 7.8 Nginx Configuration

```nginx
# nginx.conf

events { worker_connections 1024; }

http {
  gzip on;
  gzip_types text/plain text/css application/json application/javascript image/svg+xml;
  gzip_min_length 1024;

  # Cache headers for static assets
  map $uri $cache_control {
    ~*\.(webp|jpg|jpeg|png|svg|ico)$ "public, max-age=31536000, immutable";
    ~*\.(js|css)$                    "public, max-age=86400";
    default                          "no-cache";
  }

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
  limit_req_zone $binary_remote_addr zone=leads:10m rate=3r/h;

  server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://analytics.${DOMAIN};" always;
    add_header Cache-Control $cache_control always;

    # Serve panorama/render assets directly from disk — never touch Node
    location /assets/ {
      alias /var/www/assets/;
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Rate limit lead submission endpoint
    location /api/leads {
      limit_req zone=leads burst=2 nodelay;
      proxy_pass http://nextjs:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Rate limit all other API routes
    location /api/ {
      limit_req zone=api burst=5 nodelay;
      proxy_pass http://nextjs:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Next.js app
    location / {
      proxy_pass http://nextjs:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }

  # CMS on subdomain
  server {
    listen 443 ssl http2;
    server_name cms.${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    location / {
      proxy_pass http://payload:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  # Admin panel on subdomain
  server {
    listen 443 ssl http2;
    server_name admin.${DOMAIN};
    # Restrict by IP in production (add allow/deny directives)
    proxy_pass http://nextjs:3000/admin;
  }
}
```

---

## 7.9 Environment Variables Reference

```bash
# .env.local — complete reference

# ─── DATABASE ───────────────────────────────────────────
DATABASE_URL=postgresql://re_user:CHANGE_ME@postgres:5432/re_db
DB_PASSWORD=CHANGE_ME

# ─── PAYLOAD CMS ────────────────────────────────────────
PAYLOAD_SECRET=CHANGE_ME_32_CHAR_RANDOM_STRING
PAYLOAD_URL=http://payload:3001  # internal docker network

# ─── NEXT.JS ────────────────────────────────────────────
NEXT_PUBLIC_URL=https://yourdomain.bg
REVALIDATE_TOKEN=CHANGE_ME_SECRET_FOR_WEBHOOK

# ─── EMAIL (RESEND) ─────────────────────────────────────
RESEND_API_KEY=re_CHANGE_ME
EMAIL_FROM=noreply@yourdomain.bg
EMAIL_ADMIN=sales@yourdomain.bg  # receives lead notifications

# ─── ANALYTICS ──────────────────────────────────────────
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.bg
PLAUSIBLE_SECRET=CHANGE_ME

# ─── ADMIN AUTH ─────────────────────────────────────────
ADMIN_JWT_SECRET=CHANGE_ME_64_CHAR_RANDOM_STRING

# ─── DOMAIN ─────────────────────────────────────────────
DOMAIN=yourdomain.bg

# ─── BACKUP ─────────────────────────────────────────────
S3_BACKUP_ENDPOINT=https://s3.hetzner.com
S3_BACKUP_BUCKET=re-db-backups
S3_BACKUP_KEY=CHANGE_ME
S3_BACKUP_SECRET=CHANGE_ME
```

---

# SECTION 8 — DEVELOPMENT PROMPTS

---

## How to Use These Prompts

Each prompt is written to be pasted directly into an AI coding assistant (Claude, Cursor, GitHub Copilot) or used as a detailed brief for a development session. They are ordered by sprint sequence. Always include the relevant context from this PRD when using them.

**Before each prompt, prepend this context block:**

```
Context: I am building a self-hosted off-plan real estate sales platform.
Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Payload CMS, PostgreSQL, Docker.
Location: Kyustendil, Bulgaria. Language: Bulgarian primary.
Architecture: See PRD Section 7. All code must be production-grade, typed, and follow the file structure in Section 7.2.
```

---

## 8.1 Infrastructure & DevOps Prompts

### PROMPT INF-01 — Docker Compose Stack

```
Set up a complete Docker Compose stack for a self-hosted Next.js real estate platform.

Requirements:
- Services: nginx (alpine), nextjs (custom build), payload (custom build), postgres:15-alpine, plausible (community edition v2), uptime-kuma
- All services on an internal bridge network called re_network
- Only nginx exposes external ports 80 and 443
- PostgreSQL data persisted via named volume postgres_data
- Environment variables via .env file (never hardcoded)
- All services restart: always

Deliver:
1. docker-compose.yml (complete, production-ready)
2. Dockerfile.next (multi-stage: deps → builder → runner, non-root user)
3. Dockerfile.payload (same pattern)
4. .env.example with every variable needed and a comment explaining each one
5. A shell script setup.sh that: creates .env from .env.example, generates random secrets for JWT/payload/revalidate using openssl, and prints next steps

The setup.sh must check that Docker and Docker Compose are installed before proceeding.
```

---

### PROMPT INF-02 — Nginx Configuration

```
Write a production Nginx configuration for a Next.js + Payload CMS stack.

Domains:
- Main site: yourdomain.bg (proxy to nextjs:3000)
- CMS: cms.yourdomain.bg (proxy to payload:3001)
- Analytics: analytics.yourdomain.bg (proxy to plausible:8000)

Requirements:
1. HTTP → HTTPS redirect for all domains
2. SSL termination (Let's Encrypt, cert paths configurable via env)
3. Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy (CSP must allow Plausible analytics scripts from analytics subdomain)
4. Gzip compression for: text/plain, text/css, application/json, application/javascript, image/svg+xml
5. Static asset serving: /assets/ path served directly from /var/www/assets/ (NOT proxied to Next.js) with 1-year cache headers
6. Rate limiting:
   - Zone "leads": 3 requests/hour per IP for POST /api/leads
   - Zone "api": 10 requests/minute per IP for all other /api/ routes
   - burst=2 for leads, burst=5 for api, nodelay
7. WebSocket upgrade headers for Next.js HMR (dev) — include but comment out for prod

Output the complete nginx.conf. Use a template approach where DOMAIN is a placeholder I can replace via envsubst.
```

---

### PROMPT INF-03 — PostgreSQL Schema Initialisation

```
Write a complete PostgreSQL initialization script (init.sql) for a real estate platform.

Create these tables with full constraints, indexes, and triggers:
1. buildings (id uuid, slug, name, phase, total_floors, total_units, launch_date, handover_date, status CHECK, price_visible bool, timestamps)
2. typologies (id uuid, building_id FK, slug, label, bedrooms smallint, size_min_sqm, size_max_sqm, floorplan_svg text, walkthrough_path text, walkthrough_type CHECK('360'|'3d'|'none'), rooms_config jsonb, sort_order, timestamps)
3. units (id uuid, building_id FK, typology_id FK, unit_code, floor, orientation CHECK(N/S/E/W/NE/NW/SE/SW), size_sqm, terrace_sqm, price, currency, availability_status CHECK, status_updated_at, status_updated_by, notes, sort_order, timestamps)
4. leads (id uuid, unit_id FK nullable, building_id FK nullable, unit_code denorm, typology_label denorm, name, email, phone, message, source_url, entry_page, referrer, utm_source/medium/campaign/content/term, status CHECK(new/contacted/qualified/booked/reserved/closed/disqualified), admin_notes, ip_hash, user_agent, timestamps)
5. admin_users (id uuid, email unique, password_hash, role CHECK, building_ids uuid[], totp_secret, totp_enabled, last_login_at, created_at)
6. analytics_events (id uuid, event_type, building_id FK nullable, unit_id FK nullable, typology_id FK nullable, room_id, cta_location, session_id, created_at)

For each table:
- Use uuid_generate_v4() for primary keys
- Add all relevant indexes (FK indexes, status indexes, created_at DESC, composite for finder queries)
- Add update_updated_at_column() trigger function applied to all tables with updated_at

Also create:
- A view units_with_typology joining units + typologies + buildings
- A function get_units_filtered(p_building_id uuid, p_bedrooms int, p_floor_min int, p_floor_max int, p_orientation text, p_price_min numeric, p_price_max numeric, p_status text) that returns filtered units using the view

Seed one building row for testing.
```

---

### PROMPT INF-04 — CI/CD and Backup Scripts

```
Write two shell scripts for a self-hosted Next.js platform on a Hetzner VPS.

Script 1: deploy.sh
- Pull latest code from git main branch
- Run docker compose build --no-cache for changed services only
- Run docker compose up -d with zero-downtime (use --no-deps, service by service)
- Run database migrations if any pending (via payload migration command)
- Print deployment summary with container status

Script 2: backup.sh (run via cron nightly at 3am)
- Create a PostgreSQL dump using pg_dump inside the postgres container
- Compress with gzip, name with date: backup-YYYY-MM-DD.sql.gz
- Upload to S3-compatible storage (Hetzner Object Storage) using aws-cli (s3api)
- Keep only last 30 backups in S3 (delete older ones)
- Delete local backup file after successful upload
- Send a simple status email via curl to Resend API: success or failure with details
- Log all operations with timestamps to /var/log/re-backup.log

Both scripts must: check for required environment variables, handle errors with set -e and explicit error messages, and be idempotent.
```

---

## 8.2 Design System Prompts

### PROMPT DS-01 — Tailwind Design System

```
Create a complete Tailwind CSS design system configuration and base component library for a premium real estate website.

Brand context: Off-plan apartment development, Kyustendil, Bulgaria. Premium mid-market positioning. Clean, modern, confident. Not cold or corporate — warm but professional.

Deliver:

1. tailwind.config.ts with:
   - Custom color tokens: primary (deep slate blue), accent (warm gold), neutral (warm greys), success (green), warning (amber), danger (red)
   - Typography scale using a premium Google Font pair (display font + body font — choose something distinctive, not Inter)
   - Custom spacing extensions for section padding
   - Custom breakpoints: sm(375), md(768), lg(1024), xl(1280), 2xl(1440)
   - Box shadow tokens (card, elevated, modal)
   - Border radius tokens

2. globals.css with:
   - CSS custom property declarations matching Tailwind tokens
   - Smooth scroll behavior
   - Typography base styles (headings, body, caption)
   - Focus ring styles for accessibility
   - Custom scrollbar styles (thin, matching accent color)

3. These TypeScript components (each in separate file, no external UI library):
   - Button.tsx: variants (primary, secondary, ghost, danger), sizes (sm, md, lg), loading state with spinner, icon support left/right
   - Badge.tsx: variants (available=green, reserved=amber, sold=red, not-released=grey), sizes
   - Card.tsx: with optional hover state, shadow, border
   - FormField.tsx: label, input/textarea, error state, helper text, required indicator
   - Modal.tsx: accessible (focus trap, escape key, aria), backdrop, animated entry

All components must: be fully typed with TypeScript, use Tailwind classes only (no inline styles), be accessible (ARIA roles, keyboard navigation).
```

---

### PROMPT DS-02 — Homepage Implementation

```
Build the complete homepage for a premium off-plan real estate website using Next.js 14 (App Router), TypeScript, and Tailwind CSS.

All content values must be pulled from a siteConfig object (not hardcoded) so they can later be replaced by CMS data.

Sections to build (in order):

1. Navigation
   - Logo left, links center (Apartments, About, Contact), CTA button right ("Register Interest")
   - Transparent on hero, solid on scroll (use IntersectionObserver)
   - Mobile: hamburger menu with animated slide-in drawer
   - Sticky, z-50

2. Hero Section
   - Full viewport height
   - Background: full-bleed image (WebP, use next/image with priority)
   - Overlay: dark gradient bottom-to-top (text readable)
   - Content: eyebrow text (e.g. "Kyustendil · 2025"), H1 building name, tagline, two CTAs ("View Apartments" → #finder, "Watch Tour" → twin link)
   - Subtle scroll indicator (animated chevron)

3. Key Stats Bar
   - 4–5 stats: total units, floors, starting price, handover quarter, location
   - Clean grid with dividers
   - Stats animate from 0 on scroll entry (useCountUp hook)

4. Building Overview
   - Split layout: text left, image right (alternate on mobile)
   - H2, paragraph, 3 USP bullet points with icons
   - Image with subtle parallax on scroll

5. Gallery
   - Masonry or grid layout, 12 images max
   - Lightbox on click (build without external library: full-screen overlay, prev/next arrows, keyboard nav, swipe on mobile)
   - Images lazy-loaded below fold, WebP via next/image

6. Location Section
   - Static map image (OpenStreetMap screenshot — accept a placeholder)
   - Nearby POI list: school, park, transport, centre — CMS-managed
   - Distance badges

7. CTA Band
   - Full-width coloured section
   - "Ready to reserve your apartment?" with primary + secondary CTAs
   - Animated background (subtle gradient shift)

8. Footer
   - Logo, tagline, quick links, legal disclaimer, cookie settings link, copyright

All sections must animate on scroll entry using IntersectionObserver (no external animation library). Mobile-first. Tested at 375px minimum. Use semantic HTML throughout.
```

---

## 8.3 Apartment Finder Prompts

### PROMPT INV-01 — Filter Panel and Unit Grid

```
Build a complete apartment finder system for a Next.js 14 (App Router) real estate website using TypeScript, Tailwind CSS, and Zustand for state management.

Data shape (TypeScript):
type Unit = {
  id: string; unit_code: string; building_slug: string;
  typology_slug: string; typology_label: string;
  floor: number; orientation: 'N'|'S'|'E'|'W'|'NE'|'NW'|'SE'|'SW';
  size_sqm: number; price: number | null; currency: string;
  availability_status: 'available'|'reserved'|'sold'|'not-released';
  bedrooms: number; floorplan_svg?: string; walkthrough_path?: string;
}

Deliver:

1. FilterStore.ts (Zustand)
   - State: bedrooms (number[]), floorMin (number), floorMax (number), orientation (string[]), priceMin (number), priceMax (number), status (string[])
   - Actions: setFilter, resetAll, setBedroomsToggle (toggle in/out of array)
   - Derived: filteredUnits(units: Unit[]) — pure function applying all filters
   - URL sync: on filter change, update URL search params (pushState) so filter state is bookmarkable

2. FilterPanel.tsx
   - Bedrooms: multi-select pill buttons (Studio, 1, 2, 3, 4+)
   - Floor: dual range slider (custom built, no library — HTML range input pair)
   - Orientation: compass rose UI (8-direction selector, each direction toggleable)
   - Price: dual range slider with formatted currency display (€ formatted with thousand separator)
   - Availability: checkbox group (Available, Reserved, Sold)
   - Active filter count badge on a "Filters" toggle button (mobile: filter panel hides behind this button in a slide-up sheet)
   - "Clear all" button visible only when filters are active
   - On desktop: sidebar layout. On mobile: bottom sheet with overlay.

3. UnitGrid.tsx
   - Grid/list toggle (persisted in localStorage)
   - Result count: "Showing 12 apartments"
   - Sort: price low-high, price high-low, floor asc, floor desc
   - UnitCard.tsx: unit_code, typology_label, floor badge, orientation badge, size_sqm, price (hidden if price_visible=false), availability badge (coloured), "View apartment" link
   - Sold/Reserved units: visible but with reduced opacity, availability badge prominent
   - Empty state: "No apartments match your filters" with "Clear filters" CTA

4. ApartmentFinderPage — the parent page component
   - Fetches units from GET /api/units?building_slug=building-a via SWR (client-side for live filter updates)
   - Passes units to FilterStore and UnitGrid
   - Handles loading state (skeleton cards) and error state
   - Page scrolls to top of grid on filter change

All filter changes must update results without full page reload. Filter state must persist on browser back navigation. URL must be shareable with filter state intact.
```

---

## 8.4 Unit Detail Page Prompts

### PROMPT UNIT-01 — Unit Detail Page

```
Build a complete unit detail page for a Next.js 14 real estate platform.

Route: /buildings/[building-slug]/apartments/[unit-slug]
Data fetched server-side (ISR, revalidate: 60 seconds) from Payload CMS REST API.

Page sections:

1. Breadcrumb
   - Home → Apartments → [Typology Label] → Unit [unit_code]
   - JSON-LD BreadcrumbList for SEO

2. Unit Header
   - Unit code (prominent), availability badge
   - Key specs: bedrooms, floor, orientation (compass icon), size_sqm, terrace_sqm (if any), price (if price_visible)
   - Two CTAs: "Explore apartment" (links to twin viewer, opens in same tab), "Register interest" (smooth scroll to lead form)
   - If Reserved: show "This unit is reserved — view similar units" with links
   - If Sold: show "This unit has been sold — view available units" with links

3. Floorplan Display
   - Display floorplan SVG inline (from typology.floorplan_svg)
   - Pinch-to-zoom on mobile (use CSS transform with touch handlers)
   - "Download floorplan" button (trigger PDF download or open in new tab)
   - Room labels overlay on SVG (position from SVG coordinates)

4. Digital Twin Teaser
   - Hero panorama image from the typology's first room (WebP)
   - Overlay with "Explore this apartment in 360°" CTA
   - On click: navigate to /twin/[typology-slug] with unit_code as query param

5. Building Specifications
   - Accordion: Finishes, Kitchen, Bathroom, Building Systems, Sustainability
   - Content from CMS (buildings.specifications JSONB)
   - "Renders are indicative. Finishes within specified ranges." disclaimer

6. Same Typology on Other Floors
   - Horizontal scroll list of units with same typology_id
   - Shows: floor, availability badge, price difference vs current unit (+€X or −€X)
   - Links to respective unit detail pages
   - Current unit highlighted/disabled

7. Lead Form
   - id="register-interest" for scroll target
   - Fields: Name, Email, Phone (optional), "Anything specific you'd like to know?"
   - Unit code and building pre-filled hidden fields
   - Honeypot: hidden input name="website" (reject if filled)
   - Submits to POST /api/leads
   - Success state: inline confirmation with unit image and next steps
   - Error state: specific field errors or general error
   - No full page reload on submit

OG meta tags must be populated dynamically: og:title = "Unit [unit_code] — [building_name]", og:description = "[typology_label], Floor [floor], [size_sqm]m²", og:image = first panorama image.
generateMetadata must return correct meta for social sharing.
```

---

## 8.5 Digital Twin Prompts

### PROMPT DT-01 — 360° Panorama Viewer

```
Build a complete 360° panorama walkthrough viewer for a Next.js 14 real estate platform using Pannellum (loaded dynamically via CDN to avoid SSR issues).

Viewer route: /twin/[typology-slug]
Config is loaded from: GET /api/typologies/building-a/[typology-slug]
which returns the rooms_config JSONB (see structure below).

rooms_config structure:
{
  entry_room: "living-room",
  rooms: [
    {
      id: "living-room",
      label: "Living Room",
      panorama_file: "living-room.webp",  // relative to /assets/building-a/typology-2bed-a/
      hotspots: [
        { id: "hs-1", pitch: 5, yaw: 180, title: "2.9m Ceiling Height", description: "...", image?: "/assets/..." }
      ],
      connections: ["kitchen", "bedroom-1", "hallway"]
    }
  ]
}

Deliver these components:

1. TwinViewer.tsx — main wrapper
   - Dynamically imports PannellumViewer (no SSR)
   - Shows loading skeleton until viewer ready
   - Tracks current_room in React state
   - Manages fullscreen toggle (Fullscreen API)
   - Keyboard: Left/Right arrow to navigate rooms, Escape to exit fullscreen
   - Shows legal disclaimer bottom-left: "Renders are indicative" — subtle, small
   - Unit metadata bar top: unit_code, typology, floor, size (passed as props from parent page)

2. PannellumViewer.tsx — core viewer
   - Initialize Pannellum with config built from rooms_config
   - Support equirectangular format
   - Set firstScene to entry_room
   - Build scene links (connection hotspots) between rooms
   - Build info hotspots from hotspot config
   - On scene change: call onRoomChange(room_id) callback
   - Mobile: autoLoad true, touch support enabled
   - On load complete: fire Plausible event walkthrough_start

3. FloorplanOverlay.tsx
   - Fixed overlay: bottom-right desktop, collapsible mobile (tap to expand)
   - Renders inline SVG from floorplan_svg prop
   - Highlights the room matching current_room by adding a CSS class to the corresponding SVG element (rooms in SVG must have id matching room.id)
   - On click of a room in the SVG: call onRoomSelect(room_id)
   - On mobile: auto-collapse after room selection

4. RoomNav.tsx — persistent bottom navigation bar
   - Lists all rooms by label
   - Active room highlighted
   - Horizontal scroll on mobile
   - On click: navigate to that room's scene in Pannellum

5. HotspotPanel.tsx — slide-in drawer when hotspot is clicked
   - title, description, optional image (close-up render)
   - Triggered by Pannellum hotspot click event
   - Does not block panorama interaction when closed
   - Accessible: focus trapped when open, Escape closes

6. LeadDrawer.tsx — in-twin lead capture
   - Floating "Register interest" button: bottom-center, appears after 10 seconds
   - Slide-in drawer from right on mobile/desktop
   - Form: Name, Email, Phone (optional), unit_code pre-filled
   - Submits to POST /api/leads without leaving viewer
   - On success: "Thank you — we'll be in touch within 24 hours."

Fire these Plausible events:
- walkthrough_start (on viewer load)
- room_view (on every room change, props: { room: room_id })
- hotspot_open (on hotspot click, props: { hotspot_id })
- twin_lead_submitted (on form success)
```

---

## 8.6 Lead System Prompts

### PROMPT LEAD-01 — Lead API Endpoint

```
Build a complete POST /api/leads endpoint in Next.js 14 (App Router, route.ts).

Request body (TypeScript):
type LeadSubmission = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  unit_id?: string;
  unit_code?: string;
  typology_label?: string;
  building_id?: string;
  source_url?: string;
  entry_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  website?: string;     // honeypot — reject if filled
  session_id?: string;
}

Requirements:

1. Validation (return 400 with field-level errors on failure):
   - name: required, 2–200 chars
   - email: required, valid email format, max 320 chars
   - phone: optional, if present must be plausible phone number
   - message: optional, max 2000 chars
   - website (honeypot): if present and non-empty, return 200 silently (do not store, do not alert)

2. Rate limiting (implement without external library):
   - Extract IP from X-Real-IP header (set by Nginx)
   - Hash the IP with SHA-256 before storing (never store raw IP)
   - Check leads table: if more than 3 submissions from same ip_hash in last 1 hour, return 429
   - Also store ip_hash on the lead record

3. Database insert:
   - Insert into leads table with all provided fields
   - If unit_id is provided, fetch unit_code and typology_label for denormalisation (handle missing unit gracefully)
   - Return { success: true, lead_id: uuid }

4. Buyer confirmation email (via Resend):
   - To: submitted email
   - Subject: "We received your enquiry — [building_name]"
   - Body (HTML): Thank them by name, show unit they enquired about (unit_code + typology_label), state "A member of our team will contact you within 24 hours", include sales team phone number and email
   - Send async — do not await before returning response

5. Admin notification email:
   - To: process.env.EMAIL_ADMIN
   - Subject: "New enquiry: [unit_code] — [name]"
   - Body: All lead fields in a clean table, source URL, UTM params, timestamp
   - Send async

6. Analytics event:
   - POST to /api/analytics/event with { event_type: 'lead_submitted', unit_id, building_id }
   - Fire and forget — never await, never fail the lead submission

Error handling:
- All database errors: log to console, return 500 with generic message (never expose DB error to client)
- Email failures: log but do not fail the lead submission
- The lead must be stored even if email fails

Return shape: { success: true, lead_id: string } on 201, { success: false, errors: Record<string, string> } on 400.
```

---

### PROMPT LEAD-02 — Email Templates

```
Build two HTML email templates using React Email (react-email library) for a Bulgarian real estate sales platform.

Template 1: BuyerConfirmationEmail.tsx
Props: { buyerName, unitCode, typologyLabel, buildingName, salesEmail, salesPhone }
Design:
- Clean, premium, minimal (no loud graphics)
- Header: building name + subtle logo placeholder
- Opening: "Dear [buyerName]," in Bulgarian and English (bilingual)
- Body: "We have received your enquiry for [unitCode] ([typologyLabel]) in [buildingName]."
- Status message: "A member of our sales team will contact you within 24 hours."
- Contact box: sales email and phone, styled as a card
- Footer: legal disclaimer, unsubscribe note, address
- Primary color: match the design system accent

Template 2: AdminNotificationEmail.tsx
Props: { leadId, buyerName, buyerEmail, buyerPhone, unitCode, typologyLabel, message, sourceUrl, utmSource, utmCampaign, submittedAt }
Design:
- Functional, no design needed — clarity over aesthetics
- Subject line helper: "[unitCode] — New lead from [buyerName]"
- Clean two-column table of all fields
- Direct "Reply to enquiry" button linked to mailto:buyerEmail
- Lead ID for reference
- Timestamp formatted in Bulgarian time zone (Europe/Sofia)

Also deliver: a lib/email.ts helper that:
- Accepts template name and props
- Renders to HTML using @react-email/render
- Sends via Resend API (using resend npm package)
- Returns { success: boolean, messageId?: string, error?: string }
- Never throws — always returns a result shape
```

---

## 8.7 CMS & Content Prompts

### PROMPT CMS-01 — Payload CMS Configuration

```
Write the complete Payload CMS 2.x configuration (payload.config.ts) for a multi-building real estate platform.

Stack: Payload CMS 2.x, PostgreSQL (via @payloadcms/db-postgres), TypeScript.

Collections to define:

1. Buildings
   Fields: name (text, required), slug (text, unique), phase, total_floors (number), handover_date (date), status (select: pre-launch/active/sold-out/completed), price_visible (checkbox — this is the global pricing toggle)
   Admin: list view shows name, status, price_visible; use name as title

2. Typologies
   Fields: building_id (relationship to Buildings, required), label (text), slug (text), bedrooms (number), size_min_sqm, size_max_sqm (numbers), floorplan_svg (textarea — for SVG string), walkthrough_path (text), walkthrough_type (select: 360/3d/none), rooms_config (json — rich JSON editor), sort_order (number)
   Admin: filter by building; group by building in list view

3. Units
   Fields: unit_code (text, required), building_id (relationship, required), typology_id (relationship to Typologies, required), floor (number), orientation (select: N/S/E/W/NE/NW/SE/SW), size_sqm (number), terrace_sqm (number, defaultValue 0), price (number), availability_status (select: available/reserved/sold/not-released, defaultValue: available), status_updated_by (text — auto-populated from current user email in beforeChange hook), notes (textarea — admin-only, not exposed to API)
   Admin: list view shows unit_code, floor, typology, availability_status (with color badge), price; sortable by floor; filterable by building and availability_status; bulk edit availability_status

4. Media
   Payload built-in media collection, image resizing: thumbnail (300×200), card (800×600), hero (1920×1080), webp format output only

5. Pages
   Fields: title, slug (unique), content (rich text — Slate), meta_title, meta_description
   For: About, FAQ, Privacy Policy, Terms

Globals to define:

1. SiteSettings
   Fields: site_name, tagline, sales_email, sales_phone, legal_disclaimer (textarea), construction_phase (text), handover_quarter (text), google_maps_url

2. Navigation
   Fields: links (array of { label, url, is_cta: checkbox })

Hooks:
- Units.afterChange: POST to Next.js revalidation endpoint to invalidate ISR cache for the affected building's apartment finder page and the specific unit page
- All collections: set updated_at to NOW() in beforeChange

Access control:
- Public REST API: GET on Buildings, Typologies, Units (with field-level restriction: hide notes field, hide price if building.price_visible=false)
- Admin only: POST/PATCH/DELETE on all collections; full field access

Output: complete payload.config.ts, collection config files, and access control functions.
```

---

## 8.8 Admin Panel Prompts

### PROMPT ADMIN-01 — Lead Management Dashboard

```
Build a complete admin lead management dashboard as a Next.js page at /admin/leads.

Authentication: session-based using iron-session (not NextAuth — keep it simple). Admin login at /admin/login. Protected route — redirect to login if no session.

Dashboard features:

1. Stats Row (top)
   - Total leads (all time)
   - New leads (last 7 days)
   - Leads by status breakdown (small bar chart using recharts)
   - Top 3 units by lead count

2. Lead List Table
   Columns: Date/time, Name, Email, Phone, Unit, Typology, Source, UTM Campaign, Status, Actions
   Features:
   - Pagination: 25 per page
   - Sort: by created_at (default desc), name, unit
   - Filter: by status (multi-select), by building, by date range (date picker), by unit_code (text search)
   - Row click: expands inline to show full message and admin notes field (auto-saves on blur)
   - Status dropdown: inline change (PATCH /api/admin/leads/:id)
   - Each row: "Reply by email" link (opens mailto with subject pre-filled), "Mark contacted" quick action

3. CSV Export
   - Export button: "Export to CSV"
   - Applies current filters to export (not all leads)
   - CSV columns: id, date, name, email, phone, message, unit_code, typology, building, utm_source, utm_medium, utm_campaign, entry_page, status
   - Streams download — no waiting
   - File name: leads-export-YYYY-MM-DD.csv

4. Design
   - Clean, functional — not public-facing, no animations needed
   - Dark sidebar with nav links: Leads, Units, Settings
   - Use Tailwind for all styling
   - Mobile-aware but desktop-optimised (this is an admin tool)

API routes needed:
- GET /api/admin/leads — paginated + filtered
- PATCH /api/admin/leads/[id] — update status or admin_notes
- GET /api/admin/leads/export — CSV stream with applied filters

All admin API routes must verify session and role. Return 401 if no session, 403 if insufficient role.
```

---

### PROMPT ADMIN-02 — Unit Inventory Management

```
Build an admin unit management page at /admin/units for managing apartment inventory.

Features:

1. Unit List
   - Table: unit_code, building, typology, floor, orientation, size_sqm, price, availability_status, lead count, last status change
   - Grouped by building (tab switcher if multiple buildings)
   - Filter: by availability_status, by typology, by floor range
   - Sort: by floor (default), by price, by status change date

2. Inline Status Update
   - availability_status column: inline select dropdown
   - On change: immediate PATCH /api/admin/units/[id] with { availability_status }
   - Optimistic UI update — change visible immediately, rollback on error
   - Shows "Updated just now" confirmation for 3 seconds
   - Logs status_updated_by and status_updated_at in the database

3. Price Management
   - Price column: click to edit inline (input field appears)
   - On blur or Enter: save via PATCH
   - Shows formatted price with currency symbol

4. Global Price Toggle
   - Prominent toggle at top: "Price visibility: Public / Hidden"
   - Reads from buildings.price_visible
   - PATCH /api/admin/buildings/[id] to toggle
   - Shows current state clearly: green badge "Prices visible on website" or amber badge "Prices hidden from public"
   - Confirm dialog before enabling (in case of accidental click)

5. Lead Count Badge
   - Each unit shows lead count (from leads table join)
   - Click opens a slide-over panel showing the leads for that unit (read-only, link to full lead)

All changes must call the Next.js revalidation webhook after saving so the public site reflects changes immediately.
```

---

## 8.9 Analytics & Security Prompts

### PROMPT AN-01 — Plausible Custom Events

```
Implement client-side analytics event tracking for a Next.js 14 real estate platform using self-hosted Plausible Analytics (cookieless, no consent required).

Deliver:

1. lib/analytics.ts — event tracking utility
   - Type-safe event definitions:
     type AnalyticsEvent =
       | { name: 'walkthrough_start'; props: { typology: string; building: string } }
       | { name: 'room_view'; props: { room: string; typology: string } }
       | { name: 'hotspot_open'; props: { hotspot_id: string; room: string } }
       | { name: 'cta_click'; props: { location: string; unit_code?: string } }
       | { name: 'lead_submitted'; props: { unit_code: string; source: string } }
       | { name: 'filter_used'; props: { filter_type: string } }
       | { name: 'twin_started'; props: { typology: string } }
   - trackEvent(event: AnalyticsEvent): void — calls window.plausible() safely (guards for SSR, ad-blockers)
   - Never throws — all analytics must be fire-and-forget

2. PlausibleScript.tsx — script tag component
   - Add to root layout
   - Loads script from process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
   - Sets data-domain correctly
   - Only loads in production (NODE_ENV check)

3. Instrumentation — add trackEvent calls:
   - In TwinViewer.tsx: walkthrough_start on load, room_view on scene change
   - In HotspotPanel.tsx: hotspot_open on open
   - In LeadForm.tsx: cta_click on form focus, lead_submitted on success
   - In FilterPanel.tsx: filter_used on any filter change (debounced 1000ms)
   - In Homepage CTAs: cta_click with location identifier

4. also build a custom /api/analytics/event endpoint that:
   - Accepts events from the twin viewer (for server-side tracking of walkthrough drops)
   - Stores to the analytics_events table in PostgreSQL
   - Never blocks the UI — async endpoint, 200 immediately
   - Used for: room_view events (to track which rooms users drop off from)
```

---

### PROMPT AN-02 — Security Hardening

```
Implement production security hardening for a Next.js 14 platform. Deliver all of the following:

1. GDPR Cookie Consent Banner (CookieBanner.tsx)
   - First-visit: bottom banner "We use cookies to analyse site performance."
   - Two buttons: "Accept" and "Decline"
   - Consent stored in localStorage under key 'cookie_consent' as 'accepted' | 'declined'
   - If declined: Plausible script does NOT load (conditional in PlausibleScript.tsx)
   - "Cookie Settings" link in footer reopens the banner
   - Component reads consent state on mount and respects it
   - No cookies set before consent — Plausible is cookieless but this pattern is good practice

2. Privacy Policy page content (plain TypeScript/JSX)
   - Covers: what data is collected (name, email, phone, lead data), how it is stored (EU-based VPS), retention period (2 years), GDPR rights (access, deletion, portability), DPO contact
   - Bilingual structure: Bulgarian first, English below each section
   - Static page — no CMS needed for this

3. Honeypot CAPTCHA utility (lib/honeypot.ts)
   - honeypotFieldName: returns a stable field name ('website' — styled via CSS to be invisible, not via display:none which bots detect)
   - validateHoneypot(value: string | undefined): boolean — returns true if field is empty (valid submission)
   - CSS class to apply to honeypot input: opacity-0 absolute -z-10 pointer-events-none

4. Rate limiting utility (lib/rateLimit.ts)
   - In-memory Map-based rate limiter (no Redis needed for this scale)
   - rateLimit(identifier: string, limit: number, windowMs: number): { success: boolean; remaining: number; resetAt: Date }
   - Clean up expired entries on each call (no memory leak)
   - Designed for use in API route handlers

5. Content Security Policy (update Nginx config)
   - Policy must allow: self, inline styles (needed for Next.js), the Plausible analytics domain, no eval
   - Provide the exact header string as a constant in a lib/csp.ts file for use in Next.js middleware as well

6. next.config.ts security headers (as backup to Nginx headers)
   - Add all security headers via headers() in Next.js config
   - Matches Nginx config so headers are set even in development
```

---

## 8.10 Digital Twin Asset Pipeline Prompt

### PROMPT DT-ASSETS — 360° Asset Preparation

```
Write a Node.js script (scripts/process-panoramas.mjs) for preparing 360° panorama assets for web delivery.

The script takes a directory of raw panorama files delivered by the rendering studio and:

1. Validates each file:
   - Accepts: .jpg, .jpeg, .tiff, .tif, .png
   - Checks resolution: minimum 6000×3000px (equirectangular standard is 2:1 ratio)
   - Reports any files that fail validation with clear error messages

2. Processes each valid file:
   - Converts to WebP using sharp npm library
   - Quality: 85 for standard views, 90 for balcony/hero view (if filename contains 'balcony' or 'hero')
   - Output width: 6000px max (downsample if larger, never upsample)
   - Preserves equirectangular 2:1 aspect ratio
   - Progressive loading: generate a low-quality placeholder (LQIP) at 40×20px, base64-encoded

3. Organises output:
   - Output structure: /processed/{building-slug}/{typology-slug}/{room-name}.webp
   - Room name derived from filename (strip extension, lowercase, hyphenate spaces)
   - Also writes a manifest.json in each typology folder:
     {
       "typology": "2bed-type-a",
       "building": "building-a",
       "rooms": [
         { "id": "living-room", "file": "living-room.webp", "lqip": "data:image/webp;base64,..." }
       ]
     }

4. Reports:
   - Summary: X files processed, X skipped, total output size
   - Generates a checklist.md: one row per room, with a checkbox so the developer can verify each panorama visually

CLI usage:
node scripts/process-panoramas.mjs \
  --input ./raw-assets/2bed-type-a \
  --output ./public/assets \
  --building building-a \
  --typology 2bed-type-a

Dependencies: sharp, fs/promises, path, commander (for CLI args).
Requires Node.js 18+. Must handle errors gracefully — one bad file should not crash the whole batch.
```

---

*Document Version 2.0 — Eryze Studio*  
*Sections 7 and 8 added post-discovery. Update prompts after technical decisions are confirmed.*
