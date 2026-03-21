import Image from "next/image";
import type { Metadata } from "next";
import { getNearbyPlaces, getSiteCopy } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === "bg" ? "Локация" : "Location",
    description:
      locale === "bg"
        ? "Локацията, достъпът и ежедневната среда около сградата."
        : "The location, access, and everyday setting around the building.",
  };
}

export default async function LocationPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const nearbyPlaces = getNearbyPlaces(locale);
  const siteCopy = getSiteCopy(locale);

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src="/assets/gallery/balcony-view.jpg" alt={messages.location.heroTitle} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{messages.location.heroEyebrow}</span>
            <h1 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.6rem] lg:text-[6rem]">{messages.location.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{messages.location.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3">
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">{siteCopy.locationLabel}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.location.project}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">{messages.location.accessValue}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.location.access}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">{messages.location.toneValue}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.location.tone}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div>
            <SectionHeading eyebrow={messages.location.contextEyebrow} title={messages.location.contextTitle} copy={messages.location.contextCopy} />
            <div className="page-line-list mt-10">
              {nearbyPlaces.map((place) => (
                <div key={place.name} className="page-line-item flex items-center justify-between gap-4">
                  <span className="text-[color:var(--muted)]">{place.name}</span>
                  <span className="font-semibold text-[color:var(--ink)]">{place.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-image-block">
            <Image
              src="/assets/gallery/exterior-front.jpg"
              alt={messages.location.previewEyebrow}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07131d]/80 via-[#07131d]/16 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/58">{messages.location.previewEyebrow}</p>
              <p className="mt-4 max-w-md font-serif text-4xl leading-[1.02]">{messages.location.previewCopy}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
