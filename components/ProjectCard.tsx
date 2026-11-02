import type { Project } from "@/data/cv";
import type { ProjectImage } from "@/data/projectImages";
import { Filmstrip } from "@/components/Filmstrip";

type ProjectCardProps = {
  project: Project;
  images?: ProjectImage[];
  index: number;
};

export function ProjectCard({ project, images, index }: ProjectCardProps) {
  return (
    <article
      id={project.slug}
      className="grid gap-8 border-t border-line py-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:py-20"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-display text-3xl text-ink">{project.title}</h3>
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

      {images && images.length > 0 ? (
        <div className="min-w-0 md:self-center">
          <Filmstrip images={images} label={project.title} />
        </div>
      ) : null}
    </article>
  );
}
