import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Typologies: CollectionConfig = {
  slug: "typologies",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "label" },
  fields: [
    { name: "building", type: "relationship", relationTo: "buildings", required: true },
    { name: "slug", type: "text", required: true },
    { name: "label", type: "text", required: true },
    { name: "rooms", type: "number", required: true },
    { name: "description", type: "textarea" },
    { name: "defaultFloorplan", type: "upload", relationTo: "media" },
    { name: "futureTwinMetadata", type: "json" },
  ],
};

