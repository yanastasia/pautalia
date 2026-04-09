import type { Locale } from "@/lib/i18n/config";

const orientationLabels: Record<string, Record<Locale, string>> = {
  north: { en: "North", bg: "Север" },
  south: { en: "South", bg: "Юг" },
  east: { en: "East", bg: "Изток" },
  west: { en: "West", bg: "Запад" },
  "north-east": { en: "North-East", bg: "Североизток" },
  "north-west": { en: "North-West", bg: "Северозапад" },
  "south-east": { en: "South-East", bg: "Югоизток" },
  "south-west": { en: "South-West", bg: "Югозапад" },
};

const outdoorTypeLabels: Record<string, Record<Locale, string>> = {
  yard: { en: "Private yard", bg: "Частен двор" },
  terrace: { en: "Terrace", bg: "Тераса" },
  balcony: { en: "Balcony", bg: "Балкон" },
  "panoramic terrace": { en: "Panoramic terrace", bg: "Панорамна тераса" },
};

const featureLabels: Record<string, Record<Locale, string>> = {
  "One bedroom": { en: "One bedroom", bg: "Една спалня" },
  "Two bedrooms": { en: "Two bedrooms", bg: "Две спални" },
  "Three bedrooms": { en: "Three bedrooms", bg: "Три спални" },
  "One bathroom": { en: "One bathroom", bg: "Една баня" },
  "Two bathrooms": { en: "Two bathrooms", bg: "Две бани" },
  "Separate WC": { en: "Separate WC", bg: "Отделна тоалетна" },
  "Private yard": { en: "Private yard", bg: "Частен двор" },
  Balcony: { en: "Balcony", bg: "Балкон" },
  Terrace: { en: "Terrace", bg: "Тераса" },
  "Panoramic terrace": { en: "Panoramic terrace", bg: "Панорамна тераса" },
};

function titleCaseWords(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");
}

export function getOrientationLabel(locale: Locale, orientation: string) {
  return orientationLabels[orientation]?.[locale] ?? titleCaseWords(orientation);
}

export function getOutdoorTypeLabel(locale: Locale, outdoorType: string | null | undefined) {
  if (!outdoorType) {
    return null;
  }

  return outdoorTypeLabels[outdoorType]?.[locale] ?? titleCaseWords(outdoorType);
}

export function getFeatureLabel(locale: Locale, feature: string) {
  return featureLabels[feature]?.[locale] ?? feature;
}
