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
    <Link href={`/blog/${post.slug}`} className="group block py-6 transition-colors hover:bg-accent/5">
      <article>
        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 text-sm text-muted line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          {formattedDate && (
            <time dateTime={post.published_at!}>
              {formattedDate}
            </time>
          )}
          {post.view_count > 0 && (
            <>
              <span>•</span>
              <span>{post.view_count.toLocaleString()} views</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
