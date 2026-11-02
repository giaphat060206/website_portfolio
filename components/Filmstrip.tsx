"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { ProjectImage } from "@/data/projectImages";

type FilmstripProps = { images: ProjectImage[]; label: string };

type DragState = { startX: number; startScroll: number };

const DRAG_THRESHOLD = 6;
const ITEM_GAP = 16;

export function Filmstrip({ images, label }: FilmstripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const scrollable = track.scrollWidth > track.clientWidth + 1;
      track.tabIndex = scrollable ? 0 : -1;
      track.dataset.scrollable = scrollable ? "true" : "false";
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [images.length]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const track = trackRef.current;
    if (!track) return;

    moved.current = false;
    drag.current = { startX: event.clientX, startScroll: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state) return;

    const delta = event.clientX - state.startX;
    if (Math.abs(delta) <= DRAG_THRESHOLD) return;

    moved.current = true;
    track.scrollLeft = state.startScroll - delta;
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!moved.current) return;
    event.preventDefault();
    event.stopPropagation();
    moved.current = false;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const track = trackRef.current;
    if (!track) return;

    const first = track.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + ITEM_GAP : 320;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    track.scrollBy({
      left: event.key === "ArrowRight" ? step : -step,
      behavior: reduced ? "auto" : "smooth",
    });
    event.preventDefault();
  }

  return (
    <div className="relative -m-2 p-2 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div
        ref={trackRef}
        role="region"
        aria-label={`${label} screenshots`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] data-[scrollable=true]:cursor-grab data-[scrollable=true]:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            draggable={false}
            className={`shrink-0 select-none rounded-lg border border-line object-cover ${
              image.wide ? "aspect-[2/1]" : "aspect-[4/3]"
            } ${
              images.length === 1
                ? "w-full"
                : "w-[85%] sm:w-[55%] lg:w-[44%]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
