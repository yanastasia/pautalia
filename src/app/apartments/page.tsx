import Image from "next/image";
import type { Metadata } from "next";
import { Compass, Link2, SlidersHorizontal } from "lucide-react";
import { ApartmentFinder } from "@/components/apartments/apartment-finder";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { fetchAllPautaliaUnits } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";

function normalizeUnitSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    const firstValue = Array.isArray(value) ? value[0] : value;
    if (!firstValue) {
      continue;
    }

    if (key === "price_min") {
      normalized.minPrice = firstValue;
      continue;
    }

    if (key === "price_max") {
      normalized.maxPrice = firstValue;
      continue;
    }

    if (key === "availability") {
      normalized.status = firstValue;
      continue;
    }

    normalized[key] = firstValue;
  }

  return normalized;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/apartments",
    title: locale === "bg" ? "Свободни апартаменти в Кюстендил" : "Available apartments in Kyustendil",
    description:
      locale === "bg"
        ? "Филтрирай апартаменти по стаи, етаж, цена, изложение и наличност."
        : "Filter units by rooms, floor, price, orientation, and availability.",
    imagePath: "/assets/gallery/living-entry.jpg",
    imageAlt: locale === "bg" ? "Интериор на апартамент в Pautalia" : "Pautalia apartment interior",
  });
}

export default async function ApartmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const normalizedSearchParams = normalizeUnitSearchParams(await searchParams);
  const [allUnits, filteredUnits] = await Promise.all([
    fetchAllPautaliaUnits(locale),
    fetchAllPautaliaUnits(locale, normalizedSearchParams),
  ]);
  const visiblePrices = allUnits.filter((unit) => unit.isPriceVisible).length;

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/gallery/living-entry.jpg" alt={messages.apartments.heroTitle} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{messages.apartments.heroEyebrow}</span>
            <h1 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.6rem] lg:text-[6rem]">
              {messages.apartments.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{messages.apartments.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <SlidersHorizontal className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-5xl leading-none">{allUnits.length}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">
                {locale === "bg" ? "Публикувани жилища" : "Published homes"}
              </p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <Link2 className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-5xl leading-none">URL</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">
                {locale === "bg" ? "Споделяеми филтри" : "Shareable filters"}
              </p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <Compass className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-5xl leading-none">{visiblePrices}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">
                {locale === "bg" ? "С видима цена" : "With visible price"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={messages.apartments.inventoryEyebrow}
            title={messages.apartments.inventoryTitle}
            copy={messages.apartments.inventoryCopy}
          />

          <div className="mt-12">
            <ApartmentFinder
              units={filteredUnits}
              allUnits={allUnits}
            />
          </div>
        </div>
      </section>
    </>
  );
}
