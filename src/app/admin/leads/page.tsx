import Link from "next/link";
import type { Metadata } from "next";
import { getAdminBuildings, getAdminLeads, leadStatuses, type AdminLeadStatus } from "@/lib/admin-data";
import { formatAdminDate, formatLeadStatus } from "@/lib/admin-format";
import { requireAdminPageSession } from "@/lib/admin-page";
import { getBuildingLabel, getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CRM",
  robots: { index: false, follow: false },
};

function normalizeStatus(value?: string): AdminLeadStatus | undefined {
  return leadStatuses.find((status) => status === value);
}

function buildLeadsHref(status?: string, buildingId?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (buildingId) params.set("buildingId", buildingId);
  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

function buildLeadExportHref(status?: string, buildingId?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (buildingId) params.set("buildingId", buildingId);
  const query = params.toString();
  return query ? `/api/admin/leads/export?${query}` : "/api/admin/leads/export";
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; buildingId?: string }> }) {
  await requireAdminPageSession();

  const locale = await getLocale();
  const messages = getMessages(locale);
  const params = await searchParams;
  const selectedStatus = normalizeStatus(params.status);
  const buildings = await getAdminBuildings();
  const selectedBuildingId = buildings.some((building) => building.id === params.buildingId) ? params.buildingId : undefined;
  const leads = await getAdminLeads(selectedStatus, 50, selectedBuildingId);

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
          {messages.admin.backToDashboard}
        </Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="premium-label text-[color:var(--accent)]">{messages.admin.crm}</p>
            <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{messages.admin.allLeads}</h1>
          </div>
          <Link href={buildLeadExportHref(selectedStatus, selectedBuildingId)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
            {messages.admin.exportLeads}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={buildLeadsHref(undefined, selectedBuildingId)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
            {messages.admin.allLeads}
          </Link>
          {leadStatuses.map((status) => (
            <Link key={status} href={buildLeadsHref(status, selectedBuildingId)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
              {formatLeadStatus(status, locale)}
            </Link>
          ))}
          {buildings.map((building) => (
            <Link key={building.id} href={buildLeadsHref(selectedStatus, building.id)} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
              {getBuildingLabel(locale, building.id)}
            </Link>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] card-surface p-6">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              <tr>
                <th className="py-3 pr-4">{messages.admin.lead}</th>
                <th className="py-3 pr-4">{messages.admin.contact}</th>
                <th className="py-3 pr-4">{messages.common.building}</th>
                <th className="py-3 pr-4">{messages.admin.interest}</th>
                <th className="py-3 pr-4">{messages.admin.status}</th>
                <th className="py-3">{messages.admin.received}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(16,18,20,0.08)]">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-4 pr-4 font-semibold text-[color:var(--ink)]">
                    <Link href={`/admin/leads/${lead.id}`} className="underline-offset-4 hover:underline">{lead.fullName}</Link>
                  </td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{lead.email}{lead.phone ? ` / ${lead.phone}` : ""}</td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{lead.building ? getBuildingLabel(locale, lead.building.id) : "—"}</td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{lead.unit?.externalCode ?? lead.sourcePageUrl}</td>
                  <td className="py-4 pr-4 text-[color:var(--muted)]">{formatLeadStatus(lead.status, locale)}</td>
                  <td className="py-4 text-[color:var(--muted)]">{formatAdminDate(lead.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 ? <p className="py-8 text-[color:var(--muted)]">{messages.admin.noEnquiries}</p> : null}
        </div>
      </div>
    </section>
  );
}
