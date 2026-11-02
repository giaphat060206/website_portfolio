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

function setWidthOf(track: HTMLDivElement, count: number) {
  const first = track.children[0] as HTMLElement | undefined;
  const middle = track.children[count] as HTMLElement | undefined;
  if (!first || !middle) return 0;
  return middle.offsetLeft - first.offsetLeft;
}

export function Filmstrip({ images, label }: FilmstripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const moved = useRef(false);

  const loops = images.length >= 2;
  const slides = loops ? [...images, ...images, ...images] : images;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!loops) {
      track.tabIndex = -1;
      track.dataset.scrollable = "false";
      return;
    }

    const home = () => {
      const width = setWidthOf(track, images.length);
      if (width > 0) track.scrollLeft = width;
    };

    home();
    track.tabIndex = 0;
    track.dataset.scrollable = "true";

    const observer = new ResizeObserver(home);
    observer.observe(track);
    return () => observer.disconnect();
  }, [loops, images.length]);

  function normalize() {
    const track = trackRef.current;
    if (!track || !loops) return;

    const width = setWidthOf(track, images.length);
    if (width <= 0) return;

    let shift = 0;
    if (track.scrollLeft < width * 0.5) shift = width;
    else if (track.scrollLeft > width * 1.5) shift = -width;
    if (shift === 0) return;

    track.scrollLeft += shift;
    if (drag.current) drag.current.startScroll += shift;
  }

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
    normalize();
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
        onScroll={normalize}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] data-[scrollable=true]:cursor-grab data-[scrollable=true]:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((image, index) => {
          const clone =
            loops && (index < images.length || index >= images.length * 2);

          return (
            <Image
              key={index}
              src={image.src}
              alt={clone ? "" : image.alt}
              aria-hidden={clone || undefined}
              draggable={false}
              className={`shrink-0 select-none rounded-lg border border-line object-cover ${
                image.wide ? "aspect-[2/1]" : "aspect-[4/3]"
              } ${
                images.length === 1
                  ? "w-full"
                  : "w-[85%] sm:w-[55%] lg:w-[44%]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
