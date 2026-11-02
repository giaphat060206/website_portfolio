import Image from "next/image";
import portrait from "@/app/assets/images/face/linkedin.webp";
import { cv } from "@/data/cv";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section id="top" className="flex min-h-[85svh] items-center px-6 pt-28 pb-16">
      <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            {cv.award}
          </p>
          <h1 className="mt-4 font-display text-5xl text-ink sm:text-7xl">
            {cv.name}
          </h1>
          <p className="mt-3 text-ink-muted">{cv.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {cv.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded bg-accent px-5 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
            >
              View Projects
            </a>
            <a
              href={cv.links.resume}
              className="rounded border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent"
            >
              Download CV
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Image
            src={portrait}
            alt="Portrait of Nguyen Don Gia Phat"
            priority
            className="h-auto w-full rounded-lg border border-line object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
