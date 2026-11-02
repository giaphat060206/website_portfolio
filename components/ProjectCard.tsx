import Image from "next/image";
import type { Project } from "@/data/cv";
import type { ProjectImage } from "@/data/projectImages";

type ProjectCardProps = { project: Project; images?: ProjectImage[] };

export function ProjectCard({ project, images }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-accent/40">
      {images && images.length > 0 ? (
        <div
          className={`grid gap-px bg-line ${
            images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="aspect-[4/3] w-full object-cover"
            />
          ))}
        </div>
      ) : null}
      <div className="p-6">
        <h3 className="font-display text-2xl text-ink">{project.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-faint">
          {project.role}
        </p>
        <ul className="mt-5 space-y-3 text-ink-muted">
          {project.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded border border-line px-2 py-1 font-mono text-[11px] text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-4 text-sm">
          <a
            href={project.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Source
          </a>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
