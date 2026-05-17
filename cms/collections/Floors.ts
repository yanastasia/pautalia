import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Floors: CollectionConfig = {
  slug: "floors",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "label" },
  fields: [
    { name: "building", type: "relationship", relationTo: "buildings", required: true },
    { name: "number", type: "number", required: true },
    { name: "label", type: "text", required: true },
    { name: "floorplanImage", type: "upload", relationTo: "media" },
    { name: "mapMetadata", type: "json" },
  ],
};

