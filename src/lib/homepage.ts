import type { Locale } from "@/lib/i18n/config";
import { getFloorLabel, getResidenceLabel, getStatusLabel } from "@/lib/i18n/messages";
import type { PublicBuilding, PublicUnit } from "@/types/public-api";

export type HomeStat = {
  label: string;
  value: string;
};

export type HomeSelectorBuildingCard = {
  id: string;
  href: string;
  building: PublicBuilding;
};

export type HomeSelectorUnitLink = {
  id: string;
  href: string;
  code: string;
  buildingName: string;
  floorLabel: string;
  residenceLabel: string;
  areaLabel: string;
  statusLabel: string;
};

export type HomeSelectorModel = {
  buildingCards: HomeSelectorBuildingCard[];
  highlightedUnits: HomeSelectorUnitLink[];
};

function getAreaLabel(locale: Locale, area: number) {
  return locale === "bg" ? `${area} кв м` : `${area} sq m`;
}

function sortUnitsForHomepage(left: PublicUnit, right: PublicUnit) {
  return left.floor - right.floor || left.rooms - right.rooms || left.code.localeCompare(right.code);
}

export function getHomeStats(locale: Locale, buildings: PublicBuilding[], units: PublicUnit[]): HomeStat[] {
  return [
    {
      label:
        locale === "bg"
          ? buildings.length === 1
            ? "Сграда"
            : "Сгради"
          : buildings.length === 1
            ? "Building"
            : "Buildings",
      value: String(buildings.length),
    },
    {
      label: locale === "bg" ? "Жилища" : "Homes",
      value: String(units.length),
    },
    {
      label: locale === "bg" ? "Етажи" : "Floors",
      value: String(buildings.reduce((sum, building) => sum + building.floorsCount, 0)),
    },
    {
      label: locale === "bg" ? "Свободни" : "Available",
      value: String(units.filter((unit) => unit.status === "available").length),
    },
  ];
}

export function getHomeSelectorModel(
  locale: Locale,
  buildings: PublicBuilding[],
  units: PublicUnit[],
): HomeSelectorModel {
  const buildingCards = [...buildings]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((building) => ({
      id: building.id,
      href: `/buildings/${building.slug}`,
      building,
    }));

  const preferredUnits = units.filter((unit) => unit.status === "available").sort(sortUnitsForHomepage);
  const fallbackUnits = units.filter((unit) => unit.status !== "hidden").sort(sortUnitsForHomepage);
  const unitsToHighlight = (preferredUnits.length ? preferredUnits : fallbackUnits).slice(0, 3);

  return {
    buildingCards,
    highlightedUnits: unitsToHighlight.map((unit) => ({
      id: unit.id,
      href: `/units/${unit.slug}`,
      code: unit.code,
      buildingName: unit.building?.name ?? "",
      floorLabel: getFloorLabel(locale, unit.floor),
      residenceLabel: unit.typology?.name ?? getResidenceLabel(locale, unit.rooms),
      areaLabel: getAreaLabel(locale, unit.area?.total ?? unit.size),
      statusLabel: getStatusLabel(locale, unit.status),
    })),
  };
}
