# Pautalia M4 PRD + Technical Spec

## Summary

M4 is the content-growth and expansion milestone for Pautalia. It adds
Payload-authored bilingual news/blog posting, public news pages, construction
updates, rich media posts, and Park launch completion once official data is
approved. Digital twins remain excluded unless separately approved.

## Product Requirements

Admins should be able to create, edit, publish, and archive content posts in
Payload CMS. Public visitors should see only published posts in the current
site language.

Post categories:

- `news`
- `construction_update`
- `announcement`
- `press`

Publishing rules:

- Bulgarian and English title/body are required before publishing.
- Draft and archived posts are hidden from public pages and APIs.
- Posts can optionally relate to Residence or Park.
- Uploaded cover images, image galleries, uploaded videos, and external video
  URLs are supported.

## Implemented Surface

- Payload CMS `Posts` collection.
- Public `/news` listing page.
- Public `/news/[slug]` detail page.
- `GET /api/pautalia/posts`.
- `GET /api/pautalia/posts/[slug]`.
- Published post sitemap entries.
- Static seed/fallback post data until approved CMS content is staged.

## Data Model

```ts
type PostStatus = "draft" | "published" | "archived";
type PostCategory = "news" | "construction_update" | "announcement" | "press";

type Post = {
  id: string;
  slug: string;
  status: PostStatus;
  category: PostCategory;
  buildingId?: string;
  publishedAt?: Date;
  coverMediaId?: string;
  galleryMediaIds: string[];
  videoMediaId?: string;
  videoUrl?: string;
  translations: {
    bg: { title: string; excerpt: string; body: string; seoTitle?: string; seoDescription?: string };
    en: { title: string; excerpt: string; body: string; seoTitle?: string; seoDescription?: string };
  };
};
```

## Remaining M4 Launch Work

- Seed approved client posts in Payload CMS.
- Connect production content workflow during staging handover.
- Replace Park placeholder assets with approved renders/floor plans.
- Add official Park F1/F3/common-parts/land ownership values before public
  launch.
- Confirm no Park digital twin CTA appears.

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Mobile QA at 375px for `/news`
- Published post API returns published posts only
- Draft post API/detail page returns 404
