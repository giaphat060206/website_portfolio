"use client";

import { useEffect, useRef, useState } from "react";
import { cv } from "@/data/cv";
import { Section } from "@/components/Section";

const COPY_FEEDBACK_MS = 2000;

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(cv.links.email);
      setCopied(true);
      if (timer.current !== undefined) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => setCopied(false),
        COPY_FEEDBACK_MS,
      );
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  }

  return (
    <Section id="contact" kicker="05" title="Contact">
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${cv.links.email}`}
          className="font-display text-3xl text-ink transition-colors hover:text-accent sm:text-5xl"
        >
          {cv.links.email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="rounded border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-10 flex flex-wrap gap-6 text-sm">
        <a
          href={cv.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          GitHub
        </a>
        <a
          href={cv.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          LinkedIn
        </a>
        <a
          href={cv.links.resume}
          className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          Download CV
        </a>
      </div>
    </Section>
  );
}
