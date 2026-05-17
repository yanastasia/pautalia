"use client";

import { useEffect } from "react";
import { sendAnalyticsEvent } from "@/lib/analytics-client";

export function UnitDetailTracker({ buildingId, unitId }: { buildingId: string; unitId: string }) {
  useEffect(() => {
    sendAnalyticsEvent("apartment_detail_view", { buildingId, unitId });
  }, [buildingId, unitId]);

  return null;
}
