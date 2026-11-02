import { cv } from "@/data/cv";
import { Section } from "@/components/Section";

export function About() {
  return (
    <Section id="about" kicker="01" title="About">
      <p className="max-w-3xl text-lg leading-relaxed text-ink-muted">
        {cv.summary}
      </p>
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Based in
          </dt>
          <dd className="mt-2 text-ink">{cv.location}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Languages
          </dt>
          <dd className="mt-2 text-ink">{cv.languages}</dd>
        </div>
      </dl>
    </Section>
  );
}
