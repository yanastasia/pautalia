import type { CollectionConfig, FieldHook } from "payload/types";
import { adminsOnly } from "./access";

const requirePublishedTranslations: FieldHook = ({ data, value }) => {
  if (value !== "published") return value;

  const translations = data?.translations;
  const bg = translations?.bg;
  const en = translations?.en;

  if (!bg?.title || !bg?.body || !en?.title || !en?.body) {
    throw new Error("Bulgarian and English title/body are required before publishing.");
  }

  return value;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "slug", defaultColumns: ["slug", "category", "status", "publishedAt"] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      hooks: { beforeValidate: [requirePublishedTranslations] },
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "news",
      options: [
        { label: "News", value: "news" },
        { label: "Construction update", value: "construction_update" },
        { label: "Announcement", value: "announcement" },
        { label: "Press", value: "press" },
      ],
    },
    { name: "building", type: "relationship", relationTo: "buildings" },
    { name: "publishedAt", type: "date" },
    { name: "coverMedia", type: "relationship", relationTo: "media" },
    { name: "galleryMedia", type: "relationship", relationTo: "media", hasMany: true },
    { name: "videoUrl", type: "text" },
    {
      name: "translations",
      type: "group",
      fields: [
        {
          name: "bg",
          type: "group",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "excerpt", type: "textarea", required: true },
            { name: "body", type: "richText", required: true },
            { name: "seoTitle", type: "text" },
            { name: "seoDescription", type: "textarea" },
          ],
        },
        {
          name: "en",
          type: "group",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "excerpt", type: "textarea", required: true },
            { name: "body", type: "richText", required: true },
            { name: "seoTitle", type: "text" },
            { name: "seoDescription", type: "textarea" },
          ],
        },
      ],
    },
    { name: "internalNotes", type: "textarea", admin: { position: "sidebar" } },
  ],
};
