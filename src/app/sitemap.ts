import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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

  const staticRoutes = ["", "/project", "/apartments", "/gallery", "/location", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const buildingRoutes = buildings.map((building) => ({
    url: `${baseUrl}/building/${building.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const unitRoutes = units.map((unit) => ({
    url: `${baseUrl}/unit/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...buildingRoutes, ...unitRoutes];
}
