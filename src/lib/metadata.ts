import type { Metadata } from "next";
import { getSiteCopy } from "@/content/site-content";
import type { Locale } from "@/lib/i18n/config";

const fallbackSiteUrl = "http://localhost:3000";
const defaultImagePath = "/assets/exterior/exterior-front.jpg";
const imageWidth = 1600;
const imageHeight = 900;

type PageMetadataInput = {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  imagePath?: string;
  imageAlt?: string;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl;
}

function getOpenGraphLocale(locale: Locale) {
  return locale === "bg" ? "bg_BG" : "en_US";
}

export function toAbsoluteUrl(pathname: string) {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  return new URL(pathname, getSiteUrl()).toString();
}

export function buildRootMetadata({ locale }: { locale: Locale }): Metadata {
  const siteCopy = getSiteCopy(locale);
  const imageAlt = locale === "bg" ? "Екстериор на сградата Pautalia" : "Pautalia building exterior";
  const imageUrl = toAbsoluteUrl(defaultImagePath);
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteCopy.name,
    title: {
      default: siteCopy.name,
      template: `%s | ${siteCopy.name}`,
    },
    description: siteCopy.tagline,
    keywords:
      locale === "bg"
        ? ["апартаменти Кюстендил", "ново строителство Кюстендил", "жилища в Кюстендил", "апартаменти за продажба", "сграда ново строителство"]
        : ["apartments in Kyustendil", "new homes in Kyustendil", "apartments for sale", "homes in Bulgaria", "new building homes"],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      title: siteCopy.name,
      description: siteCopy.heroText,
      url: toAbsoluteUrl("/"),
      siteName: siteCopy.name,
      type: "website",
      locale: getOpenGraphLocale(locale),
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteCopy.name,
      description: siteCopy.heroText,
      images: [imageUrl],
    },
  };
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  imagePath = defaultImagePath,
  imageAlt,
}: PageMetadataInput): Metadata {
  const siteCopy = getSiteCopy(locale);
  const imageUrl = toAbsoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(pathname),
      siteName: siteCopy.name,
      type: "website",
      locale: getOpenGraphLocale(locale),
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
