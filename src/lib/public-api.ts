import "server-only";

import { getUserType } from "@/lib/access-control";
import { isAppError } from "@/lib/errors";
import {
  getPublicBuilding,
  getPublicUnit,
  getPublicParkingUnit,
  listPublicBuildings,
  listPublicParkingUnits,
  listPublicUnits,
} from "@/lib/pautalia-data";
import type { Locale } from "@/lib/i18n/config";
import { getPublicPost, listPublicPosts } from "@/lib/posts";
import type { PostListResponse, PublicPost } from "@/types/posts";
import type { PublicBuilding, PublicFloor, PublicParkingUnit, PublicUnit } from "@/types/public-api";

type NormalizedSearchParams = Record<string, string | string[] | undefined>;

type PaginatedUnitsResponse = {
  items: PublicUnit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class PublicApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function normalizeSearchParams(
  searchParams?: Record<string, string | number | undefined | null>,
): NormalizedSearchParams {
  const normalized: NormalizedSearchParams = {};

  if (!searchParams) {
    return normalized;
  }

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    normalized[key] = String(value);
  }

  return normalized;
}

function wrapPublicDataError(error: unknown): never {
  if (isAppError(error)) {
    throw new PublicApiError(error.message, error.status, error.code);
  }

  if (error instanceof PublicApiError) {
    throw error;
  }

  throw error;
}

export async function fetchPautaliaBuildings(locale: Locale): Promise<PublicBuilding[]> {
  try {
    const userType = await getUserType();
    return await listPublicBuildings(locale, userType);
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaBuilding(
  locale: Locale,
  slugOrId: string,
): Promise<{ item: PublicBuilding; floors: PublicFloor[] }> {
  try {
    const userType = await getUserType();
    return await getPublicBuilding(locale, slugOrId, userType);
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaUnits(
  locale: Locale,
  searchParams?: Record<string, string | number | undefined | null>,
): Promise<PaginatedUnitsResponse> {
  try {
    const userType = await getUserType();
    return await listPublicUnits(locale, normalizeSearchParams(searchParams), userType);
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchAllPautaliaUnits(
  locale: Locale,
  searchParams?: Record<string, string | number | undefined | null>,
): Promise<PublicUnit[]> {
  let page = 1;
  let totalPages = 1;
  const items: PublicUnit[] = [];

  while (page <= totalPages) {
    const response = await fetchPautaliaUnits(locale, {
      ...searchParams,
      limit: 50,
      page,
    });

    items.push(...response.items);
    totalPages = response.pagination.totalPages;
    page += 1;
  }

  return items;
}

export async function fetchPautaliaParkingUnits(locale: Locale, buildingSlugOrId?: string): Promise<PublicParkingUnit[]> {
  try {
    const userType = await getUserType();
    return await listPublicParkingUnits(locale, buildingSlugOrId ?? null, userType);
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaParkingUnit(locale: Locale, slugOrId: string): Promise<PublicParkingUnit> {
  try {
    const userType = await getUserType();
    const response = await getPublicParkingUnit(locale, slugOrId, userType);
    return response.item;
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaUnit(locale: Locale, slugOrId: string): Promise<PublicUnit> {
  try {
    const userType = await getUserType();
    const response = await getPublicUnit(locale, slugOrId, userType);
    return response.item;
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaPosts(
  locale: Locale,
  searchParams?: Record<string, string | undefined>,
): Promise<PostListResponse> {
  try {
    return await listPublicPosts(locale, searchParams ?? {});
  } catch (error) {
    wrapPublicDataError(error);
  }
}

export async function fetchPautaliaPost(locale: Locale, slug: string): Promise<PublicPost> {
  try {
    return await getPublicPost(locale, slug);
  } catch (error) {
    wrapPublicDataError(error);
  }
}
