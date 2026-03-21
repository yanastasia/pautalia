import type { Locale } from "@/lib/i18n/config";

type SiteCopy = {
  name: string;
  tagline: string;
  heroText: string;
  contactEmail: string;
  contactPhone: string;
  locationLabel: string;
};

type HomeStorySection = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
};

type HomeJournalItem = {
  id: string;
  dateLabel: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  imageAlt: string;
};

type GalleryAsset = {
  id: string;
  title: string;
  categoryLabel: string;
  image: string;
  caption: string;
};

type NearbyPlace = {
  name: string;
  value: string;
};

const siteCopyByLocale: Record<Locale, SiteCopy> = {
  en: {
    name: "Pautalia",
    tagline: "Contemporary homes in Kyustendil with clear layouts and calm surroundings.",
    heroText: "Explore the building, review the available homes, and contact the sales team for current availability.",
    contactEmail: "sales@pautalia.bg",
    contactPhone: "+359 888 000 124",
    locationLabel: "Kyustendil, Bulgaria",
  },
  bg: {
    name: "Pautalia",
    tagline: "Съвременни жилища в Кюстендил с ясни разпределения и спокойна среда.",
    heroText: "Разгледайте сградата, вижте свободните жилища и се свържете с търговския екип за актуална наличност.",
    contactEmail: "sales@pautalia.bg",
    contactPhone: "+359 888 000 124",
    locationLabel: "Кюстендил, България",
  },
};

const homeStorySectionsByLocale: Record<Locale, HomeStorySection[]> = {
  en: [
    {
      id: "architecture",
      eyebrow: "Architecture",
      title: "Balanced proportions, generous light, and homes designed for everyday ease.",
      copy: "The building combines practical layouts, private outdoor space where available, and a quieter residential setting.",
      ctaLabel: "See the building",
      href: "/project",
      image: "/assets/gallery/exterior-front.jpg",
      imageAlt: "Exterior view of the development",
    },
    {
      id: "selection",
      eyebrow: "Available homes",
      title: "A direct path from the first impression to the right home.",
      copy: "Open a building, review a floor, and compare the homes by area, rooms, and orientation.",
      ctaLabel: "Browse homes",
      href: "/apartments",
      image: "/assets/gallery/living-entry.jpg",
      imageAlt: "Representative living room interior",
    },
  ],
  bg: [
    {
      id: "architecture",
      eyebrow: "Архитектура",
      title: "Балансирани пропорции, щедра светлина и жилища, създадени за всекидневен комфорт.",
      copy: "Сградата съчетава практични разпределения, частни външни пространства при избрани жилища и по-спокойна жилищна среда.",
      ctaLabel: "Виж сградата",
      href: "/project",
      image: "/assets/gallery/exterior-front.jpg",
      imageAlt: "Екстериор на комплекса",
    },
    {
      id: "selection",
      eyebrow: "Свободни жилища",
      title: "Ясен път от първото впечатление до правилния дом.",
      copy: "Отворете сградата, вижте етаж и сравнете жилищата по площ, стаи и изложение.",
      ctaLabel: "Разгледай жилищата",
      href: "/apartments",
      image: "/assets/gallery/living-entry.jpg",
      imageAlt: "Представителен интериор на дневна",
    },
  ],
};

const homeJournalItemsByLocale: Record<Locale, HomeJournalItem[]> = {
  en: [
    {
      id: "buildings",
      dateLabel: "March 2026",
      category: "Buildings",
      title: "A clear collection of homes with distinct layouts and outlooks.",
      excerpt: "Review the current selection in the building and continue directly to the available homes inside.",
      href: "/project",
      image: "/assets/gallery/exterior-front.jpg",
      imageAlt: "Front elevation",
    },
    {
      id: "location",
      dateLabel: "March 2026",
      category: "Location",
      title: "A quieter part of Kyustendil, close to daily essentials.",
      excerpt: "See the setting nearby and the places that shape everyday life around the development.",
      href: "/location",
      image: "/assets/gallery/balcony-view.jpg",
      imageAlt: "View toward the surroundings",
    },
    {
      id: "viewing",
      dateLabel: "March 2026",
      category: "Viewings",
      title: "Arrange a viewing or ask for current availability.",
      excerpt: "Speak directly with the sales team about layouts, prices, and the next available viewing slot.",
      href: "/contact",
      image: "/assets/gallery/bedroom-entry.jpg",
      imageAlt: "Bedroom interior",
    },
  ],
  bg: [
    {
      id: "buildings",
      dateLabel: "Март 2026",
      category: "Сгради",
      title: "Ясна селекция от жилища с различни разпределения и гледки.",
      excerpt: "Разгледайте текущата селекция в сградата и преминете директно към свободните жилища вътре.",
      href: "/project",
      image: "/assets/gallery/exterior-front.jpg",
      imageAlt: "Фронтален изглед",
    },
    {
      id: "location",
      dateLabel: "Март 2026",
      category: "Локация",
      title: "По-спокойна част на Кюстендил, близо до ежедневните удобства.",
      excerpt: "Разгледайте средата наоколо и местата, които оформят всекидневието около сградата.",
      href: "/location",
      image: "/assets/gallery/balcony-view.jpg",
      imageAlt: "Изглед към околността",
    },
    {
      id: "viewing",
      dateLabel: "Март 2026",
      category: "Огледи",
      title: "Запишете оглед или попитайте за актуална наличност.",
      excerpt: "Говорете директно с търговския екип за разпределения, цени и следващ свободен час за оглед.",
      href: "/contact",
      image: "/assets/gallery/bedroom-entry.jpg",
      imageAlt: "Интериор на спалня",
    },
  ],
};

