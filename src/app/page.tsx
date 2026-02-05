import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import ProjectCard from '@/components/ProjectCard';

async function getLatestPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(5);
  return data ?? [];
}

async function getFeaturedProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3);
  return data ?? [];
}

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getLatestPosts(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="py-12">
        <h1 className="text-2xl font-bold">Agentic Engineer</h1>
        <p className="mt-3 text-muted">
          AI와 소프트웨어 개발의 교차점에서 에이전트 기반 시스템을 탐구합니다.
        </p>
      </section>

      {posts.length > 0 && (
        <section className="py-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Recent Posts</h2>
            <Link href="/blog" className="text-sm text-muted hover:text-accent">
              all posts
            </Link>
          </div>
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="py-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Projects</h2>
            <Link href="/portfolio" className="text-sm text-muted hover:text-accent">
              all projects
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && projects.length === 0 && (
        <section className="py-8 text-sm text-muted">
          <p>Supabase를 연결하고 <Link href="/admin" className="text-accent">Admin</Link>에서 글을 작성해보세요.</p>
        </section>
      )}
    </div>
  );
}
