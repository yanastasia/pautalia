import Image from "next/image";
import type { Metadata } from "next";
import { getGalleryAssets } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: locale === "bg" ? "Галерия" : "Gallery",
    description:
      locale === "bg"
        ? "Екстериорни и интериорни визии от сградата и жилищата."
        : "Exterior and interior visuals from the building and homes.",
  };
}

export default async function GalleryPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const galleryAssets = getGalleryAssets(locale);

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image src={galleryAssets[0].image} alt={galleryAssets[0].title} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <span className="eyebrow-chip">{messages.gallery.heroEyebrow}</span>
            <h1 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.6rem] lg:text-[6rem]">{messages.gallery.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{messages.gallery.heroCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3">
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">{galleryAssets.length}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.gallery.assets}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">{locale === "bg" ? "Подбор" : "Curated"}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.gallery.cms}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 sm:px-8">
              <p className="font-serif text-5xl leading-none text-[color:var(--ink)]">Calm</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.gallery.calm}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={messages.gallery.visualLibraryEyebrow} title={messages.gallery.visualLibraryTitle} copy={messages.gallery.visualLibraryCopy} />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryAssets.map((asset, index) => (
              <article key={asset.id} className={index === 0 ? "sm:col-span-2" : ""}>
                <div className={`page-image-block ${index === 0 ? "min-h-[24rem]" : "min-h-[20rem]"}`}>
                  <Image src={asset.image} alt={asset.title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="page-simple-card">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{asset.categoryLabel}</p>
                  <h2 className="mt-4 font-serif text-3xl text-[color:var(--ink)]">{asset.title}</h2>
                  <p className="mt-4 text-[color:var(--muted)]">{asset.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
