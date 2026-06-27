import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-api";
import { getUnitAnalytics } from "@/lib/admin-analytics";
import { adminUnitStatuses, getAdminUnit, revalidateAdminCrm, updateAdminUnitPrice, updateAdminUnitStatus, type AdminUnitStatus } from "@/lib/admin-data";
import { requireAdminPageSession } from "@/lib/admin-page";
import { getBuildingLabel, getMessages, getStatusLabel } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";
import type { UnitStatus } from "@/types/domain";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unit detail",
  robots: { index: false, follow: false },
};

function parseUnitStatus(value: FormDataEntryValue | null): AdminUnitStatus {
  const status = adminUnitStatuses.find((item) => item === value);
  if (!status) throw new Error("Invalid unit status");
  return status;
}

async function updateUnitStatusAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = parseUnitStatus(formData.get("status"));

  await updateAdminUnitStatus(id, status);
  revalidateAdminCrm();
}

function parseUnitPrice(value: FormDataEntryValue | null) {
  if (value === null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = raw.replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error("Invalid unit price");
  return parsed;
}

async function updateUnitPriceAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const price = parseUnitPrice(formData.get("price"));

  await updateAdminUnitPrice(id, price);
  revalidateAdminCrm();
}

export default async function AdminUnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageSession();
  const locale = await getLocale();
  const messages = getMessages(locale);
  const { id } = await params;
  const unit = await getAdminUnit(id);
  if (!unit) notFound();

  const metrics = await getUnitAnalytics(unit.id);
  const cmsBase = process.env.PAYLOAD_PUBLIC_SERVER_URL;
  const cmsHref = cmsBase ? `${cmsBase.replace(/\/$/, "")}/admin/collections/units/${unit.id}` : null;
  const stats = [
    [locale === "bg" ? "Прегледи" : "Views", metrics.views],
    [locale === "bg" ? "Кликове" : "Clicks", metrics.clicks],
    [locale === "bg" ? "Галерия" : "Gallery", metrics.gallery],
    [locale === "bg" ? "План" : "Plan", metrics.floorPlan],
    [locale === "bg" ? "Запитвания" : "Leads", metrics.leads],
    [locale === "bg" ? "Конверсия" : "Conversion", `${metrics.conversionRate}%`],
  ];

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/units" className="text-sm font-semibold text-[color:var(--muted)] underline-offset-4 hover:underline">
          {messages.admin.backToDashboard}
        </Link>

        <div className="mt-8 rounded-[var(--radius-xl)] card-surface p-6">
          <p className="premium-label text-[color:var(--accent)]">{messages.admin.inventoryEyebrow}</p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-5xl text-[color:var(--ink)]">{unit.externalCode}</h1>
              <p className="mt-3 text-[color:var(--muted)]">
                {unit.kind} / {getBuildingLabel(locale, unit.building.id)} / {getStatusLabel(locale, unit.status as UnitStatus)}
              </p>
            </div>
            {cmsHref ? (
              <Link href={cmsHref} className="rounded-full border border-[rgba(16,18,20,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
                {locale === "bg" ? "Редакция в CMS" : "Edit in CMS"}
              </Link>
            ) : null}
          </div>

          <form action={updateUnitStatusAction} className="mt-6 flex flex-wrap items-end gap-3">
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

          <form action={updateUnitPriceAction} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={unit.id} />
            <label className="grid gap-2">
              <span className="premium-label text-[color:var(--muted)]">
                {locale === "bg" ? `Цена (${unit.currency})` : `Price (${unit.currency})`}
              </span>
              <input
                name="price"
                inputMode="decimal"
                defaultValue={unit.price ?? ""}
                placeholder={locale === "bg" ? "Празно = при запитване" : "Empty = on request"}
                className="min-h-12 w-[18rem] max-w-full rounded-2xl border border-[color:var(--line)] bg-white px-4 text-[color:var(--ink)]"
              />
            </label>
            <button type="submit" className="min-h-12 rounded-full bg-[color:var(--ink)] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {locale === "bg" ? "Запази цена" : "Save price"}
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-[var(--radius-xl)] card-surface p-5">
              <p className="premium-label text-[color:var(--muted)]">{label}</p>
              <p className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
