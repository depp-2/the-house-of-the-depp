import Link from 'next/link';
import type { Post } from '@/types/database';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-medium text-foreground group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        {formattedDate && (
          <time className="shrink-0 text-sm text-muted" dateTime={post.published_at!}>
            {formattedDate}
          </time>
        )}
      </div>
      {post.excerpt && (
        <p className="mt-1 text-sm text-muted line-clamp-1">{post.excerpt}</p>
      )}
    </Link>
  );
}
