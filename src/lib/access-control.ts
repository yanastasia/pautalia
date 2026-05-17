import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";

export type UserType = "internal" | "external";

/**
 * Determines the current user type based on the presence of an admin session cookie.
 * This is used for labeling and access control across the application.
 */
export async function getUserType(): Promise<UserType> {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminSessionCookieName);
  
  return session ? "internal" : "external";
}

/**
 * Access control configuration for building labeling.
 * External users see marketing names (Residence, Park).
 * Internal users see structural names (Building A, Building B).
 */
export const BUILDING_ACCESS_CONFIG = {
  a: {
    external: { label: "Residence", slug: "residence" },
    internal: { label: "Building A", slug: "building-a" },
  },
  b: {
    external: { label: "Park", slug: "park" },
    internal: { label: "Building B", slug: "building-b" },
  },
} as const;

/**
 * Resolves the building label based on the building ID and user type.
 */
export function resolveBuildingLabel(buildingId: string, userType: UserType, locale: "bg" | "en" = "en"): string {
  const id = buildingId.toLowerCase() as "a" | "b";
  const config = BUILDING_ACCESS_CONFIG[id];
  
  if (!config) {
    return buildingId.toUpperCase();
  }

  // Handle Bulgarian translations for internal names if needed
  if (locale === "bg") {
    if (userType === "internal") {
      return id === "a" ? "Сграда А" : "Сграда Б";
    }
    return id === "a" ? "Резиденс" : "Парк";
  }

  return config[userType].label;
}

/**
 * Resolves the building slug based on the building ID and user type.
 */
export function resolveBuildingSlug(buildingId: string, userType: UserType): string {
  const id = buildingId.toLowerCase() as "a" | "b";
  const config = BUILDING_ACCESS_CONFIG[id];
  
  return config ? config[userType].slug : buildingId.toLowerCase();
}
