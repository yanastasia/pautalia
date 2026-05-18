import type { BuildingStatus, UnitArea, UnitKind, UnitOwnership, UnitPlanArea, UnitStatus } from "@/types/domain";

export interface PublicBuilding {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  fullDescription: string;
  heroImage: string;
  status: BuildingStatus;
  displayOrder: number;
  modelColor: string;
  sequence: number;
  floorsCount: number;
  totalUnits: number;
  availableUnits: number;
  completionPercent: number;
  deliveryQuarter: string;
  floorplanImage: string;
  panoramaImage: string;
  amenities: string[];
  coordinates: [number, number, number];
}

export interface PublicFloor {
  id: string;
  buildingId: string;
  number: number;
  label: string;
  description: string;
  floorplanImage: string;
  mapAspectRatio?: string;
  svgOverlayData: Record<string, unknown> | null;
}

export interface PublicUnit {
  kind: Extract<UnitKind, "apartment">;
  id: string;
  slug: string;
  externalCode: string;
  code: string;
  buildingId: string;
  floorId: string;
  typologyId: string;
  unitNumber: string;
  building: { id: string; slug: string; name: string } | null;
  floor: number;
  floorMeta: { id: string; number: number; label: string } | null;
  typology: { id: string; name: string; rooms: number } | null;
  bedrooms: number | null;
  rooms: number;
  bathrooms: number;
  area: UnitArea;
  ownership: UnitOwnership;
  hasYard: boolean;
  outdoorType: "yard" | "terrace" | "balcony" | null;
  size: number;
  orientation: string;
  exposure: string;
  price: number | null;
  currency: string | null;
  status: UnitStatus;
  isPublished: boolean;
  isPriceVisible: boolean;
  description: string;
  highlight: string;
  floorplan: string;
  gallery: string[];
  panoramaImage: string;
  features: string[];
  planArea: UnitPlanArea;
  planRegions: UnitPlanArea[] | null;
  planPolygonPoints: readonly string[] | null;
  digitalTwinId: string | null;
  seoTitle: string;
  seoDescription: string;
}

export interface PublicParkingUnit {
  kind: Extract<UnitKind, "parking">;
  id: string;
  slug: string;
  code: string;
  externalCode: string;
  buildingId: string;
  building: { id: string; slug: string; name: string } | null;
  floor: number;
  unitNumber: string;
  size: number;
  price: number | null;
  currency: string | null;
  status: UnitStatus;
  isPublished: boolean;
  isPriceVisible: boolean;
}

export interface PublicProjectOverview {
  name: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  highlights: Array<{ title: string; copy: string }>;
  stats: Array<{ label: string; value: string }>;
  buildingPreviews: PublicBuilding[];
}
