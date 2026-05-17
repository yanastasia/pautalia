import type { AdminLeadStatus } from "@/lib/admin-data";
import type { Locale } from "@/lib/i18n/config";

const bgLeadStatusLabels: Record<AdminLeadStatus, string> = {
  new: "ново",
  contacted: "контактуван",
  qualified: "квалифициран",
  viewing_booked: "оглед записан",
  reserved: "резервиран",
  closed: "приключен",
  archived: "архивиран",
  spam: "спам",
};

export function formatAdminDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatLeadStatus(status: AdminLeadStatus, locale: Locale) {
  if (locale === "bg") return bgLeadStatusLabels[status];
  return status.replaceAll("_", " ");
}
