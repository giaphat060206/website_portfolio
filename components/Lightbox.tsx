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
    setItem(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  useEffect(() => {
    if (!item) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
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

  const [size] = useState(() => targetBox(item.src));

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    closeRef.current?.focus();

    if (prefersReducedMotion()) return;

    const { from } = item;
    const dx = from.left + from.width / 2 - window.innerWidth / 2;
    const dy = from.top + from.height / 2 - window.innerHeight / 2;
    const scale = from.width / size.width;

    box.style.transition = "none";
    box.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    const frame = requestAnimationFrame(() => {
      box.style.transition = `transform ${DURATION}ms ${EASING}`;
      box.style.transform = "none";
    });

    return () => cancelAnimationFrame(frame);
  }, [item, size.width]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    const box = boxRef.current;
    if (!box || prefersReducedMotion()) {
      onClose();
      return;
    }

    const { from } = item;
    const dx = from.left + from.width / 2 - window.innerWidth / 2;
    const dy = from.top + from.height / 2 - window.innerHeight / 2;
    const scale = from.width / size.width;

    box.style.transition = `transform ${DURATION}ms ${EASING}`;
    box.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  }, [item, onClose, size.width]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    let done = false;
    const finish = () => {
      if (done || !closing.current) return;
      done = true;
      onClose();
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === "transform") finish();
    };

    box.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(finish, DURATION + 120);

    return () => {
      box.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
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
        className="fixed inset-0 m-auto"
        style={{ width: size.width, height: size.height }}
      >
        <Image
          src={item.src}
          alt=""
          fill
          priority
          sizes="92vw"
          className="object-contain"
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
