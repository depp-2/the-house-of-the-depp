# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Admin panel for content management
- Search functionality
- Comments system
- Tag-based filtering
- RSS feed generation

## [0.2.0] - 2026-02-10

### Added
- 🌙 **Dark Mode Support**
  - ThemeProvider context for theme management
  - ThemeToggle component with light/dark/system options
  - localStorage persistence for user preference
  - Smooth theme transitions

- 🖼️ **OptimizedImage Component**
  - Automatic image optimization with Next.js Image
  - Loading states and error handling
  - Responsive sizes and quality optimization
  - AVIF/WebP format support

- 📊 **Cached Data Layer**
  - In-memory cache for Supabase queries
  - 5-minute TTL for automatic invalidation
  - Reduced API calls and improved performance

- 🎨 **Enhanced UI Components**
  - PostCard: View count display
  - ProjectCard: Featured badge, improved tech stack styling
  - ResearchCard: Category badge, improved tech stack styling
  - Header: Mobile responsive with hamburger menu, scroll shadow effect
  - Footer: Navigation links, improved layout

- 📈 **Homepage Improvements**
  - Gradient text hero section
  - Call-to-action buttons
  - Better empty state
  - Responsive grid layouts

- 🧩 **Templates**
  - `technical-deep-dive.md` - In-depth technical content
  - `quick-tips.md` - Actionable quick tips
  - `project-showcase.md` - Project documentation
  - `api-tutorial.md` - API integration guides

- 🔍 **SEO Enhancements**
  - Structured data (JSON-LD) components:
    - BlogPosting schema for articles
    - WebSite schema for homepage
    - Person schema for about page
    - BreadcrumbList for navigation
  - Automatic keyword extraction from content
  - Canonical URL support
  - Improved robots.txt configuration

- 📝 **Documentation**
  - Comprehensive README with:
    - Feature overview
    - Tech stack details
    - Installation guide
    - Database schema
    - API reference
    - Troubleshooting guide
  - CHANGELOG.md for version tracking
  - Updated templates README

### Changed
- **Next.js Config**
  - Removed deprecated `swcMinify` option (handled by default in v16)
  - Added image optimization settings
  - Added bundle optimization for lucide-react and supabase
  - Configured standalone output

- **Global Styles**
  - Added `.light` and `.dark` theme classes
  - Smooth color transitions
  - CSS variables for consistent theming

### Fixed
- TypeScript compilation errors in next.config.ts
- Build errors with deprecated Next.js options

### Performance
- Implemented code splitting by route
- Added image lazy loading
- Optimized font loading with next/font
- Reduced initial bundle size

## [0.1.0] - 2026-02-06

### Added
- 📝 **Blog System**
  - Markdown-based posts
  - Post list and detail pages
  - Excerpt support
  - Published date display

- 📊 **Portfolio**
  - Project showcase
  - Featured projects flag
  - Tech stack display
  - GitHub and demo links

- 🔬 **Research**
  - Research project showcase
  - Category filtering
  - Tech stack display
  - GitHub links

- 🔍 **SEO**
  - Sitemap generation (app/sitemap.ts)
  - Robots.txt configuration
  - Dynamic OG image API (app/api/og)
  - Open Graph tags
  - Twitter Card support

- 🎨 **UI Components**
  - Header with navigation
  - Footer with copyright
  - PostCard, ProjectCard, ResearchCard

- 📈 **View Tracking**
  - Supabase function: increment_view_count()
  - Automatic view counter
  - Page views table

- 🧩 **Post Templates**
  - `blog-post.md` - Standard posts
  - `tutorial.md` - How-to guides
  - `postmortem.md` - Retrospectives
  - `library-review.md` - Library reviews

### Tech Stack
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- TailwindCSS 4
- Supabase v2.95.0
- Lucide React icons

### Deployment
- Vercel automatic deployment
- GitHub CI/CD pipeline
