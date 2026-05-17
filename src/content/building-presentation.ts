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
  shortDescription: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const buildingPresentation: Record<string, BuildingPresentation> = {
  "building-a": {
    heroImage: "/assets/buildings/hero/residence_exterior-front.jpg",
    modelColor: "#c77d4f",
    sequence: 1,
    completionPercent: 5,
    deliveryQuarter: {
      en: "",
      bg: "",
    },
    floorplanImage: "/assets/buildings/residence/floors/floor-01.png",
    panoramaImage: "/assets/buildings/residence/panoramas/living-panorama.jpg",
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
    shortDescription: {
      en: "Spacious homes with broad outlooks, practical layouts, and private yards on floor one.",
      bg: "Просторни жилища с широки гледки, практични разпределения и частни дворове на първия етаж.",
    },
    description: {
      en: "Residence offers larger homes, private outdoor space on the ground floor, and broad views from the upper levels.",
      bg: "Резиденс предлага по-просторни жилища, частни външни пространства на първия етаж и широки гледки от горните нива.",
    },
  },
  "building-b": {
    heroImage: "/assets/buildings/park/hero/park_exterior-front.png",
    modelColor: "#7f988a",
    sequence: 2,
    completionPercent: 0,
    deliveryQuarter: {
      en: "",
      bg: "",
    },
    floorplanImage: "/assets/buildings/park/floors/floor-01.png",
    panoramaImage: "",
    amenities: {
      en: [
        "6 apartments across 3 floors",
        "Private yards on the ground floor",
        "Two balconies on upper-floor homes",
        "6 integrated parking spaces",
      ],
      bg: [
        "6 апартамента в 3 етажа",
        "Лични дворове на партера",
        "Два балкона при жилищата на горните етажи",
        "6 интегрирани паркоместа",
      ],
    },
    coordinates: [3.8, 0, 0],
    tagline: {
      en: "Six apartments across three floors with private yards on the ground level and open balconies above.",
      bg: "Шест апартамента в три етажа с лични дворове на партера и просторни балкони на горните нива.",
    },
    shortDescription: {
      en: "Six apartments across three floors with private yards on the ground level and open balconies above.",
      bg: "Шест апартамента в три етажа — с лични дворове на партера и просторни балкони на горните нива.",
    },
    description: {
      en: "Park offers six apartments across three floors, each with a clear and practical layout. Ground-floor apartments have private yards, while second and third-floor apartments feature two balconies and a dedicated dressing room. Six parking spaces are integrated into the property.",
      bg: "Парк предлага шест апартамента в три етажа, всеки с ясна и практична планировка. Апартаментите на партера разполагат с лични дворове, а жилищата на втори и трети етаж имат по два балкона и тракт за дрехи. Шест паркоместа са интегрирани в имота.",
    },
  },
};
