import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "title" },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea" },
    { name: "isPublished", type: "checkbox", defaultValue: true },
  ],
};

