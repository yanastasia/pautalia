import type { Locale } from "@/lib/i18n/config";

export type PostStatus = "draft" | "published" | "archived";
export type PostCategory = "news" | "construction_update" | "announcement" | "press";

export type PublicPostTranslation = {
  title: string;
  excerpt: string;
  body: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type PublicPost = {
  id: string;
  slug: string;
  status: Extract<PostStatus, "published">;
  category: PostCategory;
  buildingId?: string;
  building?: { id: string; slug: string; name: string } | null;
  publishedAt: string;
  coverImage?: string;
  coverImageAlt: string;
  gallery: Array<{ src: string; alt: string }>;
  videoMedia?: { src: string; mimeType?: string };
  videoUrl?: string;
  translation: PublicPostTranslation;
  translations: Record<Locale, PublicPostTranslation>;
};

export type PostListResponse = {
  items: PublicPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
