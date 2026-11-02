import { cv } from "@/data/cv";
import { Section } from "@/components/Section";

export function Skills() {
  return (
    <Section id="skills" kicker="02" title="Skills">
      <div className="grid gap-10 sm:grid-cols-3">
        {cv.skills.map((group) => (
          <div key={group.title}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
