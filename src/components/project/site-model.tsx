"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import type { PublicBuilding } from "@/types/public-api";

export function SiteModel({ buildings }: { buildings: PublicBuilding[] }) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const [CanvasComponent, setCanvasComponent] = useState<ComponentType<{ buildings: PublicBuilding[] }> | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("@/components/project/site-model-canvas").then((module) => {
      if (!cancelled) {
        setCanvasComponent(() => module.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CanvasComponent) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-[var(--radius-xl)] border border-[color:var(--line)] bg-[color:var(--surface)] text-sm text-[color:var(--muted)]">
        {messages.project.loadingModel}
      </div>
    );
  }

  return <CanvasComponent buildings={buildings} />;
}
