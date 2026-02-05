import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Portfolio',
};

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      <p className="mt-2 text-sm text-muted">만들어온 것들.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-sm text-muted">아직 등록된 프로젝트가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
