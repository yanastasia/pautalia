import Link from "next/link";
import type { AdminLead, AdminUnit } from "@/lib/admin-data";
import { formatAdminDate, formatLeadStatus } from "@/lib/admin-format";
import type { Locale } from "@/lib/i18n/config";
import { getBuildingLabel, getMessages, getStatusLabel } from "@/lib/i18n/messages";
import type { UnitStatus } from "@/types/domain";

type DashboardCounts = {
  leads: number;
  units: number;
  availableUnits: number;
};

function formatPrice(unit: AdminUnit, locale: Locale) {
  const messages = getMessages(locale);
  if (unit.price === null) return messages.admin.onRequest;
  return `${new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en").format(unit.price)} ${unit.currency}`;
}

export function AdminDashboard({ counts, leads, units, locale }: { counts: DashboardCounts; leads: AdminLead[]; units: AdminUnit[]; locale: Locale }) {
  const messages = getMessages(locale);
  const stats = [
    { label: messages.admin.crmLeads, value: counts.leads, href: "/admin/leads" },
    { label: messages.admin.soldUnits, value: counts.units, href: "/admin/units?kind=apartment&status=sold" },
    { label: messages.admin.availableUnits, value: counts.availableUnits, href: "/admin/units?kind=apartment&status=available" },
  ];

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="premium-label text-[color:var(--accent)]">{messages.admin.privateOperations}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[color:var(--ink)]">{messages.admin.workspaceTitle}</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="rounded-full border border-[rgba(16,18,20,0.14)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]">
            {messages.admin.signOut}
          </button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block rounded-[var(--radius-xl)] card-surface p-6 transition hover:-translate-y-1 hover:border-[color:var(--accent)]/30">
            <p className="premium-label text-[color:var(--muted)]">{stat.label}</p>
            <p className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{stat.value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="premium-label text-[color:var(--accent)]">{messages.admin.crm}</p>
            <h2 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{messages.admin.recentEnquiries}</h2>
          </div>
          <Link href="/admin/leads" className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
            {messages.admin.viewAllLeads}
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              <tr>
                <th className="py-3 pr-4">{messages.admin.lead}</th>
                <th className="py-3 pr-4">{messages.admin.contact}</th>
                <th className="py-3 pr-4">{messages.admin.interest}</th>
                <th className="py-3 pr-4">{messages.admin.status}</th>
                <th className="py-3">{messages.admin.received}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(16,18,20,0.08)]">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-4 pr-4 font-semibold text-[color:var(--ink)]">
                    <Link href={`/admin/leads/${lead.id}`} className="underline-offset-4 hover:underline">
                      {lead.fullName}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{lead.email}{lead.phone ? ` / ${lead.phone}` : ""}</td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{lead.unit?.externalCode ?? lead.sourcePageUrl}</td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{formatLeadStatus(lead.status, locale)}</td>
                  <td className="py-4 text-[color:var(--muted)]">{formatAdminDate(lead.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 ? <p className="py-8 text-[color:var(--muted)]">{messages.admin.noEnquiries}</p> : null}
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <p className="premium-label text-[color:var(--accent)]">{messages.admin.inventoryEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{messages.admin.inventoryTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
            href="/admin/units"
          >
            {messages.admin.manageInventory}
          </Link>
          <Link
            className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
            href="/api/admin/leads/export"
          >
            {messages.admin.exportLeads}
          </Link>
        </div>
        <div className="mt-6 grid gap-3">
          {units.map((unit) => (
            <div key={unit.id} className="grid gap-3 rounded-2xl bg-white/75 p-4 text-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold text-[color:var(--ink)]">
                  <Link href={`/admin/units/${unit.id}`} className="underline-offset-4 hover:underline">{unit.externalCode}</Link>
                  {" "}&middot; {unit.kind} &middot; {getBuildingLabel(locale, unit.building.id)}
                </p>
                <p className="mt-1 text-[color:var(--muted)]">
                  {unit.kind === "parking" ? messages.admin.parking : `${unit.rooms} ${messages.admin.rooms} / ${unit.areaLivingSqm} ${messages.admin.living} + ${unit.areaSharedSqm} ${messages.admin.shared} = ${unit.areaTotalSqm} ${messages.common.sqm}`} &middot; {formatPrice(unit, locale)}
                </p>
              </div>
              <p className="font-semibold text-[color:var(--ink)]">{getStatusLabel(locale, unit.status as UnitStatus)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] card-surface p-6">
        <p className="premium-label text-[color:var(--accent)]">{locale === "bg" ? "Маркетинг метрики" : "Marketing metrics"}</p>
        <h2 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">{locale === "bg" ? "Ефективност на сайта" : "Website performance"}</h2>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
          {locale === "bg"
            ? "Първични събития за посещения, интерес към апартаменти, източници и конверсии."
            : "First-party events for visits, apartment interest, sources, and conversions."}
        </p>
        <Link
          className="mt-5 inline-flex rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
          href="/admin/analytics"
        >
          {locale === "bg" ? "Виж метриките" : "View metrics"}
        </Link>
      </section>
    </div>
  );
}