const galleryAssetsByLocale: Record<Locale, GalleryAsset[]> = {
  en: [
    {
      id: "gallery-1",
      title: "Street elevation",
      categoryLabel: "Exterior",
      image: "/assets/gallery/exterior-front.jpg",
      caption: "Main facade direction and the arrival edge along the street.",
    },
    {
      id: "gallery-2",
      title: "Living space",
      categoryLabel: "Interior",
      image: "/assets/gallery/living-entry.jpg",
      caption: "Representative living area with a calm neutral palette and direct garden connection.",
    },
    {
      id: "gallery-3",
      title: "Entrance hall",
      categoryLabel: "Interior",
      image: "/assets/gallery/hall-entry.jpg",
      caption: "Warm timber tones and clean circulation at the entrance.",
    },
    {
      id: "gallery-4",
      title: "Bedroom",
      categoryLabel: "Interior",
      image: "/assets/gallery/bedroom-entry.jpg",
      caption: "Bright bedroom concept with restrained finishes.",
    },
    {
      id: "gallery-5",
      title: "Bathroom",
      categoryLabel: "Interior",
      image: "/assets/gallery/bathroom-entry.jpg",
      caption: "Bathroom detail with integrated storage and a restrained palette.",
    },
  ],
  bg: [
    {
      id: "gallery-1",
      title: "Улична фасада",
      categoryLabel: "Екстериор",
      image: "/assets/gallery/exterior-front.jpg",
      caption: "Основната фасада и усещането при пристигане откъм улицата.",
    },
    {
      id: "gallery-2",
      title: "Дневна зона",
      categoryLabel: "Интериор",
      image: "/assets/gallery/living-entry.jpg",
      caption: "Представителна дневна с спокойна неутрална палитра и връзка към двора.",
    },
    {
      id: "gallery-3",
      title: "Антре",
      categoryLabel: "Интериор",
      image: "/assets/gallery/hall-entry.jpg",
      caption: "Топли дървесни тонове и чиста циркулация при входа.",
    },
    {
      id: "gallery-4",
      title: "Спалня",
      categoryLabel: "Интериор",
      image: "/assets/gallery/bedroom-entry.jpg",
      caption: "Светла спалня с изчистени материали и спокойна атмосфера.",
    },
    {
      id: "gallery-5",
      title: "Баня",
      categoryLabel: "Интериор",
      image: "/assets/gallery/bathroom-entry.jpg",
      caption: "Детайл от баня с интегрирано съхранение и изчистена палитра.",
    },
  ],
};

const nearbyPlacesByLocale: Record<Locale, NearbyPlace[]> = {
  en: [
    { name: "City center", value: "4 min drive" },
    { name: "Regional hospital", value: "6 min drive" },
    { name: "Primary school", value: "8 min walk" },
    { name: "Hisarlaka Park", value: "10 min drive" },
  ],
  bg: [
    { name: "Център", value: "4 мин с кола" },
    { name: "Болница", value: "6 мин с кола" },
    { name: "Основно училище", value: "8 мин пеша" },
    { name: "Парк Хисарлъка", value: "10 мин с кола" },
  ],
};

export function getSiteCopy(locale: Locale) {
  return siteCopyByLocale[locale];
}

export function getHomeStorySections(locale: Locale) {
  return homeStorySectionsByLocale[locale];
}

export function getHomeJournalItems(locale: Locale) {
  return homeJournalItemsByLocale[locale];
}

export function getGalleryAssets(locale: Locale) {
  return galleryAssetsByLocale[locale];
}

export function getNearbyPlaces(locale: Locale) {
  return nearbyPlacesByLocale[locale];
}
