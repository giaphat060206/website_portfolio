import { cv } from "@/data/cv";
import { Section } from "@/components/Section";
import { ZoomableImage } from "@/components/ZoomableImage";
import champion from "@/app/assets/images/hack-a-venture 2025/champion.webp";
import interview from "@/app/assets/images/hack-a-venture 2025/interview.webp";
import photoReport from "@/app/assets/images/hack-a-venture 2025/photo-report.webp";
import adminMap from "@/app/assets/images/hack-a-venture 2025/admin-map.webp";

const gallery = [
  {
    src: champion,
    alt: "Hack-A-Venture 2025 champion announcement graphic featuring the team",
  },
  {
    src: interview,
    alt: "Interview with Phát, captioned Hack-A-Venture 2025 champion",
  },
  {
    src: photoReport,
    alt: "Mobile Report Flooding form showing an uploaded photo, coordinates, and an estimated water depth of 10 to 15 cm",
  },
  {
    src: adminMap,
    alt: "Admin map view from the Hack-A-Venture 2025 project",
  },
];

export function Education() {
  const entry = cv.education[0];

  return (
    <Section id="education" kicker="04" title="Education">
      <div className="border-b border-line pb-8">
        <h3 className="font-display text-xl text-ink">{entry.school}</h3>
        <p className="mt-1 text-ink-muted">{entry.degree}</p>
        <p className="mt-2 font-mono text-xs text-ink-faint">
          {entry.dates} · {entry.location}
        </p>
        <p className="mt-1 text-ink-muted">{entry.detail}</p>
      </div>

      <ul className="mt-8 space-y-4">
        {cv.certifications.map((certification) => (
          <li
            key={certification.name}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4"
          >
            <span className="text-ink">{certification.name}</span>
            {certification.detail ? (
              <span className="text-ink-muted">{certification.detail}</span>
            ) : null}
            <span className="ml-auto font-mono text-xs text-ink-faint">
              {certification.date}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-14">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Hack-A-Venture 2025 · 1st of 100+ teams
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto sm:grid sm:grid-cols-2 sm:overflow-visible">
          {gallery.map((image) => (
            <ZoomableImage
              key={image.alt}
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 640px) 25vw, 50vw"
              className="h-32 w-48 shrink-0 rounded-md border border-line sm:h-auto sm:w-full"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
