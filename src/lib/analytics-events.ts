import { z } from "zod";

export const analyticsEventNames = [
  "page_view",
  "apartment_card_click",
  "apartment_detail_view",
  "apartment_gallery_click",
  "floor_plan_view",
  "floor_plan_download",
  "filter_used",
  "contact_form_submit",
  "request_viewing_submit",
  "phone_click",
  "email_click",
  "whatsapp_click",
  "brochure_download",
  "cta_click",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const analyticsEventNameSchema = z.enum(analyticsEventNames);

export const analyticsDeviceSchema = z.enum(["mobile", "desktop", "tablet"]);

export type AnalyticsDevice = z.infer<typeof analyticsDeviceSchema>;
