import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";

export const adminPostStatuses = ["draft", "published", "archived"] as const;
export const adminPostCategories = ["news", "construction_update", "announcement", "press"] as const;

export type AdminPostStatus = (typeof adminPostStatuses)[number];
export type AdminPostCategory = (typeof adminPostCategories)[number];

export type AdminPost = {
  id: string;
  slug: string;
  status: AdminPostStatus;
  category: AdminPostCategory;
  publishedAt?: string | null;
  coverMedia?: AdminMediaReference | null;
  galleryMedia?: AdminMediaReference[] | null;
  videoMedia?: AdminMediaReference | null;
  videoUrl?: string | null;
  translations?: {
    bg?: AdminPostTranslation;
    en?: AdminPostTranslation;
  };
};

type AdminMedia = {
  id: string;
  url?: string;
  alt?: string;
  mimeType?: string;
};

type AdminMediaReference = string | AdminMedia;

type AdminPostTranslation = {
  title?: string;
  excerpt?: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type PayloadListResponse = {
  docs?: AdminPost[];
};

const postInputSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  status: z.enum(adminPostStatuses),
  category: z.enum(adminPostCategories),
  publishedAt: z.string().trim().optional(),
  coverMedia: z.string().trim().min(1, "A hero image is required."),
  galleryMedia: z.array(z.string().trim().min(1)).optional(),
  videoMedia: z.string().trim().min(1).optional(),
  videoUrl: z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional()),
  translations: z.object({
    bg: z.object({
      title: z.string().trim().min(2).max(180),
      excerpt: z.string().trim().min(2).max(420),
      body: z.string().trim().min(2).max(12000),
      seoTitle: z.string().trim().max(180).optional(),
      seoDescription: z.string().trim().max(300).optional(),
    }),
    en: z.object({
      title: z.string().trim().min(2).max(180),
      excerpt: z.string().trim().min(2).max(420),
      body: z.string().trim().min(2).max(12000),
      seoTitle: z.string().trim().max(180).optional(),
      seoDescription: z.string().trim().max(300).optional(),
    }),
  }),
});

export type AdminPostInput = z.infer<typeof postInputSchema>;

export function isPayloadAdminConfigured() {
  return Boolean(env.PAYLOAD_INTERNAL_URL && (env.REVALIDATE_SECRET || env.PAYLOAD_SECRET));
}

function getPayloadConfig() {
  const baseUrl = env.PAYLOAD_INTERNAL_URL;
  const secret = env.REVALIDATE_SECRET || env.PAYLOAD_SECRET;
  if (!baseUrl || !secret) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), secret };
}

async function payloadRequest<T>(path: string, init?: RequestInit) {
  const config = getPayloadConfig();
  if (!config) throw new Error("Payload CMS is not configured for admin news editing.");

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-pautalia-internal-secret": config.secret,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Payload request failed with ${response.status}${message ? `: ${message}` : ""}`);
  }

  return await response.json() as T;
}

