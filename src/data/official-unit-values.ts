export type OfficialApartmentValue = {
  living: number;
  shared: number;
  terrace: number;
  total: number;
  commonPartsPercent: number;
  landPercent: number;
  landArea: number;
};

export type OfficialParkingValue = {
  landPercent: number;
  landArea: number;
};

export const officialApartmentValuesByCode: Record<string, OfficialApartmentValue> = {
  "AP.01": { living: 66.23, shared: 10.5, terrace: 0, total: 76.73, commonPartsPercent: 6.57, landPercent: 4.873, landArea: 50.05 },
  "AP.02": { living: 52.89, shared: 8.39, terrace: 0, total: 61.28, commonPartsPercent: 5.24, landPercent: 3.892, landArea: 39.97 },
  "AP.03": { living: 52.82, shared: 8.38, terrace: 0, total: 61.2, commonPartsPercent: 5.24, landPercent: 3.887, landArea: 39.92 },
  "AP.04": { living: 66.23, shared: 10.5, terrace: 0, total: 76.73, commonPartsPercent: 6.57, landPercent: 4.873, landArea: 50.05 },
  "AP.05": { living: 80.86, shared: 12.82, terrace: 0, total: 93.68, commonPartsPercent: 8.02, landPercent: 5.95, landArea: 61.11 },
  "AP.06": { living: 63.66, shared: 10.1, terrace: 0, total: 73.76, commonPartsPercent: 6.31, landPercent: 4.684, landArea: 48.11 },
  "AP.07": { living: 63.59, shared: 10.08, terrace: 0, total: 73.67, commonPartsPercent: 6.3, landPercent: 4.679, landArea: 48.06 },
  "AP.08": { living: 80.93, shared: 12.83, terrace: 0, total: 93.76, commonPartsPercent: 8.02, landPercent: 5.955, landArea: 61.16 },
  "AP.09": { living: 80.86, shared: 12.82, terrace: 0, total: 93.68, commonPartsPercent: 8.02, landPercent: 5.95, landArea: 61.11 },
  "AP.10": { living: 63.66, shared: 10.1, terrace: 0, total: 73.76, commonPartsPercent: 6.31, landPercent: 4.684, landArea: 48.11 },
  "AP.11": { living: 63.59, shared: 10.08, terrace: 0, total: 73.67, commonPartsPercent: 6.3, landPercent: 4.679, landArea: 48.06 },
  "AP.12": { living: 80.93, shared: 12.83, terrace: 0, total: 93.76, commonPartsPercent: 8.02, landPercent: 5.955, landArea: 61.16 },
  "AP.13": { living: 126.59, shared: 15.21, terrace: 30.65, total: 141.8, commonPartsPercent: 9.51, landPercent: 7.06, landArea: 72.5 },
  "AP.14": { living: 126.55, shared: 15.31, terrace: 30, total: 141.86, commonPartsPercent: 9.57, landPercent: 7.105, landArea: 72.96 },
};

export const officialParkingValuesByCode: Record<string, OfficialParkingValue> = {
  "A-P01": { landPercent: 1.275, landArea: 13.09 },
  "A-P02": { landPercent: 1.217, landArea: 12.5 },
  "A-P03": { landPercent: 1.217, landArea: 12.5 },
  "A-P04": { landPercent: 1.217, landArea: 12.5 },
  "A-P05": { landPercent: 1.217, landArea: 12.5 },
  "A-P06": { landPercent: 1.217, landArea: 12.5 },
  "A-P07": { landPercent: 1.387, landArea: 14.24 },
  "A-P08": { landPercent: 1.292, landArea: 13.27 },
  "A-P09": { landPercent: 1.217, landArea: 12.5 },
  "A-P10": { landPercent: 1.217, landArea: 12.5 },
  "A-P11": { landPercent: 1.217, landArea: 12.5 },
  "A-P12": { landPercent: 1.217, landArea: 12.5 },
  "A-P13": { landPercent: 1.217, landArea: 12.5 },
  "A-P14": { landPercent: 1.217, landArea: 12.5 },
};

export function getOfficialApartmentValue(code: string) {
  return officialApartmentValuesByCode[code];
}

export function getOfficialParkingValue(code: string) {
  return officialParkingValuesByCode[code];
}
