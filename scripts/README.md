# Utility Scripts

This directory contains helpful utility scripts for the-house-of-the-depp project.

## Available Scripts

### Content Management

#### `new-post.js`
Create a new blog post from a template.

```bash
npm run post:new blog-post my-new-post "My New Post"
```

**Templates:**
- `blog-post` - Standard blog post
- `tutorial` - Technical tutorial
- `postmortem` - Project retrospective
- `library-review` - Library/framework review
- `technical-deep-dive` - In-depth technical content
- `quick-tips` - Quick tips and tricks
- `project-showcase` - Project documentation
- `api-tutorial` - API integration guide

#### `insert-post.js`
Insert a markdown post into the Supabase database.

```bash
npm run post:insert my-new-post.md
```

Parses frontmatter, generates slug from title, and inserts into the `posts` table.

### Database

#### `backup-db.js`
Backup all database tables to JSON files.

```bash
npm run db:backup
```

Creates a timestamped backup in the `backups/` directory with:
- `posts.json` - All posts
- `projects.json` - All projects
- `researches.json` - All research
- `metadata.json` - Backup metadata

### Development

#### `dev-helper.sh`
Unified development helper script with multiple commands.

```bash
npm run dev:helper clean    # Clean cache
npm run dev:helper test     # Run tests
npm run dev:helper lint     # Run linter
npm run dev:helper build    # Build project
npm run dev:helper check    # Check bundle size
npm run dev:helper full     # Run all checks (clean → lint → test → build → check)
```

### Build & Cache

#### `clean-cache.sh`
Clean Next.js build cache and artifacts.

```bash
npm run cache:clean
npm run cache:clean --deep  # Also remove node_modules
```

#### `check-bundle-size.js`
Analyze JavaScript bundle sizes after build.

```bash
npm run build
npm run bundle:check
```

Reports:
- Individual chunk sizes (top 20 largest)
- Total bundle size
- Estimated gzipped size
- Warnings for bundles > 200KB
- Recommendations for optimization

## Adding New Scripts

When adding a new script:

1. Create the script file in this directory
2. Make it executable (for shell scripts):
   ```bash
   chmod +x scripts/your-script.sh
   ```
3. Add it to `package.json` scripts section
4. Update this README with usage information
5. Test the script thoroughly

## Script Guidelines

- **Error Handling**: Always check for errors and exit gracefully
- **User Feedback**: Provide clear console output with emojis for visual clarity
- **Documentation**: Include usage information at the top of each script
- **Environment**: Use `dotenv` for environment variables
- **Type Safety**: Use TypeScript where possible, or add JSDoc comments

## Environment Variables Required

Most scripts require these environment variables in `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Common Workflows

### Create and Publish a Post

```bash
# 1. Create from template
npm run post:new blog-post my-post "My New Post"

# 2. Edit the file
# Open my-post.md and add your content

# 3. Insert into database
npm run post:insert my-post.md
```

### Full Development Cycle

```bash
# Clean, lint, test, build, and check
npm run dev:helper full

# Or individual steps
npm run cache:clean
npm install
npm run dev
```

### Backup Before Changes

```bash
# Backup database before risky operations
npm run db:backup
```

---

_Keep scripts updated and documented for maintainability_
