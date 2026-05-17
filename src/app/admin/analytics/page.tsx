import Link from "next/link";
import type { Metadata } from "next";
import { getAdminBuildings } from "@/lib/admin-data";
import { requireAdminPageSession } from "@/lib/admin-page";
import {
  analyticsRangeSchema,
  getAnalyticsOverview,
  getDeviceBreakdown,
  getFunnel,
  getLocationBreakdown,
  getTopUnits,
  getTrafficSources,
} from "@/lib/admin-analytics";
import { getLocale } from "@/lib/i18n/server";
import { getBuildingLabel } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing metrics",
  robots: { index: false, follow: false },
};

const rangeOptions = ["all", "7d", "30d", "90d"] as const;

function copy(locale: "bg" | "en") {
  return locale === "bg"
    ? {
        back: "Назад към панела",
        eyebrow: "Маркетинг метрики",
        title: "Маркетинг ефективност",
        subtitle: "Първични събития, интерес към апартаменти, запитвания и конверсии.",
        all: "Всичко",
        pageViews: "Преглеждания",
        visitors: "Посетители с аналитика",
        sessions: "Сесии",
        leads: "Запитвания",
        conversion: "Конверсия",
        topUnits: "Най-интересни имоти",
        sources: "Източници",
        funnel: "Фуния",
        devices: "Устройства",
        locations: "Градове",
        views: "детайл",
        clicks: "кликове",
      }
    : {
        back: "Back to dashboard",
        eyebrow: "Marketing metrics",
        title: "Marketing performance",
        subtitle: "First-party events, apartment interest, enquiries, and conversion.",
        all: "All time",
        pageViews: "Page views",
        visitors: "Consented visitors",
        sessions: "Sessions",
        leads: "Leads",
        conversion: "Conversion",
        topUnits: "Top interested units",
        sources: "Sources",
        funnel: "Funnel",
        devices: "Devices",
        locations: "Cities",
        views: "views",
        clicks: "clicks",
      };
}

function buildAnalyticsHref(range: string, buildingId?: string) {
  const params = new URLSearchParams({ range });
  if (buildingId) params.set("buildingId", buildingId);
  return `/admin/analytics?${params.toString()}`;
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string; buildingId?: string }> }) {
  await requireAdminPageSession();
  const locale = await getLocale();
  const t = copy(locale);
  const rawParams = await searchParams;
  const buildings = await getAdminBuildings();
  const filters = analyticsRangeSchema.parse({
    ...rawParams,
    buildingId: buildings.some((building) => building.id === rawParams.buildingId) ? rawParams.buildingId : undefined,
  });
  const [overview, topUnits, sources, funnel, devices, locations] = await Promise.all([
    getAnalyticsOverview(filters),
    getTopUnits(filters),
    getTrafficSources(filters),
    getFunnel(filters),
    getDeviceBreakdown(filters),
    getLocationBreakdown(filters),
  ]);
  const stats = [
    [t.pageViews, overview.pageViews],
    [t.visitors, overview.visitors],
    [t.sessions, overview.sessions],
    [t.leads, overview.leads],
    [t.conversion, `${overview.conversionRate}%`],
  ];

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">{t.back}</Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="premium-label text-[color:var(--accent)]">{t.eyebrow}</p>
            <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{t.title}</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((range) => (
              <Link key={range} href={buildAnalyticsHref(range, filters.buildingId)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
                {range === "all" ? t.all : range}
              </Link>
            ))}
            {buildings.map((building) => (
              <Link key={building.id} href={buildAnalyticsHref(filters.range, building.id)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
                {getBuildingLabel(locale, building.id)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-[var(--radius-xl)] card-surface p-5">
              <p className="premium-label text-[color:var(--muted)]">{label}</p>
              <p className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{t.topUnits}</h2>
            <div className="mt-5 space-y-3">
              {topUnits.map((unit) => (
                <div key={unit.unitId} className="flex items-center justify-between gap-4 border-t border-[color:var(--line)] pt-3 text-sm">
                  <span className="font-semibold text-[color:var(--ink)]">{unit.code}</span>
                  <span className="text-[color:var(--muted)]">{unit.views} {t.views} / {unit.clicks} {t.clicks} / {unit.leads} leads</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{t.sources}</h2>
            <div className="mt-5 space-y-3">
              {sources.map((source) => (
                <div key={`${source.source}-${source.medium}`} className="flex justify-between border-t border-[color:var(--line)] pt-3 text-sm">
                  <span className="font-semibold text-[color:var(--ink)]">{source.source} / {source.medium}</span>
                  <span className="text-[color:var(--muted)]">{source.events}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{t.funnel}</h2>
            <div className="mt-5 space-y-3">
              {funnel.map((step) => (
                <div key={step.step} className="flex justify-between border-t border-[color:var(--line)] pt-3 text-sm">
                  <span className="font-semibold text-[color:var(--ink)]">{step.step}</span>
                  <span className="text-[color:var(--muted)]">{step.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{t.devices}</h2>
            <div className="mt-5 space-y-3">
              {devices.map((device) => (
                <div key={device.device} className="flex justify-between border-t border-[color:var(--line)] pt-3 text-sm">
                  <span className="font-semibold capitalize text-[color:var(--ink)]">{device.device}</span>
                  <span className="text-[color:var(--muted)]">{device.events}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] card-surface p-6">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">{t.locations}</h2>
            <div className="mt-5 space-y-3">
              {locations.map((location) => (
                <div key={`${location.country}-${location.region}-${location.city}`} className="flex justify-between border-t border-[color:var(--line)] pt-3 text-sm">
                  <span className="font-semibold text-[color:var(--ink)]">{location.city}, {location.country}</span>
                  <span className="text-[color:var(--muted)]">{location.events}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
