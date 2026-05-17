export const residenceRepresentativeUnitGallery = [
  "/assets/buildings/residence/gallery/living-entry.jpg",
  "/assets/buildings/residence/gallery/hall-entry.jpg",
  "/assets/buildings/residence/gallery/bedroom-entry.jpg",
  "/assets/buildings/residence/gallery/bathroom-entry.jpg",
] as const;

export const residenceUnitGalleriesByCode: Partial<Record<string, readonly string[]>> = {};

const parkRenderBase = "/assets/buildings/park/gallery/apartment_renders";

export const parkExteriorImages = [
  "/assets/buildings/park/exterior/park_exterior1.png",
  "/assets/buildings/park/exterior/park_exterior2.png",
  "/assets/buildings/park/exterior/park_exterior3.png",
  "/assets/buildings/park/exterior/park_exterior4.png",
] as const;

export const parkUnitGalleriesByCode: Record<string, readonly string[]> = {
  "B-AP.01": [
    `${parkRenderBase}/B-AP.01/01_living.png`,
    `${parkRenderBase}/B-AP.01/01_masterbedroom.png`,
    `${parkRenderBase}/B-AP.01/01_bedroom.png`,
    `${parkRenderBase}/B-AP.01/01_bath.png`,
    `${parkRenderBase}/B-AP.01/01_yard.png`,
  ],
  "B-AP.02": [
    `${parkRenderBase}/B-AP.02/02_living.png`,
    `${parkRenderBase}/B-AP.02/02_masterbedroom.png`,
    `${parkRenderBase}/B-AP.02/02_bedroom.png`,
    `${parkRenderBase}/B-AP.02/02_bath.png`,
    `${parkRenderBase}/B-AP.02/02_yard.png`,
  ],
  "B-AP.03": [
    `${parkRenderBase}/B-AP.03/03_living.png`,
    `${parkRenderBase}/B-AP.03/03_masterbedroom.png`,
    `${parkRenderBase}/B-AP.03/03_bedroom.png`,
    `${parkRenderBase}/B-AP.03/03_bath.png`,
    `${parkRenderBase}/B-AP.03/03_balcony.png`,
  ],
  "B-AP.04": [
    `${parkRenderBase}/B-AP.04/04_living.png`,
    `${parkRenderBase}/B-AP.04/04_firstbedroom.png`,
    `${parkRenderBase}/B-AP.04/04_secondbedroom.png`,
    `${parkRenderBase}/B-AP.04/04_bath.png`,
    `${parkRenderBase}/B-AP.04/04_balcony.png`,
  ],
  "B-AP.05": [
    `${parkRenderBase}/B-AP.05/05_living.png`,
    `${parkRenderBase}/B-AP.05/05_firstbedroom.png`,
    `${parkRenderBase}/B-AP.05/05_secondbedroom.png`,
    `${parkRenderBase}/B-AP.05/05_bath.png`,
    `${parkRenderBase}/B-AP.05/05_balcony.png`,
  ],
  "B-AP.06": [
    `${parkRenderBase}/B-AP.06/06_living.png`,
    `${parkRenderBase}/B-AP.06/06_firstbedroom.png`,
    `${parkRenderBase}/B-AP.06/06_secondbedroom.png`,
    `${parkRenderBase}/B-AP.06/06_bath.png`,
    `${parkRenderBase}/B-AP.06/06_balcony.png`,
  ],
} as const;

export const parkGeneralGalleryImages = {
  exterior: parkExteriorImages[0],
  living: parkUnitGalleriesByCode["B-AP.01"][0],
  yard: parkUnitGalleriesByCode["B-AP.01"][4],
  balcony: parkUnitGalleriesByCode["B-AP.03"][4],
  bathroom: parkUnitGalleriesByCode["B-AP.04"][3],
} as const;

function normalizeResidenceGalleryCode(code: string) {
  return code.startsWith("A-") ? code : `A-${code}`;
}

export function getResidenceUnitGallery(code: string) {
  return [
    ...(residenceUnitGalleriesByCode[normalizeResidenceGalleryCode(code)] ?? residenceRepresentativeUnitGallery),
  ];
}

export function getParkUnitGallery(code: string) {
  return [
    ...(parkUnitGalleriesByCode[code] ?? [
      "/assets/buildings/park/selector/main.png",
      parkExteriorImages[0],
    ]),
  ];
}
