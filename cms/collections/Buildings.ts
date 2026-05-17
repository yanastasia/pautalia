import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Buildings: CollectionConfig = {
  slug: "buildings",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "status", type: "select", defaultValue: "published", options: ["draft", "published", "archived"] },
    { name: "displayOrder", type: "number", defaultValue: 0 },
    { name: "priceVisibilityMode", type: "select", defaultValue: "per_unit", options: ["visible", "hidden", "per_unit"] },
    { name: "shortDescription", type: "textarea" },
    { name: "fullDescription", type: "textarea" },
    { name: "locationContent", type: "textarea" },
    { name: "contactContent", type: "textarea" },
  ],
};

