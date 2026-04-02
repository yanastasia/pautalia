export type UnitStatus = "available" | "reserved" | "sold" | "hidden";
export type BuildingStatus = "draft" | "published" | "archived";
export type LeadStatus = "new" | "contacted" | "qualified" | "archived" | "spam";
export type AdminRole = "super_admin" | "sales_admin" | "content_admin";
export type MediaAssetType = "image" | "panorama" | "floorplan" | "render" | "document";
export type DigitalTwinStatus = "draft" | "published" | "archived";

export interface Building {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  heroImageId?: string;
  coverRenderId?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  number: number;
  label: string;
  description: string;
  floorplanImage: string;
  floorplanImageId?: string;
  mapAspectRatio?: string;
  svgOverlayData?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Typology {
  id: string;
  name: string;
  rooms: number;
  description: string;
  defaultFloorplanImageId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitPlanArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Unit {
  id: string;
  slug: string;
  externalCode: string;
  code: string;
  buildingId: string;
  floorId: string;
  typologyId: string;
  unitNumber: string;
  floor: number;
  rooms: number;
  bedrooms?: number;
  bathrooms: number;
  areaInternalSqm: number;
  areaTotalSqm: number;
  terraceSqm: number;
  hasYard?: boolean;
  outdoorType?: "yard" | "terrace" | "balcony";
  size: number;
  orientation: string;
  exposure: string;
  price: number;
  currency: string;
  status: UnitStatus;
  isPublished: boolean;
  isPriceVisible: boolean;
  description: string;
  highlight: string;
  floorplan: string;
  floorplanImageId?: string;
  gallery: string[];
  panoramaImage: string;
  features: string[];
  planArea: UnitPlanArea;
  planRegions?: UnitPlanArea[];
  planPolygonPoints?: readonly string[];
  digitalTwinId?: string;
  seoTitle: string;
  seoDescription: string;
  updatedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryAsset {
  id: string;
  title: string;
  category: "exterior" | "interior" | "panorama";
  categoryLabel: string;
  image: string;
  caption: string;
}

export interface MediaAsset {
  id: string;
  type: MediaAssetType;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  storageKey: string;
  altText: string;
  uploadedByUserId?: string;
  createdAt?: string;
}

export interface LeadInput {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  unitId?: string;
  buildingId?: string;
  sourcePageUrl: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  consent: boolean;
  company?: string;
}

export interface PublicProjectOverview {
  name: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  highlights: Array<{ title: string; copy: string }>;
  stats: Array<{ label: string; value: string }>;
  buildingPreviews: Building[];
}
