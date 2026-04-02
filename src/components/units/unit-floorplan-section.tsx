import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";

type UnitFloorplanSectionProps = {
  eyebrow: string;
  title: string;
  copy: string;
  features: string[];
  unitCode: string;
  unitFloorplan: string;
  floorLabel: string;
  floorPlanImage: string;
  locale: "bg" | "en";
};

export function UnitFloorplanSection({
  eyebrow,
  title,
  copy,
  features,
  unitCode,
  unitFloorplan,
  floorLabel,
  floorPlanImage,
  locale,
}: UnitFloorplanSectionProps) {
  const unitPlanLabel = locale === "bg" ? `План на апартамент ${unitCode}` : `Apartment ${unitCode} plan`;
  const floorPlanLabel = locale === "bg" ? `${floorLabel} план` : `${floorLabel} plan`;

  return (
    <section className="section-space">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div>
          <SectionHeading eyebrow={eyebrow} title={title} copy={copy} />
          <div className="page-line-list mt-10">
            {features.map((feature) => (
              <div key={feature} className="page-line-item text-lg text-[color:var(--ink)]">
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[1.8rem] bg-[color:var(--surface-dark)] p-4 sm:p-6">
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {unitPlanLabel}
            </p>
            <div className="page-image-block min-h-[20rem] bg-[color:var(--surface-dark)]">
              <Image
                src={unitFloorplan}
                alt={`Floorplan for unit ${unitCode}`}
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-[color:var(--surface-dark)] p-4 sm:p-6">
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {floorPlanLabel}
            </p>
            <div className="page-image-block min-h-[20rem] bg-[color:var(--surface-dark)]">
              <Image
                src={floorPlanImage}
                alt={`Floorplan for ${floorLabel}`}
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
