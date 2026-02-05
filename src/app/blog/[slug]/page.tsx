import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();
  return data;
}

async function incrementViewCount(slug: string) {
  await supabase.rpc('increment_view_count', { post_slug: slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  incrementViewCount(slug);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-sm text-muted hover:text-accent">
        &larr; Blog
      </Link>

      <header className="mt-8 mb-12">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="mt-3 flex gap-3 text-sm text-muted">
          {formattedDate && <time dateTime={post.published_at!}>{formattedDate}</time>}
          <span>{post.view_count.toLocaleString()} views</span>
        </div>
      </header>

      <div className="prose">
        {post.content.split('\n').map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          if (paragraph.startsWith('# ')) return <h1 key={index}>{paragraph.slice(2)}</h1>;
          if (paragraph.startsWith('## ')) return <h2 key={index}>{paragraph.slice(3)}</h2>;
          if (paragraph.startsWith('### ')) return <h3 key={index}>{paragraph.slice(4)}</h3>;
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
    </article>
  );
}
