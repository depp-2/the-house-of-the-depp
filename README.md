# the-house-of-the-depp

A personal blog built with Next.js 16, React 19, and Supabase.

## 🚀 Features

### Content Management
- 📝 **Blog Posts** - Markdown-based content with automatic excerpt
- 📊 **Portfolio** - Project showcase with featured projects
- 🔬 **Research** - Technical research and experiments
- 📈 **View Tracking** - Automatic view count via Supabase function

### SEO & Performance
- 🎯 **SEO Optimized** - Sitemap, robots.txt, structured data (JSON-LD)
- 🖼️ **Dynamic OG Images** - Custom social preview images for each post
- ⚡ **Performance** - Image optimization, bundle splitting, caching
- ♿ **Accessible** - ARIA labels, keyboard navigation, semantic HTML

### UI/UX
- 🎨 **Dark Mode** - Light/Dark/System theme support with smooth transitions
- 📱 **Responsive** - Mobile-first design with hamburger menu
- 🔒 **Type-safe** - Full TypeScript support with generated types
- ✨ **Modern Stack** - Next.js 16, React 19, TailwindCSS 4

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - Latest React features
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Utility-first CSS
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL, Auth, Realtime, Edge Functions
- **@supabase/supabase-js v2.95.0** - Supabase client

### Development
- **ESLint** - Code linting
- **Turbopack** - Next.js bundler (beta)

### Deployment
- **Vercel** - Serverless deployment with CI/CD
- **GitHub Actions** - Automated builds and deploys

## 📦 Installation

### Prerequisites

- Node.js 22+ (tested with v22.22.0)
- npm or yarn or pnpm
- Supabase account (free tier works)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/lightwater2/the-house-of-the-depp
cd the-house-of-the-depp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
nano .env  # or use your preferred editor
```

Required environment variables:
```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup

```bash
# Apply Supabase schema
psql -h <your-db-host> -U postgres -d postgres < supabase-schema.sql

# Or use the Supabase dashboard > SQL Editor
# Copy and paste the contents of supabase-schema.sql
```

### Running Locally

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 📝 Creating Content

### Using Templates

The project includes post templates for consistent structure:

```bash
# Copy a template
cp templates/blog-post.md my-new-post.md
cp templates/tutorial.md my-tutorial.md
cp templates/postmortem.md my-retrospective.md
cp templates/library-review.md my-review.md
cp templates/technical-deep-dive.md my-deep-dive.md
cp templates/quick-tips.md my-tip.md
cp templates/project-showcase.md my-showcase.md
cp templates/api-tutorial.md my-api-guide.md
```

### Inserting Posts into Database

After creating a markdown file:

```bash
# Create an insert script (based on insert-first-post.js)
node scripts/insert-post.js my-new-post.md

# Or use the admin panel when available
```

### Post Structure

```markdown
# Post Title

## Summary (Excerpt)
One or two sentences describing the post.

## Published Date
2026-02-10

## Tags
tag1, tag2, tag3

---

## Introduction

Your content here...

## Conclusion

Summary and takeaways.
```

## 🗄️ Database Schema

### `posts` Table

| Column | Type | Description |
|---------|-------|-------------|
| `id` | uuid | Primary key (auto-generated) |
| `slug` | text | URL-friendly identifier (unique) |
| `title` | text | Post title |
| `content` | text | Full markdown content |
| `excerpt` | text? | Short description for cards/meta |
| `published_at` | timestamp? | Publication date (null = draft) |
| `view_count` | integer | View counter (default: 0) |
| `created_at` | timestamp | Creation timestamp |

### `projects` Table

| Column | Type | Description |
|---------|-------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Project name |
| `description` | text? | Short description |
| `tech_stack` | text[] | Array of technologies |
| `github_url` | text? | GitHub repository URL |
| `demo_url` | text? | Live demo URL |
| `image_url` | text? | Cover image URL |
| `featured` | boolean | Featured flag |
| `created_at` | timestamp | Creation timestamp |

### `researches` Table

| Column | Type | Description |
|---------|-------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Research title |
| `description` | text? | Short description |
| `tech_stack` | text[] | Array of technologies |
| `github_url` | text? | GitHub repository URL |
| `category` | text? | Research category |
| `created_at` | timestamp | Creation timestamp |

### `page_views` Table

| Column | Type | Description |
|---------|-------|-------------|
| `id` | uuid | Primary key |
| `path` | text | Page path |
| `created_at` | timestamp | View timestamp |

### Supabase Functions

#### `increment_view_count(post_slug)`

Automatically increments the view count for a post.

**Usage:**
```typescript
await supabase.rpc('increment_view_count', { post_slug: 'my-post' });
```

## 🏗️ Project Structure

