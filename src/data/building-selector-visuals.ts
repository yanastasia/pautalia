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
    src: "/assets/buildings/residence/selector/main.png",
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
    src: "/assets/buildings/park/selector/main.png",
    position: "object-center",
    aspectRatio: "1448 / 1086",
    floorBands: {
      3: { top: 18.4, height: 21.7, left: 10.6, right: 9.5 },
      2: { top: 40.1, height: 22.4, left: 10.6, right: 9.5 },
      1: { top: 62.5, height: 22.8, left: 10.6, right: 9.5 },
    },
  },
};
