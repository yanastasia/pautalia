import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Landmark, Layers3 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { fetchAllPautaliaUnits, fetchPautaliaBuildings } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

const buildingVisuals = {
  a: {
    src: "/assets/gallery/exterior-front.jpg",
    position: "object-[28%_center]",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/project",
    title: locale === "bg" ? "Сграда и прогрес на строителството" : "Building and construction progress",
    description:
      locale === "bg"
        ? "Разгледайте сградата в строеж, вижте степента на завършеност и отворете свободните жилища в нея."
        : "Review the building under construction, its completion progress, and the available homes inside it.",
    imagePath: "/assets/gallery/exterior-front.jpg",
    imageAlt: locale === "bg" ? "Сграда Pautalia в строеж" : "Pautalia building under construction",
  });
}

export default async function ProjectPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const [buildings, units] = await Promise.all([
    fetchPautaliaBuildings(locale),
    fetchAllPautaliaUnits(locale),
  ]);
  const projectStats = [
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
      label: locale === "bg" ? "Свободни жилища" : "Available homes",
      value: String(units.filter((unit) => unit.status === "available").length),
    },
  ];

  return (
    <>
      <section className="section-space pb-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={messages.project.eyebrow} title={messages.project.title} copy={messages.project.copy} />

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[color:var(--line)] pt-5 sm:mt-10 sm:gap-4 sm:pt-6 xl:grid-cols-4">
            {projectStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.35rem] border border-[color:var(--line)] bg-white/76 px-4 py-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                <p className="font-serif text-[2rem] leading-none text-[color:var(--ink)] sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--muted)] sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={messages.project.buildingsEyebrow}
            title={messages.project.buildingsTitle}
            copy={messages.project.buildingsCopy}
            align="center"
          />

          <div className={cn("mt-14 grid gap-6", buildings.length === 1 ? "mx-auto max-w-[820px]" : "lg:grid-cols-2")}>
            {buildings.map((building, index) => {
              const visual = buildingVisuals[building.id as keyof typeof buildingVisuals] ?? buildingVisuals.a;

              return (
                <div key={building.id} className="motion-scale-in" style={{ animationDelay: `${140 + index * 120}ms` }}>
                  <Link
                    href={`/building/${building.slug}`}
                    className="group overflow-hidden border border-[color:var(--line)] bg-[color:var(--surface-strong)] shadow-[0_24px_60px_rgba(12,13,15,0.1)] md:hidden"
                  >
                    <div className="relative min-h-[15.5rem] overflow-hidden">
                      <Image
                        src={visual.src}
                        alt={building.name}
                        fill
                        className={cn("object-cover transition duration-700 group-hover:scale-105", visual.position)}
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08111a]/70 via-[#08111a]/14 to-transparent" />
                      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70">{building.name}</p>
                        <span className="rounded-full border border-white/14 bg-black/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/82">
                          {building.deliveryQuarter}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[color:var(--line)] px-5 py-5">
                      <h2 className="font-serif text-[2rem] leading-[0.96] text-[color:var(--ink)]">{building.name}</h2>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{building.shortDescription}</p>

                      <div className="mt-5">
                        <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          <span>{messages.project.progressLabel}</span>
                          <span>{building.completionPercent}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgba(178,147,102,0.16)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#b29366,#856640)]"
                            style={{ width: `${building.completionPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        <span>{building.availableUnits} {messages.project.availableLabel}</span>
                        <span>{building.floorsCount} {messages.common.floors.toLowerCase()}</span>
                      </div>

                      <div className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-full border border-[color:var(--line-strong)] bg-white px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]">
                        {messages.common.openBuilding}
                        <ArrowUpRight className="size-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href={`/building/${building.slug}`} className="building-progress-card group hidden md:block">
                    <Image
                      src={visual.src}
                      alt={building.name}
                      fill
                      className={cn("building-progress-media object-cover", visual.position)}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,12,0.12),rgba(10,11,12,0.26)_38%,rgba(10,11,12,0.82)_100%)]" />

                    <div className="absolute inset-0 z-10 flex flex-col p-6 text-white sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/54">
                            {building.name}
                          </p>
                          <p className="mt-2 max-w-sm text-sm leading-7 text-white/70">{building.shortDescription}</p>
                        </div>
                        <span className="rounded-full border border-white/14 bg-black/18 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/80">
                          {building.deliveryQuarter}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <h2 className="max-w-md font-serif text-5xl leading-[0.95] text-white sm:text-6xl">{building.name}</h2>
                        <p className="mt-4 max-w-lg text-base leading-8 text-white/76">{building.tagline}</p>

                        <div className="mt-8 grid gap-6 border-t border-white/12 pt-6">
                          <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/68">
                              {messages.project.progressLabel}
                            </span>
                            <div className="completion-pill">
                              <div className="completion-pill-fill" style={{ width: `${building.completionPercent}%` }} />
                              <span className="completion-pill-value">{building.completionPercent}%</span>
                            </div>
                            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/80">
                              {building.availableUnits} {messages.project.availableLabel}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/68">
                            <span className="inline-flex items-center gap-2">
                              <Layers3 className="size-4 text-white/82" />
                              {building.floorsCount} {messages.common.floors.toLowerCase()}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Landmark className="size-4 text-white/82" />
                              {building.availableUnits} {messages.common.available}
                            </span>
                            <span className="inline-flex items-center gap-2 text-white/92">
                              {messages.common.openBuilding}
                              <ArrowUpRight className="size-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
