export type PointerPosition = { x: number; y: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getDistance([first, second]: PointerPosition[]) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export function getMidpoint([first, second]: PointerPosition[]) {
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}
