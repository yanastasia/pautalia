import type { CollectionConfig } from "payload/types";
import { adminsOnly } from "./access";

export const Leads: CollectionConfig = {
  slug: "leads",
  access: { read: adminsOnly, create: adminsOnly, update: adminsOnly, delete: adminsOnly },
  admin: { useAsTitle: "fullName", defaultColumns: ["fullName", "email", "status", "createdAt"] },
  fields: [
    { name: "fullName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea" },
    { name: "unit", type: "relationship", relationTo: "units" },
    { name: "building", type: "relationship", relationTo: "buildings" },
    { name: "status", type: "select", defaultValue: "new", options: ["new", "contacted", "qualified", "viewing_booked", "reserved", "closed", "archived", "spam"] },
    { name: "sourcePageUrl", type: "text" },
    { name: "referrer", type: "text" },
    { name: "utmSource", type: "text" },
    { name: "utmMedium", type: "text" },
    { name: "utmCampaign", type: "text" },
    { name: "utmTerm", type: "text" },
    { name: "utmContent", type: "text" },
    { name: "adminNotes", type: "textarea" },
    { name: "consentTimestamp", type: "date" },
  ],
};

