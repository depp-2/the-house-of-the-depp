# Blog Post Templates

This directory contains standardized templates for different types of blog posts.

## Available Templates

### 📝 `blog-post.md` - Standard Blog Post
Use for general blog posts, opinions, and commentary.

**Best for:**
- Technical opinions
- Process sharing
- Personal reflections
- Industry commentary

### 🎓 `tutorial.md` - Technical Tutorial
Use for step-by-step guides and how-to content.

**Best for:**
- Getting started guides
- Implementation walkthroughs
- Tool introductions
- Code tutorials

**Includes:**
- Difficulty level
- Prerequisites
- Step-by-step sections
- Troubleshooting guide

### 🔍 `postmortem.md` - Project Retrospective
Use for reflecting on completed projects.

**Best for:**
- Launch writeups
- Sprint retrospectives
- Experiment results
- Failed projects (learn from failures too!)

**Includes:**
- Success metrics
- Challenges faced
- Decisions & trade-offs
- Timeline comparison
- Lessons learned

## How to Use

1. **Copy the template:**
   ```bash
   cp templates/blog-post.md my-new-post.md
   ```

2. **Fill in placeholders:**
   - Replace `[Title]` with your title
   - Fill in sections
   - Remove unused sections

3. **Update post metadata:**
   - Published date
   - Tags
   - Difficulty level (for tutorials)

4. **Insert into Supabase:**
   ```bash
   # Create an insert script based on insert-first-post.js
   # Or use the admin panel when available
   ```

## Creating New Templates

When you find yourself repeating a structure, create a new template:

1. Copy a similar template
2. Customize for the new use case
3. Update this README
4. Commit with clear message

## Template Guidelines

### Structure
- **Frontmatter**: Title, excerpt, date, tags
- **Introduction**: Hook + what reader will learn
- **Body**: Main content with clear headings
- **Conclusion**: Summary + call to action
- **Metadata**: Links, references, credits

### Formatting
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- Include code blocks with syntax highlighting
- Add alt text for images (when available)
- Use bullet lists for readability

### Content Quality
- Be specific and detailed
- Include real examples
- Share failures, not just successes
- Provide next steps or further reading

---

_Keep templates updated as your blog evolves!_
