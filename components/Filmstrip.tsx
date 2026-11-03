"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { ProjectImage } from "@/data/projectImages";
import { ZoomableImage } from "@/components/ZoomableImage";

type FilmstripProps = { images: ProjectImage[]; label: string };

type DragState = { startX: number; startScroll: number };

type DepthGeometry = { width: number; centers: number[] };

const DRAG_THRESHOLD = 6;
const COPIES = 4;
const KEYBOARD_SETTLE_MS = 600;

function periodOf(track: HTMLDivElement, count: number) {
  const first = track.children[0] as HTMLElement | undefined;
  const next = track.children[count] as HTMLElement | undefined;
  if (!first || !next) return 0;
  return next.offsetLeft - first.offsetLeft;
}

function wrapInto(value: number, period: number) {
  if (period <= 0) return value;
  return period + ((((value - period) % period) + period) % period);
}

/**
 * Layout centre of every slide in the track's scrollable coordinates. Read
 * from `offsetLeft`/`offsetWidth`, not `getBoundingClientRect`, because the
 * rect would include the very transform we are about to apply and feed back
 * into itself.
 */
function readGeometry(track: HTMLDivElement): DepthGeometry {
  return {
    width: track.clientWidth,
    centers: Array.from(track.children, (child) => {
      const slide = child as HTMLElement;
      return slide.offsetLeft + slide.offsetWidth / 2;
    }),
  };
}

/**
 * Writes each slide's distance from the centre of the strip as custom
 * properties: `--t` is the signed, clamped position (−1 left edge … 0
 * centred … 1 right edge), `--d` is its magnitude, and `--e` is the distance
 * before that clamp (capped at 2). `--e` lets the blur start only once a
 * slide is on its way out of the strip, so the visible strip stays in focus.
 */
function applyDepth(track: HTMLDivElement, geometry: DepthGeometry) {
  const half = geometry.width / 2;
  if (half <= 0) return;

  const viewportCenter = track.scrollLeft + half;
  const count = Math.min(track.children.length, geometry.centers.length);

  for (let index = 0; index < count; index += 1) {
    const slide = track.children[index] as HTMLElement;
    const position = (geometry.centers[index] - viewportCenter) / half;
    const offset = Math.max(-1, Math.min(1, position));
    const depth = Math.abs(offset);
    const reach = Math.min(2, Math.abs(position));

    slide.style.setProperty("--t", offset.toFixed(3));
    slide.style.setProperty("--d", depth.toFixed(3));
    slide.style.setProperty("--e", reach.toFixed(3));
    slide.style.zIndex = String(Math.round((1 - depth) * 10));
  }
}

