import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin-api";
import { getAdminLead, leadStatuses, revalidateAdminCrm, updateAdminLead, type AdminLeadStatus } from "@/lib/admin-data";
import { formatAdminDate, formatLeadStatus } from "@/lib/admin-format";
import { requireAdminPageSession } from "@/lib/admin-page";
import { getMessages } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lead detail",
  robots: { index: false, follow: false },
};

function parseLeadStatus(value: FormDataEntryValue | null): AdminLeadStatus {
  const status = leadStatuses.find((item) => item === value);
  if (!status) throw new Error("Invalid lead status");
  return status;
}

async function updateLeadAction(formData: FormData) {
  "use server";

  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = parseLeadStatus(formData.get("status"));
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null;

  await updateAdminLead(id, status, adminNotes);
  revalidateAdminCrm();
  revalidatePath(`/admin/leads/${id}`);
}

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageSession();

  const locale = await getLocale();
  const messages = getMessages(locale);
  const { id } = await params;
  const lead = await getAdminLead(id);
  if (!lead) notFound();

  return (
    <section className="section-space">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-[color:var(--muted)]">
          <Link href="/admin" className="underline-offset-4 hover:underline">{messages.admin.backToDashboard}</Link>
          <Link href="/admin/leads" className="underline-offset-4 hover:underline">{messages.admin.backToLeads}</Link>
        </div>

        <div className="mt-8 rounded-[var(--radius-xl)] card-surface p-6 sm:p-8">
          <p className="premium-label text-[color:var(--accent)]">{messages.admin.leadDetail}</p>
          <h1 className="mt-3 font-serif text-5xl text-[color:var(--ink)]">{lead.fullName}</h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Info label={messages.admin.contact} value={`${lead.email}${lead.phone ? ` / ${lead.phone}` : ""}`} />
            <Info label={messages.admin.interest} value={lead.unit?.externalCode ?? lead.sourcePageUrl} />
            <Info label={messages.admin.status} value={formatLeadStatus(lead.status, locale)} />
            <Info label={messages.admin.received} value={formatAdminDate(lead.createdAt, locale)} />
            <Info label={messages.common.building} value={lead.building?.name ?? "-"} />
            <Info label={messages.admin.sourcePage} value={lead.sourcePageUrl} />
          </div>

          {lead.message ? (
            <div className="mt-8 rounded-2xl bg-white/70 p-5">
              <p className="premium-label text-[color:var(--muted)]">{messages.admin.message}</p>
              <p className="mt-3 leading-7 text-[color:var(--ink)]">{lead.message}</p>
            </div>
          ) : null}

          <form action={updateLeadAction} className="mt-8 grid gap-5">
            <input type="hidden" name="id" value={lead.id} />
            <label className="grid gap-2">
              <span className="premium-label text-[color:var(--muted)]">{messages.admin.editStatus}</span>
              <select name="status" defaultValue={lead.status} className="min-h-12 rounded-2xl border border-[color:var(--line)] bg-white px-4 text-[color:var(--ink)]">
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>{formatLeadStatus(status, locale)}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="premium-label text-[color:var(--muted)]">{messages.admin.adminNotes}</span>
              <textarea name="adminNotes" defaultValue={lead.adminNotes ?? ""} rows={5} className="rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]" />
            </label>

            <button type="submit" className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {messages.admin.saveLead}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-5">
      <p className="premium-label text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-[color:var(--ink)]">{value}</p>
    </div>
  );
}
