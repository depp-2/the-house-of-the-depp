'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post, PostInsert, Project, ProjectInsert } from '@/types/database';

type Tab = 'posts' | 'projects';

const inputClass = 'w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none';
const btnPrimary = 'rounded bg-accent px-4 py-2 text-sm font-medium text-background';
const btnMuted = 'text-sm text-muted hover:text-foreground';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Wrong password');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    if (activeTab === 'posts') {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data ?? []);
    } else {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      setProjects(data ?? []);
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-sm px-6 py-32">
        <h1 className="mb-6 text-lg font-bold">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} />
          <button type="submit" className={btnPrimary + ' w-full'}>Login</button>
        </form>
        <p className="mt-3 text-xs text-muted">Demo: &quot;admin&quot;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-lg font-bold">Admin</h1>
        <button onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthenticated(false); }} className={btnMuted}>
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-4 border-b border-border">
        {(['posts', 'projects'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium capitalize ${activeTab === tab ? 'border-b border-accent text-accent' : 'text-muted'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'posts' ? (
        <PostsManager posts={posts} isLoading={isLoading} onRefresh={fetchData} editingPost={editingPost} setEditingPost={setEditingPost} />
      ) : (
        <ProjectsManager projects={projects} isLoading={isLoading} onRefresh={fetchData} editingProject={editingProject} setEditingProject={setEditingProject} />
      )}
    </div>
  );
}

function PostsManager({ posts, isLoading, onRefresh, editingPost, setEditingPost }: {
  posts: Post[]; isLoading: boolean; onRefresh: () => void;
  editingPost: Post | null; setEditingPost: (p: Post | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PostInsert>({ slug: '', title: '', content: '', excerpt: '', published_at: null });

  useEffect(() => {
    if (editingPost) { setFormData(editingPost); setShowForm(true); }
  }, [editingPost]);

  const reset = () => { setShowForm(false); setEditingPost(null); setFormData({ slug: '', title: '', content: '', excerpt: '', published_at: null }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { slug: formData.slug, title: formData.title, content: formData.content, excerpt: formData.excerpt, published_at: formData.published_at };
    if (editingPost) {
      await supabase.from('posts').update(payload).eq('id', editingPost.id);
    } else {
      await supabase.from('posts').insert(payload);
    }
    reset(); onRefresh();
  };

  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await supabase.from('posts').delete().eq('id', id); onRefresh(); } };
  const handlePublish = async (post: Post) => {
    await supabase.from('posts').update({ published_at: post.published_at ? null : new Date().toISOString() }).eq('id', post.id);
    onRefresh();
  };

  return (
    <div>
      <button onClick={() => { showForm ? reset() : setShowForm(true); }} className={btnPrimary + ' mb-6'}>
        {showForm ? 'Cancel' : 'New Post'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded border border-border p-4">
          <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="slug" className={inputClass} required />
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className={inputClass} required />
          <input type="text" value={formData.excerpt ?? ''} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Excerpt" className={inputClass} />
          <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Content" rows={8} className={inputClass} required />
          <button type="submit" className={btnPrimary}>{editingPost ? 'Update' : 'Create'}</button>
        </form>
      )}

      {isLoading ? <p className="text-sm text-muted">Loading...</p> : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm font-medium">{post.title}</span>
                <span className="ml-2 text-xs text-muted">/{post.slug}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={post.published_at ? 'text-accent' : 'text-muted'}>{post.published_at ? 'Live' : 'Draft'}</span>
                <button onClick={() => handlePublish(post)} className={btnMuted}>{post.published_at ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => setEditingPost(post)} className={btnMuted}>Edit</button>
                <button onClick={() => handleDelete(post.id)} className="text-sm text-red-500">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsManager({ projects, isLoading, onRefresh, editingProject, setEditingProject }: {
  projects: Project[]; isLoading: boolean; onRefresh: () => void;
  editingProject: Project | null; setEditingProject: (p: Project | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const emptyForm: ProjectInsert = { title: '', description: '', tech_stack: [], github_url: '', demo_url: '', image_url: '', featured: false };
  const [formData, setFormData] = useState<ProjectInsert>(emptyForm);
  const [techInput, setTechInput] = useState('');

  useEffect(() => { if (editingProject) { setFormData(editingProject); setShowForm(true); } }, [editingProject]);

  const reset = () => { setShowForm(false); setEditingProject(null); setFormData(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: formData.title, description: formData.description, tech_stack: formData.tech_stack, github_url: formData.github_url, demo_url: formData.demo_url, image_url: formData.image_url, featured: formData.featured };
    if (editingProject) {
      await supabase.from('projects').update(payload).eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert(payload);
    }
    reset(); onRefresh();
  };

  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await supabase.from('projects').delete().eq('id', id); onRefresh(); } };

  const addTech = () => { if (techInput.trim()) { setFormData({ ...formData, tech_stack: [...(formData.tech_stack || []), techInput.trim()] }); setTechInput(''); } };
  const removeTech = (i: number) => { setFormData({ ...formData, tech_stack: formData.tech_stack?.filter((_, idx) => idx !== i) }); };

  return (
    <div>
      <button onClick={() => { showForm ? reset() : setShowForm(true); }} className={btnPrimary + ' mb-6'}>
        {showForm ? 'Cancel' : 'New Project'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded border border-border p-4">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className={inputClass} required />
          <textarea value={formData.description ?? ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} className={inputClass} />
          <div>
            <div className="flex gap-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add tech" className={inputClass} />
              <button type="button" onClick={addTech} className="shrink-0 rounded border border-border px-3 py-2 text-sm text-muted">Add</button>
            </div>
            {formData.tech_stack && formData.tech_stack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.tech_stack.map((tech, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs text-muted">
                    {tech}<button type="button" onClick={() => removeTech(i)} className="hover:text-foreground">x</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="url" value={formData.github_url ?? ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} placeholder="GitHub URL" className={inputClass} />
            <input type="url" value={formData.demo_url ?? ''} onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })} placeholder="Demo URL" className={inputClass} />
          </div>
          <input type="url" value={formData.image_url ?? ''} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Image URL" className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={formData.featured ?? false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
            Featured
          </label>
          <button type="submit" className={btnPrimary}>{editingProject ? 'Update' : 'Create'}</button>
        </form>
      )}

      {isLoading ? <p className="text-sm text-muted">Loading...</p> : (
        <div className="divide-y divide-border">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm font-medium">{project.title}</span>
                {project.featured && <span className="ml-2 text-xs text-accent">featured</span>}
                <span className="ml-2 text-xs text-muted">{project.tech_stack?.join(', ')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button onClick={() => setEditingProject(project)} className={btnMuted}>Edit</button>
                <button onClick={() => handleDelete(project.id)} className="text-sm text-red-500">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