export function Filmstrip({ images, label }: FilmstripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const moved = useRef(false);
  const settleUntil = useRef(0);
  const settleTimer = useRef<number | undefined>(undefined);
  const pending = useRef<number | null>(null);
  const geometry = useRef<DepthGeometry | null>(null);
  const depthFrame = useRef<number | undefined>(undefined);

  const loops = images.length >= 2;
  const slides = loops
    ? Array.from({ length: COPIES }, () => images).flat()
    : images;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const refresh = () => {
      geometry.current = readGeometry(track);
      applyDepth(track, geometry.current);
    };

    const place = (home: boolean) => {
      const period = periodOf(track, images.length);
      if (period <= 0) return;

      if (home) {
        const first = track.children[0] as HTMLElement | undefined;
        const width = first?.offsetWidth ?? 0;
        // Open with the first screenshot centred so the depth falloff is
        // visible on both sides instead of a slide pinned to the left edge.
        track.scrollLeft = wrapInto(
          period + width / 2 - track.clientWidth / 2,
          period,
        );
        return;
      }

      track.scrollLeft = wrapInto(track.scrollLeft, period);
    };

    if (!loops) {
      track.dataset.scrollable = "false";
      refresh();
      return;
    }

    place(true);
    track.dataset.scrollable = "true";
    refresh();

    const observer = new ResizeObserver(() => {
      place(false);
      refresh();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [loops, images.length]);

  useEffect(() => {
    return () => {
      if (settleTimer.current !== undefined) {
        window.clearTimeout(settleTimer.current);
      }
      if (depthFrame.current !== undefined) {
        window.cancelAnimationFrame(depthFrame.current);
      }
    };
  }, []);

  function syncDepth() {
    const track = trackRef.current;
    if (!track || !geometry.current) return;
    applyDepth(track, geometry.current);
  }

  function scheduleDepth() {
    if (depthFrame.current !== undefined) return;
    depthFrame.current = window.requestAnimationFrame(() => {
      depthFrame.current = undefined;
      syncDepth();
    });
  }

  function normalize() {
    const track = trackRef.current;
    if (!track || !loops) return;
    // A smooth keyboard scroll must be allowed to finish; re-wrap afterwards.
    if (Date.now() < settleUntil.current) return;

    const period = periodOf(track, images.length);
    if (period <= 0) return;

    const wrapped = wrapInto(track.scrollLeft, period);
    if (Math.abs(wrapped - track.scrollLeft) < 1) return;

    const shift = wrapped - track.scrollLeft;
    track.scrollLeft = wrapped;
    if (drag.current) drag.current.startScroll += shift;
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const track = trackRef.current;
    if (!track) return;

    moved.current = false;
    pending.current = null;
    drag.current = { startX: event.clientX, startScroll: track.scrollLeft };
    // Do NOT capture here: capture retargets the compatibility mouse events,
    // so a plain click would never reach the slide's own button.
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state) return;

    const delta = event.clientX - state.startX;
    if (Math.abs(delta) <= DRAG_THRESHOLD) return;

    if (!track.hasPointerCapture(event.pointerId)) {
      track.setPointerCapture(event.pointerId);
    }
    moved.current = true;

    const raw = state.startScroll - delta;
    const period = periodOf(track, images.length);

    if (period <= 0) {
      track.scrollLeft = raw;
      scheduleDepth();
      return;
    }

    // Wrap arithmetically: scrollLeft clamps at the scroller's limits, which
    // would silently discard travel during a fast flick.
    const wrapped = wrapInto(raw, period);
    state.startScroll += wrapped - raw;
    track.scrollLeft = wrapped;
    scheduleDepth();
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
    const second = track.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : 320;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = event.key === "ArrowRight" ? 1 : -1;

    // Track a virtual target so a held key accumulates steps even while the
    // scroller is still animating. Reading live scrollLeft would drop steps.
    if (pending.current === null) pending.current = track.scrollLeft;
    let target = pending.current + direction * step;

    const period = periodOf(track, images.length);
    if (period > 0) {
      const wrapped = wrapInto(target, period);
      if (wrapped !== target) {
        // Jump an equivalent position first so the animation never clamps.
        const shift = wrapped - target;
        track.scrollLeft += shift;
        pending.current += shift;
        target = wrapped;
      }
    }

    pending.current = target;
    settleUntil.current = Date.now() + KEYBOARD_SETTLE_MS;

    track.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    scheduleDepth();
    event.preventDefault();

    if (settleTimer.current !== undefined) {
      window.clearTimeout(settleTimer.current);
    }
    settleTimer.current = window.setTimeout(() => {
      settleUntil.current = 0;
      pending.current = null;
      normalize();
    }, KEYBOARD_SETTLE_MS + 20);
  }

  return (
    <div className="relative -m-2 p-2 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div
        ref={trackRef}
        role="region"
        aria-label={`${label} screenshots`}
        onScroll={() => {
          normalize();
          scheduleDepth();
        }}
        onWheel={() => {
          pending.current = null;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className="relative flex items-center gap-4 overflow-x-auto overflow-y-hidden py-6 [perspective:1200px] [scrollbar-width:none] data-[scrollable=true]:cursor-grab data-[scrollable=true]:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((image, index) => {
          const clone =
            loops &&
            (index < images.length || index >= images.length * 2);

          return (
            <ZoomableImage
              key={index}
              src={image.src}
              alt={image.alt}
              decorative={clone}
              sizes="(min-width: 768px) 31vw, (min-width: 640px) 52vw, 86vw"
              className={`${loops ? "filmstrip-slide" : ""} shrink-0 rounded-lg border border-line ${
                image.wide ? "aspect-[2/1]" : "aspect-[4/3]"
              } ${
                images.length === 1
                  ? "w-full"
                  : "w-[86%] sm:w-[60%] lg:w-[75%]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
