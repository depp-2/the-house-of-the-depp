import type { Research } from '@/types/database';

interface ResearchCardProps {
  research: Research;
}

export default function ResearchCard({ research }: ResearchCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-medium text-foreground">{research.title}</h3>
        {research.category && (
          <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-accent">
            {research.category}
          </span>
        )}
      </div>

      {research.description && (
        <p className="mt-2 text-sm text-muted line-clamp-2">{research.description}</p>
      )}

      {research.tech_stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {research.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded bg-muted px-2 py-0.5 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {research.github_url && (
        <a
          href={research.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-muted hover:text-accent transition-colors"
        >
          Code
        </a>
      )}
    </div>
  );
}
