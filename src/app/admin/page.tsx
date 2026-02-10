'use client';

import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post, PostInsert, Project, ProjectInsert, Research, ResearchInsert } from '@/types/database';

type Tab = 'posts' | 'projects' | 'researches';

const inputClass = 'w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none';
const btnPrimary = 'rounded bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90';
const btnMuted = 'text-sm text-muted hover:text-foreground';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postForm, setPostForm] = useState<PostInsert>({ slug: '', title: '', content: '', excerpt: '', published_at: null });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<ProjectInsert>({ title: '', description: '', tech_stack: [], github_url: '', demo_url: '', image_url: '', featured: false });

  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [researchForm, setResearchForm] = useState<ResearchInsert>({ title: '', description: '', tech_stack: [], github_url: '', category: '' });

  // Fetch data when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(activeTab);
    }
  }, [isAuthenticated, activeTab]);

  // Fetch data on mount
  const fetchData = async (tab: Tab) => {
    setIsLoading(true);
    try {
      if (tab === 'posts') {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        setPosts(data ?? []);
      } else if (tab === 'projects') {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        setProjects(data ?? []);
      } else if (tab === 'researches') {
        const { data } = await supabase
          .from('researches')
          .select('*')
          .order('created_at', { ascending: false });
        setResearches(data ?? []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const password = e.currentTarget.password?.value || '';
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      fetchData(activeTab);
    } else {
      alert('Wrong password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  // Post handlers
  const resetPostForm = () => {
    setPostForm({ slug: '', title: '', content: '', excerpt: '', published_at: null });
    setEditingPost(null);
  };

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const payload: PostInsert = {
      slug: postForm.slug || `post-${Date.now()}`,
      title: postForm.title,
      content: postForm.content,
      excerpt: postForm.excerpt,
      published_at: postForm.published_at,
    };

    if (editingPost) {
      await supabase.from('posts').update(payload).eq('id', editingPost.id);
    } else {
      await supabase.from('posts').insert(payload);
    }

    resetPostForm();
    fetchData('posts');
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Delete this post?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchData('posts');
    }
  };

  // Project handlers
  const resetProjectForm = () => {
    setProjectForm({ title: '', description: '', tech_stack: [], github_url: '', demo_url: '', image_url: '', featured: false });
    setEditingProject(null);
  };

  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const payload: ProjectInsert = {
      title: projectForm.title,
      description: projectForm.description,
      tech_stack: projectForm.tech_stack,
      github_url: projectForm.github_url,
      demo_url: projectForm.demo_url,
      image_url: projectForm.image_url,
      featured: projectForm.featured,
    };

    if (editingProject) {
      await supabase.from('projects').update(payload).eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert(payload);
    }

    resetProjectForm();
    fetchData('projects');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchData('projects');
    }
  };

  // Research handlers
  const resetResearchForm = () => {
    setResearchForm({ title: '', description: '', tech_stack: [], github_url: '', category: '' });
    setEditingResearch(null);
  };

  const handleResearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const payload: ResearchInsert = {
      title: researchForm.title,
      description: researchForm.description,
      tech_stack: researchForm.tech_stack,
      github_url: researchForm.github_url,
      category: researchForm.category,
    };

    if (editingResearch) {
      await supabase.from('researches').update(payload).eq('id', editingResearch.id);
    } else {
      await supabase.from('researches').insert(payload);
    }

    resetResearchForm();
    fetchData('researches');
  };

  const handleDeleteResearch = async (id: string) => {
    if (confirm('Delete this research?')) {
      await supabase.from('researches').delete().eq('id', id);
      fetchData('researches');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-sm px-6 py-32">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
          />
          <button type="submit" className={btnPrimary}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <button onClick={handleLogout} className={btnMuted}>
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-4 border-b border-border pb-4">
        {(['posts', 'projects', 'researches'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); }}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'border-b border-accent text-accent' : 'text-muted hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'posts' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Posts</h2>
            <button
              onClick={resetPostForm}
              className={btnPrimary}
            >
              New Post
            </button>
          </div>

          {editingPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-8">
              <form onSubmit={handlePostSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
                <h3 className="text-lg font-bold mb-4">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h3>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                      type="text"
                      defaultValue={editingPost.slug}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      defaultValue={editingPost.title}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <textarea
                      defaultValue={editingPost.excerpt || ''}
                      disabled
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetPostForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {!editingPost && (
            <form onSubmit={handlePostSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-4">New Post</h3>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={postForm.slug}
                    onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      className={inputClass}
                      required
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <textarea
                      value={postForm.excerpt || ''}
                      onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Published At</label>
                    <input
                      type="datetime-local"
                      value={postForm.published_at || ''}
                      onChange={(e) => setPostForm({ ...postForm, published_at: e.target.value ? e.target.value : null })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetPostForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>

          {isLoading ? <p className="text-center text-muted">Loading...</p> : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 text-xs text-muted">/{post.slug}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">
                      {post.published_at ? `Published` : 'Draft'}
                    </span>
                    <button onClick={() => setEditingPost(post)} className="text-sm text-muted hover:text-accent">
                      Edit
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className="text-sm text-red-500 hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Projects</h2>
            <button
              onClick={resetProjectForm}
              className={btnPrimary}
            >
              New Project
            </button>
          </div>

          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-8">
              <form onSubmit={handleProjectSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
                <h3 className="text-lg font-bold mb-4">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h3>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      defaultValue={editingProject.title}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      defaultValue={editingProject.description || ''}
                      disabled
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, etc."
                      defaultValue={editingProject.tech_stack?.join(', ')}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub URL</label>
                      <input
                        type="url"
                        defaultValue={editingProject.github_url || ''}
                        disabled
                        className={inputClass}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Demo URL</label>
                      <input
                        type="url"
                        defaultValue={editingProject.demo_url || ''}
                        disabled
                        className={inputClass}
                        placeholder="https://demo.example.com"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium mb-1">
                      <input
                        type="checkbox"
                        defaultChecked={editingProject.featured}
                        disabled
                        className="h-4 w-4"
                      />
                      Featured
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetProjectForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {!editingProject && (
            <form onSubmit={handleProjectSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-4">New Project</h3>

              <div className="space-y-2">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={projectForm.description || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, etc."
                      value={projectForm.tech_stack}
                      onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value.split(',').map(t => t.trim()) })}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={projectForm.github_url}
                        onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                        placeholder="https://github.com/username/repo"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Demo URL</label>
                      <input
                        type="url"
                        value={projectForm.demo_url}
                        onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })}
                        placeholder="https://demo.example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium mb-1">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Featured
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetProjectForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>

          {isLoading ? <p className="text-center text-muted">Loading...</p> : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium">{project.title}</span>
                    {project.featured && (
                      <span className="ml-2 text-xs text-accent">Featured</span>
                    )}
                  </div>
                  <div className="text-xs text-muted">
                    {project.tech_stack?.join(', ') || 'No tech stack'}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-accent"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-accent"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingProject(project)} className="text-sm text-muted hover:text-accent">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProject(project.id)} className="text-sm text-red-500 hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'researches' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Research</h2>
            <button
              onClick={resetResearchForm}
              className={btnPrimary}
            >
              New Research
            </button>
          </div>

          {editingResearch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-8">
              <form onSubmit={handleResearchSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
                <h3 className="text-lg font-bold mb-4">
                  {editingResearch ? 'Edit Research' : 'New Research'}
                </h3>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      defaultValue={editingResearch.title}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      defaultValue={editingResearch.description || ''}
                      disabled
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, etc."
                      defaultValue={editingResearch.tech_stack?.join(', ')}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="experiment, prototype, paper"
                      defaultValue={editingResearch.category || ''}
                      disabled
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub URL</label>
                    <input
                      type="url"
                      defaultValue={editingResearch.github_url || ''}
                      disabled
                      className={inputClass}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetResearchForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {!editingResearch && (
            <form onSubmit={handleResearchSubmit} className="space-y-3 max-w-md w-full rounded border border-border p-6 bg-card">
              <h3 className="text-lg font-bold mb-4">New Research</h3>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                    type="text"
                      value={researchForm.title}
                      onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={researchForm.description || ''}
                      onChange={(e) => setResearchForm({ ...researchForm, description: e.target.value })}
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, etc."
                      value={researchForm.tech_stack}
                      onChange={(e) => setResearchForm({ ...researchForm, tech_stack: e.target.value.split(',').map(t => t.trim()) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="experiment, prototype, paper"
                      value={researchForm.category}
                      onChange={(e) => setResearchForm({ ...researchForm, category: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={researchForm.github_url}
                      onChange={(e) => setResearchForm({ ...researchForm, github_url: e.target.value })}
                      placeholder="https://github.com/username/repo"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetResearchForm} className={btnMuted}>
                    Cancel
                  </button>
                  <button type="submit" className={btnPrimary}>
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>

          {isLoading ? <p className="text-center text-muted">Loading...</p> : (
            <div className="divide-y divide-border">
              {researches.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium">{r.title}</span>
                    {r.category && (
                      <span className="ml-2 text-xs text-accent">{r.category}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted">
                    {r.tech_stack?.join(', ') || 'No tech stack'}
                  </div>
                  <div className="flex items-center gap-3">
                    {r.github_url && (
                      <a
                        href={r.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-accent"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingResearch(r)} className="text-sm text-muted hover:text-accent">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteResearch(r.id)} className="text-sm text-red-500 hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
