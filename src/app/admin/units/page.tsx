import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-api";
import { adminUnitStatuses, getAdminBuildings, getAdminUnits, revalidateAdminCrm, updateAdminUnitStatus, type AdminUnitStatus } from "@/lib/admin-data";
import { requireAdminPageSession } from "@/lib/admin-page";
import { type Locale } from "@/lib/i18n/config";
import { getBuildingLabel, getMessages, getStatusLabel } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import type { UnitStatus } from "@/types/domain";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unit inventory",
  robots: { index: false, follow: false },
};

function parseUnitStatus(value: FormDataEntryValue | null): AdminUnitStatus {
  const status = adminUnitStatuses.find((item) => item === value);
  if (!status) throw new Error("Invalid unit status");
  return status;
}

function parseUnitKind(value: string | undefined) {
  return value === "apartment" || value === "parking" ? value : undefined;
}

async function updateUnitStatusAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = parseUnitStatus(formData.get("status"));

  await updateAdminUnitStatus(id, status);
  revalidateAdminCrm();
}

function formatUnitSummary(unit: Awaited<ReturnType<typeof getAdminUnits>>[number], locale: Locale) {
  const messages = getMessages(locale);
  if (unit.kind === "parking") return messages.admin.parking;
  return `${unit.rooms} ${messages.admin.rooms} / ${unit.areaLivingSqm} ${messages.admin.living} + ${unit.areaSharedSqm} ${messages.admin.shared} = ${unit.areaTotalSqm} ${messages.common.sqm}`;
}

function buildUnitsHref(filters: { kind?: string; status?: string; buildingId?: string }) {
  const params = new URLSearchParams();
  if (filters.kind) params.set("kind", filters.kind);
  if (filters.status) params.set("status", filters.status);
  if (filters.buildingId) params.set("buildingId", filters.buildingId);
  const query = params.toString();
  return query ? `/admin/units?${query}` : "/admin/units";
}

export default async function AdminUnitsPage({ searchParams }: { searchParams: Promise<{ status?: string; kind?: string; buildingId?: string }> }) {
  await requireAdminPageSession();

  const locale = await getLocale();
  const messages = getMessages(locale);
  const params = await searchParams;
  const requestedKind = parseUnitKind(params.kind);
  const requestedStatus = adminUnitStatuses.find((status) => status === params.status);
  const buildings = await getAdminBuildings();
  const requestedBuildingId = buildings.some((building) => building.id === params.buildingId) ? params.buildingId : undefined;
  const allUnits = await getAdminUnits();
  const units = allUnits.filter((unit) => {
    if (requestedKind && unit.kind !== requestedKind) return false;
    if (requestedBuildingId && unit.building.id !== requestedBuildingId) return false;
    return !(requestedStatus && unit.status !== requestedStatus);
  });
  const inventorySummary = messages.admin.showingInventory
    .replace("{count}", String(units.length))
    .replace("{total}", String(allUnits.length));

  return (
    <section className="section-space">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
          {messages.admin.backToDashboard}
        </Link>

        <div className="mt-8">
          <p className="premium-label text-[color:var(--accent)]">{messages.admin.inventoryEyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{messages.admin.unitInventory}</h1>
          <p className="mt-3 text-[color:var(--muted)]">{inventorySummary}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={buildUnitsHref({})} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
            {messages.admin.allInventory}
          </Link>
          <Link href={buildUnitsHref({ kind: "apartment", buildingId: requestedBuildingId, status: requestedStatus })} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
            {messages.admin.apartments}
          </Link>
          <Link href={buildUnitsHref({ kind: "parking", buildingId: requestedBuildingId, status: requestedStatus })} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
            {messages.admin.parkingSpaces}
          </Link>
          {adminUnitStatuses.map((status) => (
            <Link key={status} href={buildUnitsHref({ kind: requestedKind, buildingId: requestedBuildingId, status })} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
              {getStatusLabel(locale, status)}
            </Link>
          ))}
          {buildings.map((building) => (
            <Link key={building.id} href={buildUnitsHref({ kind: requestedKind, status: requestedStatus, buildingId: building.id })} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-sm text-[color:var(--ink)]">
              {getBuildingLabel(locale, building.id)}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="rounded-[var(--radius-xl)] card-surface p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="premium-label text-[color:var(--muted)]">{unit.kind === "parking" ? messages.admin.parking : messages.common.building}</p>
                  <h2 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">
                    <Link href={`/admin/units/${unit.id}`} className="underline-offset-4 hover:underline">
                      {unit.externalCode}
                    </Link>
                  </h2>
                  <p className="mt-2 text-[color:var(--muted)]">{getBuildingLabel(locale, unit.building.id)} / {formatUnitSummary(unit, locale)}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{messages.admin.connectedLeads}: {unit._count?.leads ?? 0}</p>
                </div>

                <form action={updateUnitStatusAction} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={unit.id} />
                  <label className="grid gap-2">
                    <span className="premium-label text-[color:var(--muted)]">{messages.admin.editStatus}</span>
                    <select name="status" defaultValue={unit.status} className="min-h-12 rounded-2xl border border-[color:var(--line)] bg-white px-4 text-[color:var(--ink)]">
                      {!adminUnitStatuses.includes(unit.status as AdminUnitStatus) ? (
                        <option value={unit.status}>{getStatusLabel(locale, unit.status as UnitStatus)}</option>
                      ) : null}
                      {adminUnitStatuses.map((status) => (
                        <option key={status} value={status}>{getStatusLabel(locale, status)}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="min-h-12 rounded-full bg-[color:var(--ink)] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {messages.admin.updateStatus}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
