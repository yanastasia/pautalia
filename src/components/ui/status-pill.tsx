"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getStatusLabel } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import type { UnitStatus } from "@/types/domain";

const styles: Record<UnitStatus, string> = {
  available: "border border-emerald-400/28 bg-emerald-400/14 text-emerald-100",
  reserved: "border border-amber-300/30 bg-amber-300/16 text-amber-50",
  sold: "border border-slate-200/20 bg-slate-100/16 text-slate-100",
  hidden: "border border-rose-300/28 bg-rose-300/16 text-rose-50",
};

export function StatusPill({ status }: { status: UnitStatus }) {
  const locale = useLocale();

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] backdrop-blur", styles[status])}>
      {getStatusLabel(locale, status)}
    </span>
  );
}
