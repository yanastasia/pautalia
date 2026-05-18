export type BuildingGeo = {
  slug: "residence" | "park";
  lat: number;
  lng: number;
  address: string;
  markerColor: string;
};

const buildingGeo: BuildingGeo[] = [
  {
    slug: "residence",
    lat: 42.2907222,
    lng: 22.6936944,
    address: 'ул. "Панайот Волов", Kyustendil',
    markerColor: "#c77d4f",
  },
  {
    slug: "park",
    lat: 42.2865833,
    lng: 22.6980556,
    address: 'ул. "Георги Тертер", Kyustendil',
    markerColor: "#3f7d6f",
  },
];

export function listBuildingGeos() {
  return [...buildingGeo];
}

export function getBuildingGeoBySlug(slug: string) {
  return buildingGeo.find((item) => item.slug === slug) ?? null;
}
