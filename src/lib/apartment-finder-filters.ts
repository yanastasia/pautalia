import type { PublicUnit } from "@/types/public-api";

export type FinderFilters = {
  building: string;
  rooms: string;
  floor: string;
  minPrice: string;
  maxPrice: string;
  orientation: string;
  status: string;
};

type FinderFilterKey = keyof FinderFilters;
type SearchParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

const emptyFilters: FinderFilters = {
  building: "",
  rooms: "",
  floor: "",
  minPrice: "",
  maxPrice: "",
  orientation: "",
  status: "",
};

const filterParamAliases: Record<string, FinderFilterKey> = {
  building: "building",
  rooms: "rooms",
  floor: "floor",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  price_min: "minPrice",
  price_max: "maxPrice",
  orientation: "orientation",
  status: "status",
  availability: "status",
};

function sourceEntries(source: SearchParamSource) {
  if (source instanceof URLSearchParams) {
    return Array.from(source.entries());
  }

  return Object.entries(source).flatMap(([key, value]) => {
    const firstValue = Array.isArray(value) ? value[0] : value;
    return firstValue === undefined ? [] : [[key, firstValue] as const];
  });
}

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function canonicalizeApartmentFinderParams(source: SearchParamSource) {
  const normalized: Partial<Record<FinderFilterKey, string>> = {};

  for (const [key, rawValue] of sourceEntries(source)) {
    const canonicalKey = filterParamAliases[key];
    const value = rawValue.trim();

    if (!canonicalKey || !value) {
      continue;
    }

    normalized[canonicalKey] = value;
  }

  return normalized;
}

export function getApartmentFinderFilters(source: SearchParamSource): FinderFilters {
  return {
    ...emptyFilters,
    ...canonicalizeApartmentFinderParams(source),
  };
}

export function createApartmentFinderSearchParams(
  currentParams: URLSearchParams,
  key: FinderFilterKey,
  value: string,
) {
  const normalized = canonicalizeApartmentFinderParams(currentParams);
  const trimmedValue = value.trim();

  if (trimmedValue) {
    normalized[key] = trimmedValue;
  } else {
    delete normalized[key];
  }

  const nextParams = new URLSearchParams();
  Object.entries(normalized).forEach(([paramKey, paramValue]) => {
    nextParams.set(paramKey, paramValue);
  });

  return nextParams.toString();
}

export function filterUnitsForApartmentFinder(
  units: PublicUnit[],
  filters: FinderFilters,
) {
  const rooms = filters.rooms ? parseNumber(filters.rooms) : null;
  const floor = filters.floor ? parseNumber(filters.floor) : null;
  const minPrice = filters.minPrice ? parseNumber(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? parseNumber(filters.maxPrice) : null;

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return [];
  }

  return units.filter((unit) => {
    if (!unit.isPublished || unit.status === "hidden") {
      return false;
    }

    if (
      filters.building &&
      unit.buildingId !== filters.building &&
      unit.building?.id !== filters.building &&
      unit.building?.slug !== filters.building
    ) {
      return false;
    }

    if (rooms !== null && unit.rooms !== rooms) {
      return false;
    }

    if (floor !== null && unit.floor !== floor) {
      return false;
    }

    if (filters.orientation && unit.orientation !== filters.orientation) {
      return false;
    }

    if (filters.status && unit.status !== filters.status) {
      return false;
    }

    if (minPrice !== null || maxPrice !== null) {
      if (!unit.isPriceVisible || unit.price === null) {
        return false;
      }

      if (minPrice !== null && unit.price < minPrice) {
        return false;
      }

      if (maxPrice !== null && unit.price > maxPrice) {
        return false;
      }
    }

    return true;
  });
}
