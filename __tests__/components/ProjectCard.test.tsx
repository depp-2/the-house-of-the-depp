import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Project } from '@/types/database';
import ProjectCard from '@/components/ProjectCard';

describe('ProjectCard Component', () => {
  const mockProject: Project = {
    id: '1',
    title: 'Test Project',
    description: 'A test project description.',
    tech_stack: ['React', 'TypeScript', 'Next.js'],
    github_url: 'https://github.com/test/repo',
    demo_url: 'https://demo.example.com',
    image_url: 'https://example.com/image.jpg',
    featured: true,
    created_at: '2026-02-10T00:00:00Z',
  };

  it('renders project title', () => {
    render(<ProjectCard project={mockProject} />);
    const title = screen.getByText('Test Project');
    expect(title).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} />);
    const description = screen.getByText('A test project description.');
    expect(description).toBeInTheDocument();
  });

  it('renders tech stack items', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('renders featured badge when featured', () => {
    render(<ProjectCard project={mockProject} />);
    const badge = screen.getByText(/featured/i);
    expect(badge).toBeInTheDocument();
  });

  it('does not render featured badge when not featured', () => {
    const nonFeaturedProject: Project = { ...mockProject, featured: false };
    render(<ProjectCard project={nonFeaturedProject} />);
    expect(screen.queryByText(/featured/i)).not.toBeInTheDocument();
  });

  it('renders GitHub link when github_url exists', () => {
    render(<ProjectCard project={mockProject} />);
    const githubLink = screen.getByText(/code/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/repo');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders Demo link when demo_url exists', () => {
    render(<ProjectCard project={mockProject} />);
    const demoLink = screen.getByText(/demo/i);
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute('href', 'https://demo.example.com');
    expect(demoLink).toHaveAttribute('target', '_blank');
  });

  it('renders tech stack with proper styling', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    const techItems = container.querySelectorAll('[data-testid^="tech-"]');
    techItems.forEach(item => {
      expect(item).toHaveClass('rounded', 'bg-muted', 'px-2', 'py-0.5');
    });
  });
});
