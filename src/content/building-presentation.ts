import type { Locale } from "@/lib/i18n/config";

export type BuildingPresentation = {
  heroImage: string;
  modelColor: string;
  sequence: number;
  completionPercent: number;
  deliveryQuarter: Record<Locale, string>;
  floorplanImage: string;
  panoramaImage: string;
  amenities: Record<Locale, string[]>;
  coordinates: [number, number, number];
  tagline: Record<Locale, string>;
};

export const buildingPresentation: Record<string, BuildingPresentation> = {
  "building-a": {
    heroImage: "/assets/exterior/exterior-front.jpg",
    modelColor: "#c77d4f",
    sequence: 1,
    completionPercent: 82,
    deliveryQuarter: {
      en: "Q4 2027",
      bg: "Q4 2027",
    },
    floorplanImage: "/assets/floorplans/floorplan-typical.jpg",
    panoramaImage: "/assets/panoramas/living-panorama.jpg",
    amenities: {
      en: [
        "Premium insulated facade",
        "Controlled access and CCTV",
        "Underground parking access",
        "Shared landscaped court",
      ],
      bg: [
        "Премиум топлоизолирана фасада",
        "Контролиран достъп и видеонаблюдение",
        "Достъп до подземно паркиране",
        "Озеленен общ двор",
      ],
    },
    coordinates: [-3.8, 0, 0],
    tagline: {
      en: "Larger homes with open views and private outdoor space on the ground floor.",
      bg: "По-просторни жилища с открити гледки и частни дворове на първия етаж.",
    },
  },
};
