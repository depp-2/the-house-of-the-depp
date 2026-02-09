import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BlogPostSchema } from '@/components/StructuredData';

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

  const baseUrl = 'https://the-house-of-the-depp.vercel.app';
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`;
  const description = post.excerpt || post.content.slice(0, 160);

  return {
    title: post.title,
    description,
    keywords: [
      '기술 블로그',
      'Agentic Engineer',
      'AI',
      '개발',
      ...extractKeywords(post.content),
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      ...(post.published_at && { publishedTime: post.published_at }),
      url: `${baseUrl}/blog/${slug}`,
      siteName: 'the-house-of-the-depp',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Extract keywords from content
 */
function extractKeywords(content: string): string[] {
  const words = content
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  const sortedWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return sortedWords;
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

  const baseUrl = 'https://the-house-of-the-depp.vercel.app';
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`;
  const description = post.excerpt || post.content.slice(0, 160);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <BlogPostSchema
        title={post.title}
        description={description}
        datePublished={post.published_at || undefined}
        dateModified={post.published_at || undefined}
        url={`${baseUrl}/blog/${slug}`}
        imageUrl={ogImageUrl}
        authorName="depp"
      />

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
