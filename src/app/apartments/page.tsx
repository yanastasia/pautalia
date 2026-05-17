import Image from "next/image";
import type { Metadata } from "next";
import { Compass, Link2, SlidersHorizontal } from "lucide-react";
import { ApartmentFinder } from "@/components/apartments/apartment-finder";
import { getMessages } from "@/lib/i18n/messages";
import { fetchAllPautaliaUnits } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";

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
    imagePath: "/assets/buildings/residence/gallery/living-entry.jpg",
    imageAlt: locale === "bg" ? "Интериор на апартамент в Pautalia" : "Pautalia apartment interior",
  });
}

export default async function ApartmentsPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const allUnits = await fetchAllPautaliaUnits(locale);
  const visiblePrices = allUnits.filter((unit) => unit.isPriceVisible).length;

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/buildings/residence/gallery/living-entry.jpg" alt={messages.apartments.heroTitle} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{messages.apartments.heroEyebrow}</span>
            <h1 className="mt-6 max-w-[12ch] font-serif text-[2.6rem] leading-[0.92] text-white sm:text-[4.2rem] lg:text-[6rem]">
              {messages.apartments.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">{messages.apartments.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark hidden md:block">
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

      <section className="pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <ApartmentFinder
            allUnits={allUnits}
          />
        </div>
      </section>
    </>
  );
}
