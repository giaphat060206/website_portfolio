"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
};

const HIDDEN = ["opacity-0", "translate-y-2"];
const SHOWN = ["opacity-100", "translate-y-0"];

export function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.classList.remove(...SHOWN);
    el.classList.add(...HIDDEN);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.classList.remove(...HIDDEN);
        el.classList.add(...SHOWN);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      el.classList.remove(...HIDDEN);
      el.classList.add(...SHOWN);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="translate-y-0 opacity-100 transition-all duration-[400ms] ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
