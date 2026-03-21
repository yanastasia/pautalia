import type { Locale } from "@/lib/i18n/config";
import type { PublicBuilding, PublicUnit } from "@/types/public-api";

type SiteJsonLdInput = {
  locale: Locale;
  siteCopy: {
    name: string;
    tagline: string;
    heroText: string;
    contactEmail: string;
    contactPhone: string;
    locationLabel: string;
  };
  siteUrl: string;
};

export function getProjectJsonLd({ locale, siteCopy, siteUrl }: SiteJsonLdInput) {
  const imageUrl = new URL("/assets/exterior/exterior-front.jpg", siteUrl).toString();
  const [city] = siteCopy.locationLabel.split(",").map((value) => value.trim());

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteCopy.name,
      url: siteUrl,
      inLanguage: locale,
      description: siteCopy.tagline,
    },
    {
      "@context": "https://schema.org",
      "@type": "ApartmentComplex",
      name: siteCopy.name,
      url: siteUrl,
      description: siteCopy.heroText,
      image: imageUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: city || "Kyustendil",
        addressCountry: "BG",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: locale === "bg" ? "Свободни жилища" : "Available homes" },
        { "@type": "LocationFeatureSpecification", name: locale === "bg" ? "Интерактивни планове" : "Interactive floor plans" },
        { "@type": "LocationFeatureSpecification", name: locale === "bg" ? "Лична консултация" : "Personal consultation" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: `${siteCopy.name} Sales`,
      url: `${siteUrl}/contact`,
      email: siteCopy.contactEmail,
      telephone: siteCopy.contactPhone,
      areaServed: city || "Kyustendil",
      availableLanguage: ["bg", "en"],
    },
  ];
}

export function getBuildingJsonLd(building: Pick<PublicBuilding, "name" | "description" | "heroImage" | "totalUnits">) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: building.name,
    description: building.description,
    image: building.heroImage,
    numberOfAccommodationUnits: building.totalUnits,
  };
}

export function getUnitJsonLd(unit: Pick<PublicUnit, "code" | "floor" | "rooms" | "size" | "status" | "price">) {
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: `Unit ${unit.code}`,
    floorLevel: unit.floor,
    numberOfRooms: unit.rooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: unit.size,
      unitCode: "MTK",
    },
    offers: {
      "@type": "Offer",
      availability:
        unit.status === "available"
          ? "https://schema.org/InStock"
          : unit.status === "reserved"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/SoldOut",
      priceCurrency: "EUR",
      price: unit.price,
    },
  };
}
