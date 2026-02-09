# the-house-of-the-depp

A personal blog built with Next.js 16, React 19, and Supabase.

## Tech Stack

- **Frontend:** Next.js 16.1.6 + React 19.2.3
- **Styling:** TailwindCSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Deployment:** Vercel (GitHub → Vercel CI/CD)

## Features

- 📝 Blog posts with markdown content
- 🔍 SEO-optimized (sitemap, robots.txt, OG images)
- 📊 View tracking with Supabase
- 📂 Portfolio and research sections
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 22+
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lightwater2/the-house-of-the-depp
cd the-house-of-the-depp
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. Set up Supabase database:
```bash
# Apply the schema
psql -h <your-db-host> -U postgres -d postgres < supabase-schema.sql
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Creating a New Post

### Using the New Post Script

The project includes a script to create posts from templates:

```bash
node scripts/new-post.js <template> <slug> <title>
```

Available templates:
- `blog-post` - Standard blog post
- `tutorial` - Technical tutorial with steps
- `postmortem` - Project retrospective

Example:
```bash
node scripts/new-post.js blog-post my-new-post "My New Post"
```

This creates `my-new-post.md` with the template pre-filled.

### Manual Post Creation

1. Create a markdown file with your content
2. Create an insert script (based on `insert-first-post.js`)
3. Run the script to insert into Supabase

## Database Schema

### Posts Table
- `id` - Primary key
- `slug` - URL-friendly identifier
- `title` - Post title
- `excerpt` - Short description
- `content` - Full markdown content
- `published_at` - Publication date
- `view_count` - View counter
- `created_at` - Creation timestamp

### Projects Table
- `id` - Primary key
- `title` - Project name
- `description` - Short description
- `tech_stack` - JSON array of technologies
- `github_url` - GitHub repository
- `demo_url` - Live demo link
- `image_url` - Cover image
- `featured` - Featured flag
- `created_at` - Creation timestamp

### Functions
- `increment_view_count(post_slug)` - Increments view count for a post

## Project Structure

```
the-house-of-the-depp/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── blog/        # Blog pages
│   │   ├── portfolio/   # Portfolio pages
│   │   └── research/    # Research pages
│   ├── components/      # React components
│   └── lib/             # Utilities
├── templates/           # Blog post templates
├── scripts/             # Utility scripts
└── supabase/           # Supabase configuration
```

## Templates

The `templates/` directory contains standardized templates:

- **blog-post.md** - General blog posts
- **tutorial.md** - Step-by-step technical guides
- **postmortem.md** - Project retrospectives

See `templates/README.md` for detailed usage instructions.

## Deployment

This project is automatically deployed to Vercel via GitHub integration.

1. Push changes to GitHub
2. Vercel automatically builds and deploys
3. Changes go live on the production domain

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create a new component in `src/components/`
2. Add pages in `src/app/`
3. Update Supabase schema if needed
4. Test locally before committing

## Contributing

This is a personal blog, but suggestions and improvements are welcome!

## License

MIT

---

Built with ❤️ by 뎁
