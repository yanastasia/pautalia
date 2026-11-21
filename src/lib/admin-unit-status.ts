export const adminUnitStatuses = ["available", "reserved", "sold"] as const;
export type AdminUnitStatus = (typeof adminUnitStatuses)[number];
