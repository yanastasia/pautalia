import type { Metadata, Viewport } from "next";
import { Onest, Prata } from "next/font/google";
import { getSiteCopy } from "@/content/site-content";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { getLocale } from "@/lib/i18n/server";
import { getProjectJsonLd } from "@/lib/json-ld";
import { buildRootMetadata } from "@/lib/metadata";
import "./globals.css";
import "leaflet/dist/leaflet.css";

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
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#16181b" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildRootMetadata({ locale });
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script
          id="project-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProjectJsonLd({ locale, siteCopy, siteUrl })) }}
        />
        <LocaleProvider locale={locale}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader brandName={siteCopy.name} />
            <main className="flex-1">{children}</main>
            <SiteFooter locationLabel={siteCopy.locationLabel} contactEmail={siteCopy.contactEmail} contactPhone={siteCopy.contactPhone} />
            <AnalyticsTracker />
            <CookieConsent />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