```
the-house-of-the-depp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── og/         # OG image generation
│   │   ├── blog/              # Blog pages
│   │   │   └── [slug]/      # Dynamic blog post pages
│   │   ├── portfolio/         # Portfolio pages
│   │   ├── research/          # Research pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin panel
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── robots.ts          # SEO: robots.txt
│   │   └── sitemap.ts         # SEO: sitemap.xml
│   ├── components/             # React components
│   │   ├── Header.tsx         # Site navigation
│   │   ├── Footer.tsx         # Site footer
│   │   ├── PostCard.tsx       # Blog post card
│   │   ├── ProjectCard.tsx     # Project card
│   │   ├── ResearchCard.tsx    # Research card
│   │   ├── ThemeToggle.tsx     # Dark mode toggle
│   │   ├── Skeleton.tsx        # Loading placeholder
│   │   ├── OptimizedImage.tsx # Image with optimization
│   │   └── StructuredData.tsx # JSON-LD schema
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts        # Supabase client
│   │   ├── cached-data.ts     # Data fetching with cache
│   │   └── theme.tsx          # Theme context
│   └── types/                 # TypeScript types
│       └── database.ts         # Supabase generated types
├── templates/                  # Post templates
│   ├── README.md              # Template guide
│   ├── blog-post.md          # Standard post
│   ├── tutorial.md            # How-to guides
│   ├── postmortem.md         # Retrospectives
│   ├── library-review.md       # Library reviews
│   ├── technical-deep-dive.md # Deep technical content
│   ├── quick-tips.md         # Quick tips
│   ├── project-showcase.md    # Project showcases
│   └── api-tutorial.md       # API tutorials
├── scripts/                    # Utility scripts
│   ├── analyze-bundle.js       # Bundle analyzer
│   └── bundle-size-check.sh   # Post-build size check
├── public/                     # Static assets
│   ├── .htaccess             # Performance/security headers
│   └── [images, fonts, etc.]
├── supabase/                   # Supabase config
│   └── schema.sql            # Database schema
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── .env.example               # Environment variables template
└── README.md                 # This file
```

## 🧪 Available Scripts

### Development
```bash
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Analysis
```bash
npm run analyze    # Analyze bundle (requires ANALYZE=true)
```

### Custom Scripts
```bash
./scripts/bundle-size-check.sh  # Check bundle sizes (run after build)
node scripts/analyze-bundle.js    # Manual bundle analysis
```

## 🚀 Deployment

### Automatic Deployment (Vercel)

This project uses Vercel for automatic deployment from GitHub:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Automatic Build**
   - Vercel detects the push
   - Runs `npm run build`
   - Deploys to production URL

3. **Access Your Site**
   - Production: `https://the-house-of-the-depp.vercel.app`
   - Preview URLs available for each PR

### Environment Variables on Vercel

Set these in Vercel dashboard > Project Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔧 Configuration

### Next.js (next.config.ts)

- **Image Optimization** - AVIF/WebP formats, responsive sizes
- **Bundle Optimization** - Package imports optimization for lucide-react, supabase
- **Compression** - Gzip/Brotli enabled
- **Bundle Analyzer** - Available via `npm run analyze`

### TailwindCSS (globals.css)

- **Custom Properties** - CSS variables for theming
- **Dark Mode** - `.dark` class for color scheme
- **Typography** - Geist Sans & Geist Mono fonts

## 🧪 Performance

### Current Status

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 200KB gzipped for initial JS
- **FCP**: < 1.0s
- **LCP**: < 2.0s
- **TTFB**: < 300ms

### Optimization Techniques Used

1. **Code Splitting** - Automatic route-based splitting
2. **Image Optimization** - Next.js Image component with WebP/AVIF
3. **Font Optimization** - Google Fonts with `next/font`
4. **Tree Shaking** - Unused code elimination
5. **Caching** - In-memory cache for Supabase queries
6. **Lazy Loading** - Dynamic imports where beneficial

## 🐛 Troubleshooting

### Build Errors

**"Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Regenerate types
npx supabase gen typescript --linked > src/types/database.ts
```

### Database Issues

**Connection refused**
- Check `NEXT_PUBLIC_SUPABASE_URL` in `.env`
- Verify Supabase project is active
- Check service role key permissions

**"relation does not exist"**
- Run `supabase-schema.sql` in Supabase SQL Editor
- Check table names match schema

### Deployment Issues

**Build fails on Vercel**
- Check Node.js version (requires v22+)
- Verify all env variables are set
- Check build logs in Vercel dashboard

**"404 on deploy"**
- Verify `next.config.ts` settings
- Check `baseURL` in Vercel settings
- Ensure `output: 'standalone'` works with your setup

## 🔒 Security

- **No exposed secrets** - Service role key is server-side only
- **SQL Injection Protection** - Supabase RLS policies
- **CORS Configured** - Proper cross-origin handling
- **Security Headers** - .htaccess with security headers
- **Input Validation** - TypeScript prevents invalid data types

## 🔧 API Reference

### Supabase Client

```typescript
import { supabase } from '@/lib/supabase';

// Fetch posts
const { data } = await supabase
  .from('posts')
  .select('*')
  .order('published_at', { ascending: false });

// Increment view count
await supabase.rpc('increment_view_count', { post_slug: 'my-post' });
```

### Cached Data Fetching

```typescript
import { getPosts, getPostBySlug } from '@/lib/cached-data';

// Fetch with automatic caching (5 minute TTL)
const posts = await getPosts({ limit: 10 });
const post = await getPostBySlug('my-post');
```

## 🤝 Contributing

This is a personal blog, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Coding Standards

- Use TypeScript for all new code
- Follow ESLint rules
- Write tests for new features
- Update documentation

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## 📄 License

MIT License - feel free to use this code for your own projects.

## 👤 Author

**뎁** - Agentic Engineer

- GitHub: [@lightwater2](https://github.com/lightwater2)
- Blog: [the-house-of-the-depp](https://the-house-of-the-depp.vercel.app)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with 🔄 and AI automation
