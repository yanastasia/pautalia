import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Onest, Prata } from "next/font/google";
import { getSiteCopy } from "@/content/site-content";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getLocale } from "@/lib/i18n/server";
import { getProjectJsonLd } from "@/lib/json-ld";
import "./globals.css";

const serif = Prata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400"],
});

const sans = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ogImage = new URL("/assets/exterior/exterior-front.jpg", siteUrl).toString();

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#16181b" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

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
      url: siteUrl,
      siteName: siteCopy.name,
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_US",
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 900,
          alt: locale === "bg" ? "Екстериор на сградата" : "Building exterior",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteCopy.name,
      description: siteCopy.heroText,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC;
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body>
        {plausibleDomain && plausibleSrc ? (
          <Script data-domain={plausibleDomain} defer src={plausibleSrc} />
        ) : null}
        <Script
          id="project-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProjectJsonLd({ locale, siteCopy, siteUrl })) }}
        />
        <LocaleProvider locale={locale}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader brandName={siteCopy.name} />
            <main className="flex-1">{children}</main>
            <SiteFooter locationLabel={siteCopy.locationLabel} contactEmail={siteCopy.contactEmail} contactPhone={siteCopy.contactPhone} />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
