import { cv } from "@/data/cv";
import { skillIcons } from "@/data/skillIcons";
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
              {group.items.map((item) => {
                const icon = skillIcons[item];
                return (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-ink-muted"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {icon ? (
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 fill-current"
                          fillRule={icon.fillRule}
                        >
                          <path d={icon.path} />
                        </svg>
                      ) : null}
                    </span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
