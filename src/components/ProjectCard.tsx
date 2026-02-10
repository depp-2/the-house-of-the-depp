import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50">
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-background">
          Featured
        </div>
      )}

      {/* Image */}
      {project.image_url && (
        <Link
          href={project.demo_url || project.github_url || '#'}
          className="relative aspect-video overflow-hidden bg-muted"
        >
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-2 text-sm text-muted line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                data-testid={`tech-${index}`}
                className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-4 flex gap-2">
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-accent hover:text-background"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Code
            </Link>
          )}
          {project.demo_url && (
            <Link
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-accent hover:text-background"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Demo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
