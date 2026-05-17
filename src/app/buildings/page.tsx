import type { Metadata } from "next";
import ProjectPage from "@/app/project/page";
import { getLocale } from "@/lib/i18n/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    pathname: "/buildings",
    title: locale === "bg" ? "Сгради и прогрес на строителството" : "Buildings and construction progress",
    description:
      locale === "bg"
        ? "Разгледайте Резиденс и Парк, вижте степента на завършеност и отворете свободните жилища във всяка сграда."
        : "Review Residence and Park, their completion progress, and the available homes inside each building.",
    imagePath: "/assets/buildings/residence/gallery/exterior-front.jpg",
    imageAlt: locale === "bg" ? "Сградите на Pautalia" : "Pautalia buildings",
  });
}

export default ProjectPage;
