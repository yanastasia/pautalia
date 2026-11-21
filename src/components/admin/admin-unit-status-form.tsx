"use client";

import { useActionState } from "react";
import { adminUnitStatuses, type AdminUnitStatus } from "@/lib/admin-unit-status";
import { saveAdminUnitStatus } from "@/lib/admin-unit-status-action";
import type { Locale } from "@/lib/i18n/config";
import { getMessages, getStatusLabel } from "@/lib/i18n/messages";
import type { UnitStatus } from "@/types/domain";

type Props = { id: string; status: string; locale: Locale; className: string };

export function AdminUnitStatusForm({ id, status, locale, className }: Props) {
  const [state, action, pending] = useActionState(saveAdminUnitStatus, { result: "idle" });
  const messages = getMessages(locale);
  const savedStatus = state.status ?? status;

  return (
    <form action={action} className={className}>
      <input type="hidden" name="id" value={id} />
      <label className="grid gap-2">
        <span className="premium-label text-[color:var(--muted)]">{messages.admin.editStatus}</span>
        <select key={savedStatus} name="status" defaultValue={savedStatus} disabled={pending} className="min-h-12 rounded-2xl border border-[color:var(--line)] bg-white px-4 text-[color:var(--ink)]">
          {!adminUnitStatuses.includes(savedStatus as AdminUnitStatus) ? (
            <option value={savedStatus}>{getStatusLabel(locale, savedStatus as UnitStatus)}</option>
          ) : null}
          {adminUnitStatuses.map((value) => (
            <option key={value} value={value}>{getStatusLabel(locale, value)}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={pending} className="min-h-12 rounded-full bg-[color:var(--ink)] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-60">
        {pending ? (locale === "bg" ? "Запазване…" : "Saving…") : messages.admin.updateStatus}
      </button>
      {state.result === "saved" ? (
        <p role="status" className="basis-full text-sm text-[color:var(--muted)]">{locale === "bg" ? "Статусът е запазен." : "Status saved."}</p>
      ) : null}
      {state.result === "error" ? (
        <p role="alert" className="basis-full text-sm text-red-700">{locale === "bg" ? "Статусът не е запазен. Опитайте отново." : "Status could not be saved. Please try again."}</p>
      ) : null}
    </form>
  );
}
