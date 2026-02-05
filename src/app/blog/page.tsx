import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';

export const metadata: Metadata = {
  title: 'Blog',
};

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });
  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="mt-2 text-sm text-muted">생각과 경험을 기록합니다.</p>

      <div className="mt-8 divide-y divide-border">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="py-8 text-sm text-muted">아직 작성된 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
