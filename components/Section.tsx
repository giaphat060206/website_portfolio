import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  kicker?: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, kicker, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-line px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {kicker ? (
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
            {kicker}
          </p>
        ) : null}
        <h2 className="font-display text-4xl text-ink sm:text-5xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
