import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Post } from '@/types/database';
import PostCard from '@/components/PostCard';

describe('PostCard Component', () => {
  const mockPost: Post = {
    id: '1',
    slug: 'test-post',
    title: 'Test Post Title',
    content: 'This is a test post.',
    excerpt: 'This is a test excerpt.',
    published_at: '2026-02-10T00:00:00Z',
    view_count: 42,
    created_at: '2026-02-10T00:00:00Z',
  };

  it('renders post title', () => {
    render(<PostCard post={mockPost} />);
    const title = screen.getByText('Test Post Title');
    expect(title).toBeInTheDocument();
  });

  it('renders post excerpt', () => {
    render(<PostCard post={mockPost} />);
    const excerpt = screen.getByText('This is a test excerpt.');
    expect(excerpt).toBeInTheDocument();
  });

  it('renders view count when > 0', () => {
    render(<PostCard post={mockPost} />);
    const viewCount = screen.getByText(/42 views/i);
    expect(viewCount).toBeInTheDocument();
  });

  it('renders published date', () => {
    render(<PostCard post={mockPost} />);
    const date = screen.getByText(/2026/i);
    expect(date).toBeInTheDocument();
  });

  it('does not render view count when 0', () => {
    const postWithoutViews: Post = { ...mockPost, view_count: 0 };
    render(<PostCard post={postWithoutViews} />);
    expect(screen.queryByText(/views/i)).not.toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    const { container } = render(<PostCard post={mockPost} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('has correct CSS classes for hover effect', () => {
    const { container } = render(<PostCard post={mockPost} />);
    const titleElement = screen.getByText('Test Post Title');
    expect(titleElement).toHaveClass('group-hover:text-accent');
  });
});

