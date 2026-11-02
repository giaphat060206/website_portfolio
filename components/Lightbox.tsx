"use client";

import Image, { type StaticImageData } from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ZoomItem = { src: StaticImageData; alt: string; from: DOMRect };

type LightboxContextValue = {
  open: (src: StaticImageData, alt: string, element: HTMLElement) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const value = useContext(LightboxContext);
  if (!value) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return value;
}

const MAX_RATIO = 0.92;
const DURATION = 300;
const EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const TRANSITION = `top ${DURATION}ms ${EASING}, left ${DURATION}ms ${EASING}, width ${DURATION}ms ${EASING}, height ${DURATION}ms ${EASING}`;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function targetBox(src: StaticImageData) {
  const ratio = src.width / src.height;
  let width = window.innerWidth * MAX_RATIO;
  let height = width / ratio;

  if (height > window.innerHeight * MAX_RATIO) {
    height = window.innerHeight * MAX_RATIO;
    width = height * ratio;
  }

  return { width, height };
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ZoomItem | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (src: StaticImageData, alt: string, element: HTMLElement) => {
      trigger.current = element;
      setItem({ src, alt, from: element.getBoundingClientRect() });
    },
    [],
  );

  const close = useCallback(() => {
    const element = trigger.current;
    const focusTarget =
      element?.tagName === "BUTTON"
        ? element
        : (element
            ?.closest('[role="region"]')
            ?.querySelector<HTMLButtonElement>("button") ?? null);

    setItem(null);
    requestAnimationFrame(() => focusTarget?.focus());
  }, []);

  useEffect(() => {
    if (!item) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [item]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {item ? <Overlay item={item} onClose={close} /> : null}
    </LightboxContext.Provider>
  );
}

function Overlay({ item, onClose }: { item: ZoomItem; onClose: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const [size] = useState(() => targetBox(item.src));

  const setRect = useCallback(
    (rect: { top: number; left: number; width: number; height: number }) => {
      const box = boxRef.current;
      if (!box) return;
      box.style.top = `${rect.top}px`;
      box.style.left = `${rect.left}px`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
    },
    [],
  );

  const placeTarget = useCallback(() => {
    setRect({
      top: (window.innerHeight - size.height) / 2,
      left: (window.innerWidth - size.width) / 2,
      width: size.width,
      height: size.height,
    });
  }, [setRect, size.height, size.width]);

  const placeThumbnail = useCallback(() => {
    setRect(item.from);
  }, [item.from, setRect]);

  useLayoutEffect(() => {
    closeRef.current?.focus();

    if (prefersReducedMotion()) {
      placeTarget();
      return;
    }

    const box = boxRef.current;
    if (!box) return;

    box.style.transition = "none";
    placeThumbnail();

    const frame = requestAnimationFrame(() => {
      box.style.transition = TRANSITION;
      placeTarget();
    });

    return () => cancelAnimationFrame(frame);
  }, [placeTarget, placeThumbnail]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    const box = boxRef.current;
    if (!box) {
      onClose();
      return;
    }

    box.style.transition = TRANSITION;
    placeThumbnail();

    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(onClose, DURATION + 150);
  }, [onClose, placeThumbnail]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== undefined) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== box || !closing.current) return;
      if (closeTimer.current !== undefined) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = undefined;
      }
      onClose();
    };

    box.addEventListener("transitionend", onEnd);
    return () => box.removeEventListener("transitionend", onEnd);
  }, [onClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-50 bg-canvas/95"
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={boxRef}
        className="fixed z-50 overflow-hidden"
        style={{ top: 0, left: 0, width: 0, height: 0 }}
      >
        <Image
          src={item.src}
          alt=""
          fill
          priority
          sizes="92vw"
          className="object-cover"
        />
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        className="absolute right-4 top-4 rounded border border-line bg-canvas/80 px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-accent focus-visible:outline-offset-2"
      >
        Close
      </button>
    </div>
  );
}
