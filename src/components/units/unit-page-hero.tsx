import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import type { UnitStatus } from "@/types/domain";

type UnitPageHeroProps = {
  buildingId: string;
  buildingSlug: string;
  buildingLabel: string;
  backToBuildingLabel: string;
  highlight: string;
  image: string;
  status: UnitStatus;
  unitCode: string;
};

export function UnitPageHero({
  buildingId,
  buildingSlug,
  buildingLabel,
  backToBuildingLabel,
  highlight,
  image,
  status,
  unitCode,
}: UnitPageHeroProps) {
  return (
    <section className="page-cover">
      <div className="page-cover-media">
        <Image src={image} alt={`Unit ${unitCode}`} fill className="object-cover" sizes="100vw" />
      </div>
      <div className="page-cover-inner">
        <div className="page-cover-copy">
          <Link href={`/building/${buildingSlug}`} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/68">
            <ArrowLeft className="size-4" />
            {backToBuildingLabel} {buildingId.toUpperCase()}
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <StatusPill status={status} />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/62">{buildingLabel}</span>
          </div>
          <h1 className="mt-7 font-serif text-[2rem] leading-[0.98] text-white sm:text-[2.6rem] lg:text-[3.35rem] xl:text-[3.7rem]">Unit {unitCode}</h1>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-white/74">{highlight}</p>
        </div>
      </div>
    </section>
  );
}
