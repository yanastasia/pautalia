export type FloorBand = {
  top: number;
  height: number;
  left: number;
  right: number;
};

type BuildingSelectorVisual = {
  src: string;
  position: string;
  aspectRatio?: string;
  floorBands: Record<number, FloorBand> | null;
};

export const buildingSelectorVisuals: Record<string, BuildingSelectorVisual> = {
  a: {
    src: "/assets/buildings/building-a-selector.png",
    position: "object-center",
    aspectRatio: "1339 / 800",
    floorBands: {
      4: { top: 8.8, height: 18.4, left: 10.7, right: 3.9 },
      3: { top: 27.2, height: 19.4, left: 10.7, right: 3.9 },
      2: { top: 46.6, height: 17, left: 10.7, right: 3.9 },
      1: { top: 63.6, height: 21.2, left: 10.7, right: 3.9 },
    },
  },
  b: {
    src: "/assets/exterior/exterior-front.jpg",
    position: "object-[68%_center]",
    aspectRatio: "16 / 9",
    floorBands: null,
  },
};
