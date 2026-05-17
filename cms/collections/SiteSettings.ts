import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const SiteSettings: CollectionConfig = {
  slug: "site-settings",
  access: { read: () => true, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "label" },
  fields: [
    { name: "label", type: "text", required: true, defaultValue: "Default settings" },
    { name: "priceVisibilityMode", type: "select", required: true, defaultValue: "per_unit", options: ["visible", "hidden", "per_unit"] },
    { name: "contactEmail", type: "email" },
    { name: "contactPhone", type: "text" },
    { name: "bookingUrl", type: "text" },
    { name: "announcement", type: "textarea" },
    { name: "analyticsEnabled", type: "checkbox", defaultValue: true },
    { name: "cookieConsentMode", type: "select", defaultValue: "explicit", options: ["explicit", "cookieless_no_consent"] },
  ],
};

