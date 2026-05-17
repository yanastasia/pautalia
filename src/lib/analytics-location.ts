const geoHeaderCandidates = {
  country: ["cf-ipcountry", "x-vercel-ip-country", "x-geo-country", "x-country"],
  region: ["cf-region", "x-vercel-ip-country-region", "x-geo-region", "x-region"],
  city: ["cf-ipcity", "x-vercel-ip-city", "x-geo-city", "x-city"],
} as const;

type GeoField = keyof typeof geoHeaderCandidates;

function cleanGeoValue(value: string | null) {
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value);
    const cleaned = decoded.replace(/[\u0000-\u001F\u007F]/g, "").trim();
    return cleaned ? cleaned.slice(0, 120) : null;
  } catch {
    const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
    return cleaned ? cleaned.slice(0, 120) : null;
  }
}

function readGeoHeader(request: Request, field: GeoField) {
  for (const header of geoHeaderCandidates[field]) {
    const value = cleanGeoValue(request.headers.get(header));
    if (value) return value;
  }

  return null;
}

export function getAnalyticsLocation(request: Request) {
  return {
    country: readGeoHeader(request, "country"),
    region: readGeoHeader(request, "region"),
    city: readGeoHeader(request, "city"),
  };
}
