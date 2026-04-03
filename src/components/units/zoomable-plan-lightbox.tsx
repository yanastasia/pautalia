"use client";

import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import type { UnitPlanGalleryItem } from "@/components/units/unit-plan-gallery-content";
import { clamp, getDistance, getMidpoint, type PointerPosition } from "@/components/units/zoomable-plan-lightbox-helpers";

const MAX_SCALE = 4;
const MIN_SCALE = 1;

type ZoomablePlanLightboxProps = {
  items: UnitPlanGalleryItem[];
  initialIndex: number;
  locale: "bg" | "en";
  onClose: () => void;
};

export function ZoomablePlanLightbox({ items, initialIndex, locale, onClose }: ZoomablePlanLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointersRef = useRef(new Map<number, PointerPosition>());
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number; offsetX: number; offsetY: number; centerX: number; centerY: number } | null>(null);
  const activeItem = items[activeIndex];
  const ui = locale === "bg"
    ? { close: "Затвори", reset: "Нулирай увеличението", previous: "Предишен план", next: "Следващ план" }
    : { close: "Close", reset: "Reset zoom", previous: "Previous plan", next: "Next plan" };

  function clampOffset(nextOffset: { x: number; y: number }, nextScale: number) {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) {
      return nextOffset;
    }
    const maxX = ((nextScale - 1) * bounds.width) / 2;
    const maxY = ((nextScale - 1) * bounds.height) / 2;
    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  }

  function resetZoom() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    dragRef.current = null;
    pinchRef.current = null;
  }

  function showImage(nextIndex: number) {
    setActiveIndex((nextIndex + items.length) % items.length);
    resetZoom();
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        showImage(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        showImage(activeIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose, items.length]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 1 && scale > 1) {
      dragRef.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y };
    }
    if (pointersRef.current.size === 2) {
      const positions = Array.from(pointersRef.current.values());
      const center = getMidpoint(positions);
      pinchRef.current = {
        distance: getDistance(positions),
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
        centerX: center.x,
        centerY: center.y,
      };
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const positions = Array.from(pointersRef.current.values());

    if (positions.length === 2 && pinchRef.current) {
      const nextScale = clamp((pinchRef.current.scale * getDistance(positions)) / pinchRef.current.distance, MIN_SCALE, MAX_SCALE);
      const center = getMidpoint(positions);
      setScale(nextScale);
      setOffset(clampOffset({
        x: pinchRef.current.offsetX + (center.x - pinchRef.current.centerX),
        y: pinchRef.current.offsetY + (center.y - pinchRef.current.centerY),
      }, nextScale));
      return;
    }

    if (positions.length === 1 && dragRef.current && scale > 1) {
      setOffset(clampOffset({
        x: dragRef.current.offsetX + (event.clientX - dragRef.current.x),
        y: dragRef.current.offsetY + (event.clientY - dragRef.current.y),
      }, scale));
    }
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    dragRef.current = pointersRef.current.size === 1 && scale > 1 ? dragRef.current : null;

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const nextScale = clamp(scale - event.deltaY * 0.003, MIN_SCALE, MAX_SCALE);
    setScale(nextScale);
    setOffset((currentOffset) => clampOffset(currentOffset, nextScale));
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(8,10,12,0.92)] px-4 py-5 sm:px-6">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col">
        <div className="mb-4 flex items-center justify-between gap-4 text-white">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/58">{activeItem.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={resetZoom} className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/82">
              <span className="inline-flex items-center gap-2">
                <RotateCcw className="size-4" />
                {ui.reset}
              </span>
            </button>
            <button type="button" onClick={onClose} className="rounded-full border border-white/12 p-3 text-white/82" aria-label={ui.close}>
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onWheel={handleWheel}
          onDoubleClick={() => (scale > 1 ? resetZoom() : setScale(2))}
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.03)] touch-none"
        >
          <img
            src={activeItem.src}
            alt={activeItem.alt}
            className="max-h-full max-w-full select-none object-contain"
            draggable={false}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "center center" }}
          />

          <button
            type="button"
            onClick={() => showImage(activeIndex - 1)}
            className="absolute left-4 top-1/2 rounded-full border border-white/14 bg-[rgba(17,18,21,0.52)] p-3 text-white/82 -translate-y-1/2"
            aria-label={ui.previous}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => showImage(activeIndex + 1)}
            className="absolute right-4 top-1/2 rounded-full border border-white/14 bg-[rgba(17,18,21,0.52)] p-3 text-white/82 -translate-y-1/2"
            aria-label={ui.next}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
