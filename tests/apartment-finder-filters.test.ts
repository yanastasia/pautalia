import { describe, expect, it } from "vitest";
import {
  canonicalizeApartmentFinderParams,
  createApartmentFinderSearchParams,
  filterUnitsForApartmentFinder,
  getApartmentFinderFilters,
} from "@/lib/apartment-finder-filters";
import type { PublicUnit } from "@/types/public-api";

const createUnit = (overrides: Partial<PublicUnit> = {}): PublicUnit => ({
  kind: "apartment",
  id: "u-1",
  slug: "unit-1",
  externalCode: "A-AP.01",
  code: "A-AP.01",
  unitNumber: "01",
  buildingId: "a",
  floorId: "a-2",
  typologyId: "typology-3a",
  building: { id: "a", slug: "residence", name: "Residence" },
  floor: 2,
  floorMeta: { id: "a-2", number: 2, label: "Floor 2" },
  typology: { id: "typology-3a", name: "3-room apartment", rooms: 3 },
  bedrooms: 2,
  rooms: 3,
  bathrooms: 1,
  area: { living: 76.6, shared: 0, terrace: 4.26, total: 80.86 },
  ownership: { commonPartsPercent: 0, landPercent: 0, landArea: 0 },
  hasYard: false,
  outdoorType: "balcony",
  size: 80.86,
  orientation: "south-west",
  exposure: "dual-aspect",
  price: 155000,
  currency: "EUR",
  status: "reserved",
  isPublished: true,
  isPriceVisible: true,
  description: "Desc",
  highlight: "Highlight",
  floorplan: "/fp.png",
  gallery: [],
  panoramaImage: "/pan.jpg",
  features: [],
  planArea: { x: 0, y: 0, width: 0, height: 0 },
  planRegions: null,
  planPolygonPoints: null,
  digitalTwinId: null,
  seoTitle: "SEO",
  seoDescription: "SEO",
  ...overrides,
});

describe("apartment finder filter state", () => {
  it("canonicalizes URL aliases into finder params", () => {
    const result = canonicalizeApartmentFinderParams({
      rooms: "3",
      price_min: "100000",
      price_max: "180000",
      availability: "available",
      page: "4",
      empty: "",
    });

    expect(result).toEqual({
      rooms: "3",
      minPrice: "100000",
      maxPrice: "180000",
      status: "available",
    });
  });

  it("builds shareable filter URLs and resets pagination", () => {
    const current = new URLSearchParams("rooms=2&price_min=90000&availability=available&page=3");
    const next = new URLSearchParams(createApartmentFinderSearchParams(current, "floor", "2"));

    expect(Object.fromEntries(next.entries())).toEqual({
      rooms: "2",
      minPrice: "90000",
      status: "available",
      floor: "2",
    });
  });

  it("removes a filter from the URL when its value is empty", () => {
    const current = new URLSearchParams("rooms=2&floor=3");
    const next = new URLSearchParams(createApartmentFinderSearchParams(current, "rooms", ""));

    expect(Object.fromEntries(next.entries())).toEqual({ floor: "3" });
  });

  it("extracts filters from search params", () => {
    const searchParams = new URLSearchParams("building=residence&rooms=3&floor=2&orientation=south-west&maxPrice=160000&status=reserved");
    const result = getApartmentFinderFilters(searchParams);

    expect(result).toEqual({
      building: "residence",
      rooms: "3",
      floor: "2",
      minPrice: "",
      maxPrice: "160000",
      orientation: "south-west",
      status: "reserved",
    });
  });

  it("filters units by rooms, floor, orientation, price, and availability", () => {
    const units = [
      createUnit({ id: "a-201", rooms: 3, floor: 2, orientation: "south-west", price: 153000 }),
      createUnit({ id: "a-202", rooms: 2, floor: 2, orientation: "south-west", price: 125000 }),
      createUnit({ id: "a-203", rooms: 3, floor: 3, orientation: "south-west", price: 155000 }),
      createUnit({ id: "a-204", rooms: 3, floor: 2, orientation: "east", price: 150000 }),
      createUnit({ id: "a-205", rooms: 3, floor: 2, orientation: "south-west", status: "reserved" }),
      createUnit({ id: "a-206", rooms: 3, floor: 2, orientation: "south-west", price: null, isPriceVisible: false }),
    ];

    const result = filterUnitsForApartmentFinder(units, {
      building: "",
      rooms: "3",
      floor: "2",
      minPrice: "150000",
      maxPrice: "154000",
      orientation: "south-west",
      status: "available",
    });

    expect(result.map((unit: PublicUnit) => unit.id)).toEqual(["a-201"]);
  });

  it("filters units correctly", () => {
    const units = [
      createUnit({ id: "a-201", buildingId: "a", building: { id: "a", slug: "residence", name: "Residence" } }),
      createUnit({ id: "b-ap-01", buildingId: "b", building: { id: "b", slug: "park", name: "Park" } }),
    ];

    expect(filterUnitsForApartmentFinder(units, { ...getApartmentFinderFilters(new URLSearchParams()), building: "park" }).map((unit: PublicUnit) => unit.id)).toEqual(["b-ap-01"]);
  });
});
