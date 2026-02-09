import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import ProjectCard from '@/components/ProjectCard';
import { ArrowRight } from 'lucide-react';

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
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="space-y-6">
          <h1 className="bg-gradient-to-r from-foreground to-muted bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Agentic Engineer
          </h1>
          <p className="text-lg text-muted md:text-xl">
            AI와 소프트웨어 개발의 교차점에서 에이전트 기반 시스템을
            탐구합니다.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90"
            >
              블로그 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/5 hover:text-foreground"
            >
              포트폴리오
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {posts.length > 0 && (
        <section className="py-8">
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold">최근 포스트</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
            >
              모든 포스트
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="py-8">
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold">추천 프로젝트</h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
            >
              모든 프로젝트
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && projects.length === 0 && (
        <section className="py-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <p className="text-lg text-muted">
              아직 포스트나 프로젝트가 없습니다.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent/90"
            >
              첫 포스트 작성하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
