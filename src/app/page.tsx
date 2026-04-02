import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Building2, Compass, Layers3, Sparkles } from "lucide-react";
import { getHomeJournalItems, getHomeStorySections, getSiteCopy } from "@/content/site-content";
import { HomeHero } from "@/components/home/home-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicBuildings as getStaticPublicBuildings, getPublicUnits as getStaticPublicUnits } from "@/data/site";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

const featureImages = {
  a: "/assets/gallery/exterior-front.jpg",
} as const;

const statIcons = [Building2, Compass, Layers3, Sparkles] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const siteCopy = getSiteCopy(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ogImage = new URL("/assets/exterior/exterior-front.jpg", siteUrl).toString();

  return {
    title: locale === "bg" ? "Луксозни жилища в Кюстендил" : "Premium homes in Kyustendil",
    description: siteCopy.tagline,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteCopy.name,
      description: siteCopy.heroText,
      url: siteUrl,
      images: [
        {
          url: ogImage,
          width: 1600,
          height: 900,
          alt: locale === "bg" ? "Екстериор на сградата" : "Building exterior",
        },
      ],
    },
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const siteCopy = getSiteCopy(locale);
  const storySections = getHomeStorySections(locale);
  const journalItems = getHomeJournalItems(locale);
  const buildings = getStaticPublicBuildings();
  const units = getStaticPublicUnits();
  const stats = [
    {
      label: locale === "bg" ? (buildings.length === 1 ? "Сграда" : "Сгради") : buildings.length === 1 ? "Building" : "Buildings",
      value: String(buildings.length),
    },
    {
      label: locale === "bg" ? "Жилища" : "Homes",
      value: String(units.length),
    },
    {
      label: locale === "bg" ? "Етажи" : "Floors",
      value: String(buildings.reduce((sum, building) => sum + building.floorsCount, 0)),
    },
    {
      label: locale === "bg" ? "Свободни" : "Available",
      value: String(units.filter((unit) => unit.status === "available").length),
    },
  ];

  return (
    <>
      <HomeHero
        eyebrow={messages.home.eyebrow}
        title={messages.home.title}
        copy={siteCopy.heroText}
        primaryHref="/project"
        primaryLabel={messages.home.openProject}
        secondaryHref="/apartments"
        secondaryLabel={messages.home.jumpToFinder}
        locationLabel={siteCopy.locationLabel}
        imageAlt={locale === "bg" ? "Екстериор на сградата" : "Building exterior"}
      />

      <section className="home-stats-band">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Building2;

              return (
                <div key={stat.label} className="home-stat-cell motion-fade-up px-6 py-8 text-white sm:px-8" style={{ animationDelay: `${120 + index * 110}ms` }}>
                  <Icon className="size-5 text-white/56" />
                  <p className="mt-5 font-serif text-5xl leading-none sm:text-6xl">{stat.value}</p>
                  <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/52">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={messages.home.storiesEyebrow}
            title={messages.home.storiesTitle}
            copy={messages.home.storiesCopy}
            align="center"
          />

          <div className="mt-16 space-y-20 lg:space-y-24">
            {storySections.map((story, index) => (
              <div key={story.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={cn("story-image-frame motion-scale-in", index % 2 === 0 ? "lg:order-2" : "lg:order-1")} style={{ animationDelay: `${140 + index * 120}ms` }}>
                  <Image src={story.image} alt={story.imageAlt} fill className="motion-smooth-image object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
                </div>

                <div className={cn("motion-fade-up max-w-xl", index % 2 === 0 ? "lg:order-1" : "lg:order-2")} style={{ animationDelay: `${220 + index * 120}ms` }}>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--muted)]">{story.eyebrow}</p>
                  <h2 className="mt-5 font-serif text-4xl leading-[0.96] text-[color:var(--ink)] sm:text-5xl">{story.title}</h2>
                  <p className="mt-6 text-[1.02rem] leading-8 text-[color:var(--muted)]">{story.copy}</p>
                  <Link
                    href={story.href}
                    className="mt-8 inline-flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--ink)]"
                  >
                    {story.ctaLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white/44">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={messages.home.featuredEyebrow}
            title={messages.home.featuredTitle}
            copy={messages.home.featuredCopy}
            align="center"
          />

          <div className={cn("mt-14 grid gap-5", buildings.length === 1 ? "mx-auto max-w-[780px]" : "lg:grid-cols-2")}>
            {buildings.map((building, index) => (
              <Link
                key={building.id}
                href={`/building/${building.slug}`}
                className="feature-grid-card motion-scale-in block"
                style={{ animationDelay: `${140 + index * 120}ms` }}
              >
                <Image
                  src={featureImages[building.id as keyof typeof featureImages] ?? "/assets/gallery/exterior-front.jpg"}
                  alt={building.name}
                  fill
                  className="feature-grid-card-media object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-8">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/54">{building.name}</p>
                  <h3 className="mt-4 font-serif text-4xl leading-[0.94] sm:text-[2.5rem]">{building.tagline}</h3>
                  <p className="feature-grid-card-copy mt-4 max-w-md text-sm leading-7 text-white/70">{building.shortDescription}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/88">
                    {messages.common.openBuilding}
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={messages.home.journalEyebrow}
            title={messages.home.journalTitle}
            copy={messages.home.journalCopy}
            align="center"
          />

          <div className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {journalItems.map((item, index) => (
              <article key={item.id} className="journal-strip-card motion-fade-up pt-6" style={{ animationDelay: `${140 + index * 110}ms` }}>
                <Link href={item.href} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={item.image} alt={item.imageAlt} fill className="motion-smooth-image object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="mt-6">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">
                      {item.dateLabel} · {item.category}
                    </p>
                    <h3 className="mt-4 font-serif text-3xl leading-[1.02] text-[color:var(--ink)]">{item.title}</h3>
                    <p className="mt-4 text-[0.98rem] leading-8 text-[color:var(--muted)]">{item.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--ink)]">
                      {messages.common.viewDetails}
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
