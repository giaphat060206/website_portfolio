import { cv } from "@/data/cv";
import { projectImages } from "@/data/projectImages";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export function Projects() {
  return (
    <Section id="projects" kicker="03" title="Selected Projects">
      <div className="flex flex-col">
        {cv.projects.map((project, index) => (
          <Reveal key={project.slug}>
            <ProjectCard
              project={project}
              images={projectImages[project.slug]}
              index={index}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
