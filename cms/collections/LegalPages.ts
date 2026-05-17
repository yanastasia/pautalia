import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const LegalPages: CollectionConfig = {
  slug: "legal-pages",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "title" },
  fields: [
    { name: "slug", type: "select", required: true, options: ["privacy", "cookies", "terms"] },
    { name: "locale", type: "select", required: true, defaultValue: "bg", options: ["bg", "en"] },
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "reviewedAt", type: "date" },
    { name: "isPublished", type: "checkbox", defaultValue: true },
  ],
};

