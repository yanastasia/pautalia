import type { CollectionConfig } from "payload/types";

export const AdminUsers: CollectionConfig = {
  slug: "admin-users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "super_admin",
      options: ["super_admin", "sales_admin", "content_admin"],
    },
    { name: "totpEnabled", type: "checkbox", defaultValue: false },
    { name: "totpSecret", type: "text", admin: { condition: () => false } },
  ],
};

