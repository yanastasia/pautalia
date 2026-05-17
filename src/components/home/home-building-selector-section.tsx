import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuildingPreviewCard } from "@/components/home/building-preview-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { HomeSelectorModel } from "@/lib/homepage";
import { cn } from "@/lib/utils";

type HomeBuildingSelectorSectionProps = {
  locale: Locale;
  selector: HomeSelectorModel;
};

export function HomeBuildingSelectorSection({
  locale,
  selector,
}: HomeBuildingSelectorSectionProps) {
  const messages = getMessages(locale);
  const hasHighlightedUnits = selector.highlightedUnits.length > 0;

  return (
    <section className="selector-shell section-space">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.selectorEyebrow}
          title={messages.home.selectorTitle}
          copy={messages.home.selectorCopy}
          align="center"
        />

        <div className="mt-14 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className={cn("grid gap-5", selector.buildingCards.length > 1 ? "lg:grid-cols-2" : "")}>
            {selector.buildingCards.map((card) => (
              <BuildingPreviewCard
                key={card.id}
                building={card.building}
                locale={locale}
              />
            ))}
          </div>

          <aside className="selector-panel flex h-full flex-col border border-[color:var(--line)] bg-white p-6 text-[color:var(--ink)] sm:p-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
              {messages.home.selectorPanelEyebrow}
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-[0.98] text-[color:var(--ink)]">
              {messages.home.selectorPanelTitle}
            </h3>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-8 text-[color:var(--muted)]">
              {messages.home.selectorPanelCopy}
            </p>

            <div className="mt-8 space-y-3">
              {hasHighlightedUnits ? (
                selector.highlightedUnits.map((unit) => (
                  <Link key={unit.id} href={unit.href} className="selector-unit-link block">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">
                          {unit.buildingName}
                        </p>
                        <h4 className="mt-3 font-serif text-2xl leading-none text-[color:var(--ink)]">{unit.code}</h4>
                      </div>
                      <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {unit.statusLabel}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      <span>{unit.residenceLabel}</span>
                      <span>{unit.floorLabel}</span>
                      <span>{unit.areaLabel}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-6 text-[0.98rem] leading-8 text-[color:var(--muted)]">
                  {messages.home.selectorEmpty}
                </div>
              )}
            </div>

            <Link href="/apartments" className="premium-button mt-6 w-full justify-center text-sm font-semibold">
              {messages.common.openApartmentFinder}
              <ArrowRight className="size-4" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
