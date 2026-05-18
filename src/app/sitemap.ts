import type { MetadataRoute } from "next";
import { buildings as staticBuildings, units as staticUnits } from "@/data/site";
import { getPublishedPostSitemapSlugs } from "@/lib/posts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { buildings, units } = await getSitemapInventory();

  const staticRoutes = ["", "/buildings", "/units", "/gallery", "/location", "/contact", "/news", "/privacy", "/cookies", "/terms"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const buildingRoutes = buildings.map((building) => ({
    url: `${baseUrl}/buildings/${building.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const unitRoutes = units.map((unit) => ({
    url: `${baseUrl}/units/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const postRoutes = (await getPublishedPostSitemapSlugs()).map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...buildingRoutes, ...unitRoutes, ...postRoutes];
}

async function getSitemapInventory() {
  try {
    const [buildings, units] = await Promise.all([
      prisma.building.findMany({
        where: {
          status: "published",
        },
        select: {
          slug: true,
        },
      }),
      prisma.unit.findMany({
        where: {
          isPublished: true,
          status: {
            not: "hidden",
          },
        },
        select: {
          slug: true,
        },
      }),
    ]);

    return { buildings, units };
  } catch {
    return {
      buildings: staticBuildings
        .filter((building) => building.status === "published")
        .map((building) => ({ slug: building.slug })),
      units: staticUnits
        .filter((unit) => unit.isPublished && unit.status !== "hidden")
        .map((unit) => ({ slug: unit.slug })),
    };
  }
}
