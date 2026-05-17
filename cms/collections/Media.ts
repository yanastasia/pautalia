import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 300, height: 200 },
      { name: "card", width: 800, height: 600 },
      { name: "hero", width: 1920, height: 1080 },
    ],
  },
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  fields: [{ name: "alt", type: "text", required: true }],
};

