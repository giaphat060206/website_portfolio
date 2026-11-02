"use client";

import { useEffect, useRef, useState } from "react";
import { cv } from "@/data/cv";

const INTENT_LOCK_MS = 600;

export function Nav() {
  const [activeId, setActiveId] = useState<string>(cv.nav[0].id);
  const lockUntil = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = cv.nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const isLocked = () => Date.now() < lockUntil.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isLocked()) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -69% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (isLocked()) return;
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;
        if (atBottom) setActiveId(cv.nav[cv.nav.length - 1].id);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (!list || !active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeId]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-6">
        <a
          href="#top"
          className="hidden shrink-0 font-display text-lg text-ink sm:inline-block"
        >
          {cv.name}
        </a>
        <nav aria-label="Sections" className="ml-auto min-w-0 sm:ml-0">
          <ul
            ref={listRef}
            className="flex gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:overflow-visible"
          >
            {cv.nav.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id} data-id={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => {
                      lockUntil.current = Date.now() + INTENT_LOCK_MS;
                      setActiveId(item.id);
                    }}
                    className={`relative inline-block px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                      active
                        ? "text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-accent"
                        : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
