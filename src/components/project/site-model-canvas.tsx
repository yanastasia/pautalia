"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import type { PublicBuilding } from "@/types/public-api";

function BuildingMesh({
  id,
  label,
  floorsCount,
  color,
  coordinates,
  active,
  onHover,
  onLeave,
  onSelect,
}: {
  id: string;
  label: string;
  floorsCount: number;
  color: string;
  coordinates: [number, number, number];
  active: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onSelect: (id: string) => void;
}) {
  const height = floorsCount * 0.8;

  return (
    <group position={[coordinates[0], height / 2, coordinates[2]]}>
      <RoundedBox
        args={[1.5, height, 2]}
        radius={0.08}
        smoothness={6}
        onPointerOver={() => onHover(id)}
        onPointerOut={onLeave}
        onClick={() => onSelect(id)}
      >
        <meshStandardMaterial color={active ? "#c9a46a" : color} metalness={0.28} roughness={0.42} />
      </RoundedBox>
      <Text position={[0, height / 2 + 0.55, 0]} fontSize={0.28} color={active ? "#f7e5c7" : "#d2dbe4"}>
        {label}
      </Text>
    </group>
  );
}

export default function SiteModelCanvas({ buildings }: { buildings: PublicBuilding[] }) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const [activeId, setActiveId] = useState<string>(buildings[0]?.id ?? "");
  const router = useRouter();

  if (!buildings.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-[1.3rem] border border-white/8 bg-[rgba(255,255,255,0.05)] text-sm text-white/62">
        {locale === "bg" ? "Списъкът със сгради не е наличен в момента." : "The building list is unavailable right now."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-[rgba(255,255,255,0.05)] shadow-[0_28px_80px_rgba(7,15,24,0.28)] backdrop-blur">
      <div className="grid gap-4 p-4 md:grid-cols-[1.36fr_0.64fr]">
        <div className="aspect-[16/9] overflow-hidden rounded-[1.3rem] border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(173,138,86,0.22),transparent_28%),linear-gradient(180deg,#152738_0%,#0e1d2a_100%)]">
          <Canvas camera={{ position: [8.2, 5.8, 9], fov: 44 }}>
            <ambientLight intensity={1.4} />
            <directionalLight position={[6, 10, 4]} intensity={1.2} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
              <planeGeometry args={[16, 10]} />
              <meshStandardMaterial color="#122232" />
            </mesh>
            {buildings.map((building) => (
              <BuildingMesh
                key={building.id}
                id={building.id}
                label={building.name}
                floorsCount={building.floorsCount}
                color={building.modelColor}
                coordinates={building.coordinates}
                active={activeId === building.id}
                onHover={setActiveId}
                onLeave={() => setActiveId(buildings[0]?.id ?? building.id)}
                onSelect={(id) => {
                  const selected = buildings.find((building) => building.id === id);
                  router.push(`/building/${selected?.slug ?? id}`);
                }}
              />
            ))}
            <OrbitControls enablePan={false} minDistance={7} maxDistance={14} maxPolarAngle={Math.PI / 2.1} />
          </Canvas>
        </div>

        <div className="space-y-3">
          {buildings.map((building) => (
            <button
              key={building.id}
              type="button"
              onMouseEnter={() => setActiveId(building.id)}
              onClick={() => router.push(`/building/${building.slug}`)}
              className={`w-full rounded-[1.2rem] border px-4 py-4 text-left transition-all ${
                activeId === building.id
                  ? "border-[color:var(--accent)] bg-white text-[color:var(--surface-dark)] shadow-[0_18px_44px_rgba(255,255,255,0.16)]"
                  : "border-white/8 bg-white/7 text-white"
              }`}
            >
              <p className={`font-sans text-xs uppercase tracking-[0.22em] ${activeId === building.id ? "text-[color:var(--accent-deep)]" : "text-white/42"}`}>
                {messages.common.building}
              </p>
              <h3 className={`mt-1 font-serif text-2xl ${activeId === building.id ? "text-[color:var(--surface-dark)]" : "text-white"}`}>
                {building.name}
              </h3>
              <p className={`mt-2 text-sm leading-6 ${activeId === building.id ? "text-[color:var(--muted)]" : "text-white/58"}`}>{building.tagline}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
