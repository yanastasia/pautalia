import Image from "next/image";
import type { Metadata } from "next";
import { Compass, Link2, SlidersHorizontal } from "lucide-react";
import { UnitsFinder } from "@/components/units/units-finder";
import { getMessages } from "@/lib/i18n/messages";
import { fetchAllPautaliaUnits, fetchPautaliaParkingUnits } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/units",
    title: locale === "bg" ? "Жилища и паркоместа" : "Homes & parking spaces",
    description:
      locale === "bg"
        ? "Разгледайте жилища и паркоместа. Филтрирайте по сграда, наличност и други критерии."
        : "Browse homes and parking spaces. Filter by building, availability, and more.",
    imagePath: "/assets/buildings/residence/gallery/living-entry.jpg",
    imageAlt: locale === "bg" ? "Интериор на апартамент в Pautalia" : "Pautalia apartment interior",
  });
}

export default async function UnitsPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const [apartments, parking] = await Promise.all([fetchAllPautaliaUnits(locale), fetchPautaliaParkingUnits(locale)]);
  const visiblePrices = apartments.filter((unit) => unit.isPriceVisible).length;

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/buildings/residence/gallery/living-entry.jpg" alt={messages.apartments.heroTitle} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{locale === "bg" ? "Инвентар" : "Inventory"}</span>
            <h1 className="mt-6 max-w-[12ch] font-serif text-[2.6rem] leading-[0.92] text-white sm:text-[4.2rem] lg:text-[6rem]">
              {locale === "bg" ? "Жилища и паркоместа" : "Homes & parking"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
              {locale === "bg"
                ? "Филтрирайте по сграда и наличност. Превключете между жилища и паркоместа."
                : "Filter by building and availability. Switch between homes and parking."}
            </p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark hidden md:block">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <SlidersHorizontal className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-5xl leading-none">{apartments.length + parking.length}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">
                {locale === "bg" ? "Общо единици" : "Total units"}
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

      <section className="pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <UnitsFinder apartments={apartments} parking={parking} />
        </div>
      </section>
    </>
  );
}

