import { z } from "zod";
import { postSeeds, type PostSeed } from "@/data/posts";
import { notFoundError } from "@/lib/errors";
import type { Locale } from "@/lib/i18n/config";
import { getBuildingLabel } from "@/lib/i18n/messages";
import type { PostCategory, PostListResponse, PublicPost } from "@/types/posts";

const postQuerySchema = z.object({
  category: z.enum(["news", "construction_update", "announcement", "press"]).optional(),
  building: z.string().trim().min(1).max(80).optional(),
  page: z.coerce.number().int().min(1).max(200).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

type PostQuery = z.infer<typeof postQuerySchema>;
type PayloadMedia = { url?: string; alt?: string; mimeType?: string };
type PayloadBuilding = { id?: string; slug?: string; name?: string };
type PayloadRichTextNode = {
  text?: string;
  children?: PayloadRichTextNode[];
};
type PayloadPost = {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  category: PostCategory;
  building?: string | PayloadBuilding | null;
  publishedAt?: string;
  coverMedia?: string | PayloadMedia | null;
  galleryMedia?: Array<string | PayloadMedia> | null;
  videoMedia?: string | PayloadMedia | null;
  videoUrl?: string;
  translations?: {
    bg?: { title?: string; excerpt?: string; body?: string | PayloadRichTextNode[]; seoTitle?: string; seoDescription?: string };
    en?: { title?: string; excerpt?: string; body?: string | PayloadRichTextNode[]; seoTitle?: string; seoDescription?: string };
  };
};

function localizePost(locale: Locale, post: PostSeed): PublicPost {
  const building = post.building
    ? { ...post.building, name: getBuildingLabel(locale, post.building.id) }
    : null;

  return {
    ...post,
    status: "published",
    building,
    translation: post.translations[locale],
  };
}

function filterPublishedPosts(parsed: PostQuery) {
  return postSeeds
    .filter((post) => post.status === "published")
    .filter((post) => (parsed.category ? post.category === parsed.category : true))
    .filter((post) => (
      parsed.building
        ? post.buildingId === parsed.building || post.building?.slug === parsed.building
        : true
    ))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function bodyToParagraphs(value: string | PayloadRichTextNode[] | undefined) {
  if (!value || value.length === 0) return [];

  if (typeof value === "string") {
    return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  }

  return value
    .map((node) => collectText(node).trim())
    .filter(Boolean);
}

function collectText(node: PayloadRichTextNode): string {
  if (node.text) return node.text;
  return node.children?.map((child) => collectText(child)).join("") ?? "";
}

function mapPayloadPost(locale: Locale, post: PayloadPost): PublicPost | null {
  const bg = post.translations?.bg;
  const en = post.translations?.en;

  if (post.status !== "published" || !bg?.title || !en?.title) return null;

  const building = typeof post.building === "object" && post.building
    ? {
        id: post.building.id ?? "",
        slug: post.building.slug ?? "",
        name: post.building.id ? getBuildingLabel(locale, post.building.id) : post.building.name ?? "",
      }
    : null;
  const coverMedia = typeof post.coverMedia === "object" ? post.coverMedia : null;
  const videoMedia = typeof post.videoMedia === "object" ? post.videoMedia : null;
  const gallery = post.galleryMedia
    ?.map((image) => (typeof image === "object" && image.url ? { src: image.url, alt: image.alt ?? post.slug } : null))
    .filter((image): image is { src: string; alt: string } => Boolean(image)) ?? [];
  const translations = {
    bg: {
      title: bg.title,
      excerpt: bg.excerpt ?? "",
      body: bodyToParagraphs(bg.body),
      seoTitle: bg.seoTitle,
      seoDescription: bg.seoDescription,
    },
    en: {
      title: en.title,
      excerpt: en.excerpt ?? "",
      body: bodyToParagraphs(en.body),
      seoTitle: en.seoTitle,
      seoDescription: en.seoDescription,
    },
  };

  return {
    id: post.id,
    slug: post.slug,
    status: "published",
    category: post.category,
    ...(building?.id ? { buildingId: building.id } : {}),
    building,
    publishedAt: post.publishedAt ?? new Date().toISOString(),
    coverImage: coverMedia?.url,
    coverImageAlt: coverMedia?.alt ?? post.slug,
    gallery,
    videoMedia: videoMedia?.url ? { src: videoMedia.url, mimeType: videoMedia.mimeType } : undefined,
    videoUrl: post.videoUrl,
    translations,
    translation: translations[locale],
  };
}

async function fetchPayloadPosts(locale: Locale, parsed: PostQuery) {
  const payloadUrl = process.env.PAYLOAD_INTERNAL_URL;
  if (!payloadUrl) return null;

  const params = new URLSearchParams({
    "where[status][equals]": "published",
    sort: "-publishedAt",
    depth: "2",
    page: String(parsed.page),
    limit: String(parsed.limit),
  });

  if (parsed.category) params.set("where[category][equals]", parsed.category);

  const response = await fetch(`${payloadUrl.replace(/\/$/, "")}/api/posts?${params}`, {
    next: { revalidate: 300, tags: ["pautalia:posts"] },
  }).catch(() => null);

  if (!response?.ok) return null;

  const body = await response.json() as { docs?: PayloadPost[]; totalDocs?: number; totalPages?: number };
  const items = body.docs?.map((post) => mapPayloadPost(locale, post)).filter((post): post is PublicPost => Boolean(post)) ?? [];

  return {
    items: parsed.building ? items.filter((post) => post.buildingId === parsed.building || post.building?.slug === parsed.building) : items,
    total: body.totalDocs ?? items.length,
    totalPages: body.totalPages ?? Math.max(1, Math.ceil(items.length / parsed.limit)),
  };
}

async function fetchPayloadPost(locale: Locale, slug: string) {
  const payloadUrl = process.env.PAYLOAD_INTERNAL_URL;
  if (!payloadUrl) return null;

  const params = new URLSearchParams({
    "where[status][equals]": "published",
    "where[slug][equals]": slug,
    depth: "2",
    limit: "1",
  });
  const response = await fetch(`${payloadUrl.replace(/\/$/, "")}/api/posts?${params}`, {
    next: { revalidate: 300, tags: ["pautalia:posts"] },
  }).catch(() => null);

  if (!response?.ok) return null;

  const body = await response.json() as { docs?: PayloadPost[] };
  return body.docs?.[0] ? mapPayloadPost(locale, body.docs[0]) : null;
}

export async function listPublicPosts(
  locale: Locale,
  params: Record<string, string | undefined>,
): Promise<PostListResponse> {
  const parsed = postQuerySchema.parse(params);
  const payloadResult = await fetchPayloadPosts(locale, parsed);

  if (payloadResult) {
    return {
      items: payloadResult.items,
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total: payloadResult.total,
        totalPages: payloadResult.totalPages,
      },
    };
  }

  const filtered = filterPublishedPosts(parsed);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / parsed.limit));
  const items = filtered.slice((parsed.page - 1) * parsed.limit, parsed.page * parsed.limit);

  return {
    items: items.map((post) => localizePost(locale, post)),
    pagination: {
      page: parsed.page,
      limit: parsed.limit,
      total,
      totalPages,
    },
  };
}

export async function getPublicPost(locale: Locale, slug: string): Promise<PublicPost> {
  const payloadPost = await fetchPayloadPost(locale, slug);
  if (payloadPost) return payloadPost;

  const post = postSeeds.find((candidate) => candidate.slug === slug);

  if (!post || post.status !== "published") {
    throw notFoundError("Post not found");
  }

  return localizePost(locale, post);
}

export async function getPublishedPostSitemapSlugs(): Promise<string[]> {
  return postSeeds
    .filter((post) => post.status === "published")
    .map((post) => post.slug);
}

export function getPostCategoryLabel(locale: Locale, category: PostCategory) {
  const labels: Record<PostCategory, { bg: string; en: string }> = {
    news: { bg: "Новини", en: "News" },
    construction_update: { bg: "Строителство", en: "Construction" },
    announcement: { bg: "Съобщение", en: "Announcement" },
    press: { bg: "Преса", en: "Press" },
  };

  return labels[category][locale];
}
