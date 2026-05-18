"use client";

import { useEffect, useRef } from "react";

type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  popup?: string;
  color?: string;
};

type BuildingsMapProps = {
  markers: MapMarker[];
  zoom?: number;
  className?: string;
};

export function BuildingsMap({ markers, zoom = 15, className }: BuildingsMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current || initializedRef.current) return;
    initializedRef.current = true;

    let map: import("leaflet").Map | null = null;
    const leafletMarkers: import("leaflet").Marker[] = [];

    async function init() {
      const L = await import("leaflet");

      if (!mapRef.current) return;

      map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      markers.forEach((marker) => {
        const color = marker.color ?? "#b29366";
        const safeLabel = marker.label.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        const safePopup = (marker.popup ?? marker.label).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br/>");
        const icon = L.divIcon({
          className: "",
          html: `<div style=\"display:flex;align-items:center;gap:10px;transform:translateY(-2px);\"><div style=\"width:22px;height:22px;border-radius:9999px;background:${color};border:3px solid rgba(255,255,255,0.98);box-shadow:0 18px 40px rgba(12,13,15,0.38);\"></div><div style=\"padding:6px 10px;border-radius:9999px;background:rgba(255,255,255,0.96);border:1px solid rgba(16,18,20,0.12);box-shadow:0 18px 44px rgba(12,13,15,0.12);font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(16,18,20,0.86);white-space:nowrap;\">${safeLabel}</div></div>`,
          iconSize: [1, 1],
          iconAnchor: [11, 11],
        });

        const instance = L.marker([marker.lat, marker.lng], { icon }).addTo(map!);
        const popup = marker.popup ?? marker.label;
        if (popup) {
          instance.bindPopup(safePopup);
        }
        leafletMarkers.push(instance);
      });

      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng] as [number, number]));
        map.fitBounds(bounds.pad(0.25));
      } else {
        const marker = markers[0];
        map.setView([marker?.lat ?? 0, marker?.lng ?? 0], zoom);
      }

      requestAnimationFrame(() => {
        map?.invalidateSize();
      });
    }

    void init();

    return () => {
      leafletMarkers.forEach((marker) => marker.remove());
      map?.remove();
      map = null;
      initializedRef.current = false;
    };
  }, [markers, zoom]);

  return <div ref={mapRef} className={className} />;
}