async function payloadUpload(file: File, alt: string) {
  const config = getPayloadConfig();
  if (!config) throw new Error("Payload CMS is not configured for media uploads.");

  const formData = new FormData();
  formData.set("_payload", JSON.stringify({ alt }));
  formData.set("file", file, file.name);

  const response = await fetch(`${config.baseUrl}/api/media`, {
    method: "POST",
    headers: {
      "x-pautalia-internal-secret": config.secret,
    },
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Payload media upload failed with ${response.status}${message ? `: ${message}` : ""}`);
  }

  return await response.json() as AdminMedia;
}

export async function listAdminPosts() {
  if (!isPayloadAdminConfigured()) return [];

  const params = new URLSearchParams({
    sort: "-updatedAt",
    depth: "0",
    limit: "100",
  });
  const body = await payloadRequest<PayloadListResponse>(`/api/posts?${params}`);
  return body.docs ?? [];
}

export async function getAdminPost(id: string) {
  if (!isPayloadAdminConfigured()) return null;
  return await payloadRequest<AdminPost>(`/api/posts/${encodeURIComponent(id)}?depth=0`);
}

function optionalString(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || undefined;
}

function requiredString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function mediaId(media?: AdminMediaReference | null) {
  if (!media) return undefined;
  return typeof media === "string" ? media : media.id;
}

function mediaIds(media?: AdminMediaReference[] | null) {
  return media?.map((item) => mediaId(item)).filter((id): id is string => Boolean(id)) ?? [];
}

function optionalFile(formData: FormData, name: string) {
  const value = formData.get(name);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

function fileList(formData: FormData, name: string) {
  return formData.getAll(name).filter((value): value is File => value instanceof File && value.size > 0);
}

function assertMimeType(file: File, prefix: "image/" | "video/", label: string) {
  if (!file.type.startsWith(prefix)) {
    throw new Error(`${label} must be a ${prefix === "image/" ? "image" : "video"} upload.`);
  }
}

function baseAdminPostInput(formData: FormData) {
  const status = requiredString(formData, "status");
  const publishedAt = optionalString(formData, "publishedAt");
  const defaultedPublishedAt = (publishedAt || status === "published") ? publishedAt ?? new Date().toISOString() : undefined;

  return {
    slug: requiredString(formData, "slug"),
    status,
    category: requiredString(formData, "category"),
    publishedAt: defaultedPublishedAt,
    videoUrl: optionalString(formData, "videoUrl"),
    translations: {
      bg: {
        title: requiredString(formData, "bgTitle"),
        excerpt: requiredString(formData, "bgExcerpt"),
        body: requiredString(formData, "bgBody"),
        seoTitle: optionalString(formData, "bgSeoTitle"),
        seoDescription: optionalString(formData, "bgSeoDescription"),
      },
      en: {
        title: requiredString(formData, "enTitle"),
        excerpt: requiredString(formData, "enExcerpt"),
        body: requiredString(formData, "enBody"),
        seoTitle: optionalString(formData, "enSeoTitle"),
        seoDescription: optionalString(formData, "enSeoDescription"),
      },
    },
  };
}

export function parseAdminPostForm(formData: FormData): AdminPostInput {
  return postInputSchema.parse({
    ...baseAdminPostInput(formData),
    coverMedia: requiredString(formData, "coverMediaId"),
    galleryMedia: formData.getAll("galleryMediaId").map((value) => String(value).trim()).filter(Boolean),
    videoMedia: optionalString(formData, "videoMediaId"),
  });
}

export async function parseAdminPostFormWithUploads(formData: FormData, existingPost?: AdminPost | null): Promise<AdminPostInput> {
  const baseInput = baseAdminPostInput(formData);
  const coverFile = optionalFile(formData, "coverMedia");
  const galleryFiles = fileList(formData, "galleryMedia");
  const videoFile = optionalFile(formData, "videoMedia");
  const title = baseInput.translations.en.title || baseInput.translations.bg.title || baseInput.slug;

  if (coverFile) assertMimeType(coverFile, "image/", "Hero image");
  galleryFiles.forEach((file) => assertMimeType(file, "image/", "Gallery media"));
  if (videoFile) assertMimeType(videoFile, "video/", "Video media");

  const uploadedCoverMedia = coverFile ? await payloadUpload(coverFile, `${title} hero image`) : null;
  const uploadedGalleryMedia = await Promise.all(
    galleryFiles.map((file, index) => payloadUpload(file, `${title} gallery image ${index + 1}`)),
  );
  const uploadedVideoMedia = videoFile ? await payloadUpload(videoFile, `${title} video`) : null;
  const coverMedia = uploadedCoverMedia?.id ?? mediaId(existingPost?.coverMedia);
  const galleryMedia = [
    ...mediaIds(existingPost?.galleryMedia),
    ...uploadedGalleryMedia.map((item) => item.id),
  ];
  const videoMedia = uploadedVideoMedia?.id ?? mediaId(existingPost?.videoMedia);

  return postInputSchema.parse({
    ...baseInput,
    coverMedia,
    galleryMedia,
    videoMedia,
  });
}

export async function createAdminPost(input: AdminPostInput) {
  const post = await payloadRequest<AdminPost>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
  revalidatePosts();
  return post;
}

export async function updateAdminPost(id: string, input: AdminPostInput) {
  const post = await payloadRequest<AdminPost>(`/api/posts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  revalidatePosts();
  return post;
}

export function formatAdminPostStatus(status: AdminPostStatus, locale: "bg" | "en") {
  const labels: Record<AdminPostStatus, { bg: string; en: string }> = {
    draft: { bg: "Чернова", en: "Draft" },
    published: { bg: "Публикувана", en: "Published" },
    archived: { bg: "Архивирана", en: "Archived" },
  };
  return labels[status][locale];
}

export function formatAdminPostCategory(category: AdminPostCategory, locale: "bg" | "en") {
  const labels: Record<AdminPostCategory, { bg: string; en: string }> = {
    news: { bg: "Новини", en: "News" },
    construction_update: { bg: "Строителство", en: "Construction" },
    announcement: { bg: "Съобщение", en: "Announcement" },
    press: { bg: "Преса", en: "Press" },
  };
  return labels[category][locale];
}

function revalidatePosts() {
  revalidateTag("pautalia:posts");
  revalidatePath("/news");
  revalidatePath("/sitemap.xml");
}
